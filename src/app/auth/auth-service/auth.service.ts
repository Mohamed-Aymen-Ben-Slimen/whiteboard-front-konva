import { Injectable } from '@angular/core';
import {Socket} from 'ngx-socket-io';
import UserModel from '../model/User.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private eventComing = 'coming';
  private user: UserModel;

  constructor(private socket: Socket) {
    this.user = new UserModel('', '');
  }

  login(username: string, roomname: string): void {
    this.user = new UserModel(username, roomname);
  }

  getUser(): UserModel {
    return this.user;
  }

  sendComing(data: any): void {
    this.socket.emit(this.eventComing, data);
  }
}
