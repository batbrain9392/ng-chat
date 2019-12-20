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
  private messagesBS = new BehaviorSubject<Chat[]>([]);
  private messages$ = this.messagesBS.asObservable();
  private uploadTask: AngularFireUploadTask;
  // uploadPercentage$: Observable<number>;
  isUploadActive$: Observable<boolean>;

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private authService: AuthService
  ) {}

  getMessages() {
    const messages: Chat[] = [];
    for (let i = 0; i < 50; i++) {
      messages.push({
        id: `${new Date().getTime()}`,
        text: `message ${i}`,
        username: `username${i}`,
        timestamp: new Date().getTime()
      });
    }
    this.messagesBS.next(messages);
    return this.messages$;
  }

  async formChat() {
    const { username, userImgUrl } = await this.authService.user;
    const chat: Chat = {
      username,
      userImgUrl,
      timestamp: new Date().getTime()
    };
    return chat;
  }

  async sendMessage(text: string) {
    const chat = await this.formChat();
    chat.text = text;
    this.messagesBS.next([...this.messagesBS.getValue(), chat]);
    console.log({ chat });
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
          const chat = await this.formChat();
          chat.imgUrl = imgUrl;
          console.log({ chat });
        })
      )
      .subscribe();
  }
}
