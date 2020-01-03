import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Chat } from '../chat';

@Component({
  selector: 'app-chat-messages',
  templateUrl: './chat-messages.component.html',
  styleUrls: ['./chat-messages.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatMessagesComponent {
  @Input()
  messages: Chat[];
  myUsername: string;

  chatId(_index: number, { id }: Chat) {
    return id;
  }
}
