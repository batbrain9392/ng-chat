import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ChatRoutingModule } from './chat-routing.module';

import { ChatComponent } from './chat.component';
import { ChatInputComponent } from './chat-input/chat-input.component';
import { ChatMessagesComponent } from './chat-messages/chat-messages.component';
import { ChatBubbleComponent } from './chat-messages/chat-bubble/chat-bubble.component';
import { UploadComponent } from './chat-input/upload/upload.component';

import { IsMePipe } from './chat-messages/chat-bubble/is-me.pipe';
import { OptionsComponent } from './chat-input/options/options.component';

@NgModule({
  declarations: [
    ChatComponent,
    ChatInputComponent,
    ChatMessagesComponent,
    ChatBubbleComponent,
    UploadComponent,
    IsMePipe,
    OptionsComponent
  ],
  imports: [CommonModule, SharedModule, ChatRoutingModule]
})
export class ChatModule {}
