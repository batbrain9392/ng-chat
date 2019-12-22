import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { take, filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$ = this.afAuth.user.pipe(
    take(1),
    map(user => {
      if (user) {
        return { displayName: user.displayName, photoURL: user.photoURL };
      }
      return null;
    })
  );

  constructor(private afAuth: AngularFireAuth) {}

  signin() {
    return this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  signout() {
    return this.afAuth.auth.signOut();
  }
}
