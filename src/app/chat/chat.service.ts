import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  AngularFireStorage,
  AngularFireUploadTask
} from '@angular/fire/storage';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, map, first } from 'rxjs/operators';
import { Chat } from './chat';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private uploadTask: AngularFireUploadTask;
  // uploadPercentage$: Observable<number>;
  isUploadActive$: Observable<boolean>;
  chatCollection = this.db.collection<Chat>('chat');

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private authService: AuthService
  ) {}

  getMessages() {
    return this.db
      .collection<Chat>('chat', ref => ref.orderBy('timestamp'))
      .valueChanges();
  }

  async formChat() {
    const { username, userImgUrl } = await this.authService.user;
    return {
      username,
      userImgUrl,
      timestamp: new Date().getTime()
    } as Chat;
  }

  async sendMessage(text: string) {
    this.chatCollection.add({ ...(await this.formChat()), text } as Chat);
  }

  uploadImage(img: File) {
    const filePath = `chat/${new Date().getTime()}_${img.name}`;
    const fileRef = this.storage.ref(filePath);
    this.uploadTask = this.storage.upload(filePath, img);
    // this.uploadPercentage$ = this.uploadTask.percentageChanges();
    const uploadSnapshot$ = this.uploadTask.snapshotChanges();
    this.isUploadActive$ = uploadSnapshot$.pipe(
      map(
        (uploadSnapshot: UploadTaskSnapshot) =>
          uploadSnapshot.state === 'running' &&
          uploadSnapshot.bytesTransferred < uploadSnapshot.totalBytes
      )
    );
    const taskSubscription = uploadSnapshot$
      .pipe(
        finalize(async () => {
          taskSubscription.unsubscribe();
          const imgUrl = await fileRef
            .getDownloadURL()
            .pipe(first())
            .toPromise();
          this.chatCollection.add({
            ...(await this.formChat()),
            imgUrl
          } as Chat);
        })
      )
      .subscribe();
  }
}
