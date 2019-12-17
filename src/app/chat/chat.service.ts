import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Chat } from './chat';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messages = new BehaviorSubject<Chat[]>([]);
  private messages$ = this.messages.asObservable();

  constructor() {}

  getMessages() {
    const messages: Chat[] = [];
    for (let i = 0; i < 50; i++) {
      messages.push({
        username: `id${i}`,
        userImgUrl: 'assets/avatar.png',
        text: `message ${i}`
      });
    }
    this.messages.next(messages);
    return this.messages$;
  }

  sendMessage(chat: Chat) {
    this.messages.next([...this.messages.getValue(), chat]);
  }
}
