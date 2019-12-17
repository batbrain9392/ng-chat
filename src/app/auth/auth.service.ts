import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userBS = new BehaviorSubject<User>({
    username: 'username',
    userImgUrl: ''
  });
  user = this.userBS
    .asObservable()
    .pipe(first())
    .toPromise();

  constructor() {}

  signin() {
    this.userBS.next({
      username: 'username',
      userImgUrl: ''
    });
  }

  signout() {
    this.userBS.next(null);
  }
}
