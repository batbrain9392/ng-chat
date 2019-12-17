import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ChatRoutingModule } from './chat-routing.module';

import { ChatComponent } from './chat.component';
import { ChatInputComponent } from './chat-input/chat-input.component';
import { ChatMessagesComponent } from './chat-messages/chat-messages.component';
import { ChatBubbleComponent } from './chat-messages/chat-bubble/chat-bubble.component';

@NgModule({
  declarations: [
    ChatComponent,
    ChatInputComponent,
    ChatMessagesComponent,
    ChatBubbleComponent
  ],
  imports: [CommonModule, SharedModule, ChatRoutingModule]
})
export class ChatModule {}
