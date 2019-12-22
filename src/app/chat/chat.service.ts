import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  AngularFireStorage,
  AngularFireUploadTask
} from '@angular/fire/storage';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';
import { Observable, BehaviorSubject } from 'rxjs';
import { finalize, map, mergeMap, take } from 'rxjs/operators';
import { Chat } from './chat';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private uploadTask: AngularFireUploadTask;
  private isUploadActive = new BehaviorSubject<boolean>(false);
  readonly isUploadActive$ = this.isUploadActive.asObservable();
  // uploadPercentage$: Observable<number>;
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
    this.isUploadActive.next(true);
    const filePath = `chat/${new Date().getTime()}_${img.name}`;
    const fileRef = this.storage.ref(filePath);
    this.uploadTask = this.storage.upload(filePath, img);
    const uploadSnapshot$ = this.uploadTask.snapshotChanges();
    // this.uploadPercentage$ = this.uploadTask.percentageChanges();
    // this.isUploadActive$ = uploadSnapshot$.pipe(
    //   map(
    //     (uploadSnapshot: UploadTaskSnapshot) =>
    //       uploadSnapshot.state === 'running' &&
    //       uploadSnapshot.bytesTransferred < uploadSnapshot.totalBytes
    //   )
    // );
    uploadSnapshot$
      .pipe(
        finalize(() => {
          fileRef
            .getDownloadURL()
            .pipe(
              take(1),
              mergeMap((imgUrl: string) =>
                this.formChat().pipe(
                  map(chat =>
                    this.chatCollection
                      .add({ ...chat, imgUrl } as Chat)
                      .then(_ => this.isUploadActive.next(false))
                  )
                )
              )
            )
            .subscribe();
        })
      )
      .subscribe();
  }
}
