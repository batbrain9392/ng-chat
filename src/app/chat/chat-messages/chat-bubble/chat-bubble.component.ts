import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Chat } from '../../chat';

@Component({
  selector: 'app-chat-bubble',
  templateUrl: './chat-bubble.component.html',
  styleUrls: ['./chat-bubble.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatBubbleComponent {
  @Input()
  chat: Chat;
}
