import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChatService} from '../chat-service/chat.service';
import ChatModel from '../model/chat.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

  constructor(private chatService: ChatService) { }

  data: ChatModel | undefined;
  writtenMsg: string | undefined;

  subscriptions: Array<Subscription> = new Array<Subscription>();

  ngOnDestroy(): void {
        this.subscriptions.forEach(
          (sub: Subscription) => sub.unsubscribe()
        );
    }

  ngOnInit(): void {
    const chatSub = this.chatService.getMessage()
      .subscribe(
        (data: ChatModel) => {
          console.log(data);
          this.data = data;
        },
        (error) => {
          console.log(error);
        }
      );
    this.subscriptions.push(chatSub);
  }

  handleWrittenMsg(target: EventTarget | null): void {
    this.writtenMsg = (target as HTMLInputElement).value;
  }

  sendMsg(): void {
    this.chatService.sendMessage(this.writtenMsg);
  }

}
