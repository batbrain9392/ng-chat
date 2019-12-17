import {
  Component,
  Input,
  OnChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import { Chat } from '../chat';

@Component({
  selector: 'app-chat-messages',
  templateUrl: './chat-messages.component.html',
  styleUrls: ['./chat-messages.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatMessagesComponent implements OnChanges {
  @Input()
  messages: Chat[];

  constructor() {}

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
