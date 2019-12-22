import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  AngularFireStorage,
  AngularFireUploadTask
} from '@angular/fire/storage';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, map, first, mergeMap } from 'rxjs/operators';
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
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data();
            const { id } = a.payload.doc;
            return { id, ...data } as Chat;
          })
        )
      );
  }

  formChat() {
    return this.authService.user$.pipe(
      map(
        user =>
          ({
            timestamp: new Date().getTime(),
            user
          } as Chat)
      )
    );
  }

  sendMessage(text: string) {
    this.formChat()
      .pipe(map(chat => this.chatCollection.add({ ...chat, text } as Chat)))
      .subscribe();
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
    uploadSnapshot$
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().pipe(
            first(),
            mergeMap((imgUrl: string) => {
              return this.formChat().pipe(
                map(chat =>
                  this.chatCollection.add({ ...chat, imgUrl } as Chat)
                )
              );
            })
          );
        })
      )
      .subscribe();
  }
}
