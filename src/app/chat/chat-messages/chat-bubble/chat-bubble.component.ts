import {
  Component,
  Input,
  ChangeDetectionStrategy,
  AfterViewInit
} from '@angular/core';
import { Chat } from '../../chat';

@Component({
  selector: 'app-chat-bubble',
  templateUrl: './chat-bubble.component.html',
  styleUrls: ['./chat-bubble.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatBubbleComponent implements AfterViewInit {
  @Input()
  chat: Chat;

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    window.scrollTo({
      left: 0,
      top: document.body.scrollHeight,
      behavior: 'auto'
    });
  }
}
