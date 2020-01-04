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
import { environment } from '../../environments/environment';
import { Chat } from './chat';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private chatCollection = this.db.collection<Chat>('chat');
  private uploadTask: AngularFireUploadTask;
  private isUploadActive = new BehaviorSubject<boolean>(false);
  private fileRef: AngularFireStorageReference;
  readonly isUploadActive$ = this.isUploadActive.asObservable();

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
    const predict$ = this.getPredictionStream(img);
    const firebaseUpload$ = this.getFirebaseUploadStream(img);
    predict$
      .pipe(
        take(1),
        mergeMap(predictedCaption =>
          firebaseUpload$.pipe(
            finalize(() =>
              this.getImageUrlAndAddToChat(this.fileRef, predictedCaption)
            )
          )
        ),
        catchError(err => this.errHandler(err))
      )
      .subscribe();
  }

  private getPredictionStream(img: File) {
    const predictionAPI = `${environment.predictionURI}/model/predict`;
    const formData = new FormData();
    formData.append('image', img);
    return this.httpClient.post(predictionAPI, formData).pipe(
      map(({ predictions }: any) => {
        console.table(predictions);
        return predictions[0].caption as string;
      })
    );
  }

  private getFirebaseUploadStream(img: File) {
    const filePath = `chat/${new Date().getTime()}_${img.name}`;
    this.fileRef = this.storage.ref(filePath);
    this.uploadTask = this.storage.upload(filePath, img);
    return this.uploadTask.snapshotChanges();
  }

  private getImageUrlAndAddToChat(
    fileRef: AngularFireStorageReference,
    text: string
  ) {
    fileRef
      .getDownloadURL()
      .pipe(
        take(1),
        mergeMap((imgUrl: string) => this.addToChat(text, imgUrl))
      )
      .subscribe();
  }

  private addToChat(text: string, imgUrl: string) {
    return this.formChat().pipe(
      map(chat =>
        this.chatCollection
          .add({ ...chat, imgUrl, text } as Chat)
          .then(() => this.isUploadActive.next(false))
      )
    );
  }

  private errHandler(err: any) {
    this.isUploadActive.next(false);
    console.error(err);
    this.matSnackBar.open(
      'AI server crashed. Please try after some time with a small PNG image.',
      'CLOSE'
    );
    return of(null);
  }
}
