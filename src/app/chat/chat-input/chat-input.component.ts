import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Chat } from '../chat';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatInputComponent {
  chat: Chat = {
    id: `${new Date().getTime()}`,
    username: 'username',
    userImgUrl: 'assets/avatar.png',
    text: ''
  };

  constructor(private chatService: ChatService) {}

  onSubmit() {
    this.chat.text = this.chat.text && this.chat.text.trim();
    if (this.chat.text) {
      this.chatService.sendMessage({ ...this.chat });
      this.chat.text = null;
    }
  }
}
