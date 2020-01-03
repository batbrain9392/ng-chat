import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  AngularFireStorage,
  AngularFireUploadTask,
  AngularFireStorageReference
} from '@angular/fire/storage';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, of } from 'rxjs';
import { finalize, map, mergeMap, take, catchError } from 'rxjs/operators';
import { Chat } from './chat';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private uploadTask: AngularFireUploadTask;
  private isUploadActive = new BehaviorSubject<boolean>(false);
  readonly isUploadActive$ = this.isUploadActive.asObservable();
  chatCollection = this.db.collection<Chat>('chat');

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private authService: AuthService,
    private httpClient: HttpClient,
    private matSnackBar: MatSnackBar
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
    uploadSnapshot$
      .pipe(finalize(() => this.getImageUrlAndAddToChat(fileRef)))
      .subscribe();
  }

  private getImageUrlAndAddToChat(fileRef: AngularFireStorageReference) {
    fileRef
      .getDownloadURL()
      .pipe(
        take(1),
        mergeMap((imgUrl: string) => this.predictCaptionAndAddToChat(imgUrl))
      )
      .subscribe();
  }

  private predictCaptionAndAddToChat(imgUrl: string) {
    return this.httpClient
      .get(`https://ff713e1f.ngrok.io/predict?image=${btoa(imgUrl)}`)
      .pipe(
        take(1),
        mergeMap(({ predictions }: any) => this.addToChat(predictions, imgUrl)),
        catchError(err => this.errHandler(err, imgUrl)),
        finalize(() => this.isUploadActive.next(false))
      );
  }

  private addToChat(predictions: any[], imgUrl: string) {
    console.table(predictions);
    const text = predictions[0].caption;
    return this.formChat().pipe(
      map(chat =>
        this.chatCollection.add({
          ...chat,
          imgUrl,
          text
        } as Chat)
      )
    );
  }

  private errHandler(err: any, imgUrl: string) {
    console.error(err);
    this.storage.storage.refFromURL(imgUrl).delete();
    this.matSnackBar.open(
      'Server not reachable. Please try again after some time.',
      'CLOSE'
    );
    return of(null);
  }
}
