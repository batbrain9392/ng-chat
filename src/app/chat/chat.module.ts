import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatRoutingModule } from './chat-routing.module';
import { MaterialModule } from '../theme/material.module';

import { ChatComponent } from './chat.component';
import { ChatInputComponent } from './chat-input/chat-input.component';
import { ChatMessagesComponent } from './chat-messages/chat-messages.component';

@NgModule({
  declarations: [
    ChatComponent, 
    ChatInputComponent, 
    ChatMessagesComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ChatRoutingModule
  ]
})
export class ChatModule { }
