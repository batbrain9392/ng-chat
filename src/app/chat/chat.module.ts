import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatRoutingModule } from './chat-routing.module';
import { MaterialModule } from '../material/material.module';

import { ChatComponent } from './chat.component';

@NgModule({
  declarations: [ChatComponent],
  imports: [
    CommonModule,
    ChatRoutingModule,
    MaterialModule
  ]
})
export class ChatModule { }
