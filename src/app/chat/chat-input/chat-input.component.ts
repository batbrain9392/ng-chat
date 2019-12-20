import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatInputComponent {
  text: string;

  constructor(private chatService: ChatService) {}

  onSubmit() {
    this.text = this.text && this.text.trim();
    if (this.text) {
      this.chatService.sendMessage(this.text);
      this.text = null;
    }
  }
}
