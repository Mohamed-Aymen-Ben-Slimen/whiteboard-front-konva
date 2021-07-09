import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WhiteboardPageComponent } from './whiteboard-page/whiteboard-page.component';
import { ShapeService } from './shape.service';
import { TextNodeService } from './text-node.service';
import {SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
import {environment} from '../environments/environment';
import {AuthModule} from './auth/auth.module';
import {ChatModuleModule} from './chat-module/chat-module.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatButtonModule} from '@angular/material/button';

const configSocket: SocketIoConfig = { url: environment.socketServerURL, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    WhiteboardPageComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatSlideToggleModule,
        AuthModule,
        SocketIoModule.forRoot(configSocket),
        ChatModuleModule
    ],
  providers: [
    ShapeService,
    TextNodeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
