import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChatService} from '../chat-service/chat.service';
import ChatModel from '../model/chat.model';
import {Subscription} from 'rxjs';
import {AuthService} from '../../auth/auth-service/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

  maximized = false;

  connectedUsers = [];
  // @ts-ignore
  messages: [ChatModel] = [];

  user: any;

  subscriptions: Array<Subscription> = new Array<Subscription>();

  constructor(private chatService: ChatService,
              private authService: AuthService) { }

  ngOnDestroy(): void {
        this.subscriptions.forEach(
          (sub: Subscription) => sub.unsubscribe()
        );
    }

  ngOnInit(): void {
    const chatSub = this.chatService.getMessage()
      .subscribe(
        (data: ChatModel) => {
          this.messages.unshift(data);
        },
        (error) => {
          console.log(error);
        }
      );
    this.subscriptions.push(chatSub);
    const userSub = this.authService.getUserObservable()
      .subscribe( (user) => {
        this.user = user;
      } );
    this.subscriptions.push(userSub);
  }

  sendMsg(msg: string): void {
    if (msg.length === 0) { return; }
    this.messages.unshift({
        msg,
        from: this.user.username,
        roomname: this.user.roomname
      });
    this.chatService.sendMessage(msg);
  }

  handleMaximized(): void {
    this.maximized = !this.maximized;
  }
}
