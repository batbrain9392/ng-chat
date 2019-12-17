import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Chat } from './chat';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent implements OnInit {
  messages$: Observable<Chat[]>;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.messages$ = this.chatService.getMessages();
  }
}
