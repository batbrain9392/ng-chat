import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { take, filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$ = this.afAuth.user.pipe(take(1));
  user = this.user$
    .pipe(
      filter(user => !!user),
      map(({ displayName, photoURL }) => ({ displayName, photoURL }))
    )
    .toPromise();

  constructor(private afAuth: AngularFireAuth) {}

  signin() {
    return this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  signout() {
    return this.afAuth.auth.signOut();
  }
}
