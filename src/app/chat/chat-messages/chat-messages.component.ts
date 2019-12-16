import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-messages',
  templateUrl: './chat-messages.component.html',
  styleUrls: ['./chat-messages.component.css']
})
export class ChatMessagesComponent implements OnInit {
  messages = [];

  constructor() { }

  ngOnInit() {
    for (let i = 0; i < 50; i++) {
      this.messages.push({
        message: `message ${i}`,
        user: i
      });
    }
  }

}
