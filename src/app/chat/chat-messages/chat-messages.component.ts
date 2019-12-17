import {
  Component,
  OnInit,
  Input,
  OnChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Chat } from '../chat';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-chat-messages',
  templateUrl: './chat-messages.component.html',
  styleUrls: ['./chat-messages.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatMessagesComponent implements  OnInit, OnChanges {
  @Input()
  messages: Chat[];
  myUsername: string;

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    this.myUsername = (await this.authService.user).username;
  }

  ngOnChanges() {
    setTimeout(
      () =>
        window.scrollTo({
          left: 0,
          top: document.body.scrollHeight,
          behavior: 'auto'
        }),
      200
    );
  }

  trackById(index: number, chat: Chat) {
    return chat.id;
  }
}
