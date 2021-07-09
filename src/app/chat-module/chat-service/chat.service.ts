import { Injectable } from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import ChatModel from '../model/chat.model';
import {AuthService} from '../../auth/auth-service/auth.service';
import UserModel from "../../auth/model/User.model";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  eventName = 'chatMsg';

  user: any;

  constructor(private socket: Socket,
              private authService: AuthService) {
    this.authService.getUserObservable()
      .subscribe( (user: UserModel) => {
        this.user = user;
      } );
  }

  sendMessage(msg: string | undefined): void {
    const user = this.user;
    this.socket.emit(this.eventName, {
      roomname: user.roomname,
      from: user.username,
      msg,
    });
  }
  getMessage(): Observable<ChatModel> {
    return this.socket.fromEvent(this.eventName).pipe(map((data: any) => data));
  }
}
