import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatModuleRoutingModule } from './chat-module-routing.module';
import { ChatComponent } from './chat/chat.component';
import {MatIconModule} from '@angular/material/icon';


@NgModule({
  declarations: [ChatComponent],
  exports: [
    ChatComponent,
    MatIconModule
  ],
  imports: [
    CommonModule,
    ChatModuleRoutingModule
  ]
})
export class ChatModuleModule { }
