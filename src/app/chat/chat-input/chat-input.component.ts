import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Chat } from '../chat';
import { AuthService } from '../../auth/auth.service';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatInputComponent implements OnInit {
  chat = <Chat>{};

  constructor(
    private authService: AuthService,
    private chatService: ChatService
  ) {}

  async ngOnInit() {
    this.chat.timestamp = new Date().getTime();
    const { username, userImgUrl } = await this.authService.user;
    this.chat = { ...this.chat, username, userImgUrl };
  }

  onDrop(file: File) {
    console.log(file.name);
  }

  onSubmit() {
    this.chat.text = this.chat.text && this.chat.text.trim();
    if (this.chat.text) {
      this.chatService.sendMessage({ ...this.chat });
      this.chat.text = null;
    }
  }
}
