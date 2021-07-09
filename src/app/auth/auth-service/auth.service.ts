import { Injectable } from '@angular/core';
import {Socket} from 'ngx-socket-io';
import UserModel from '../model/User.model';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private eventComing = 'coming';
  private userSubject: BehaviorSubject<UserModel> = new BehaviorSubject<UserModel>(new UserModel('', ''));
  private userObservable = this.userSubject.asObservable();

  constructor(private socket: Socket) {
  }

  login(username: string, roomname: string): void {
    this.userSubject.next( new UserModel(username, roomname) );
  }

  getUserObservable(): Observable<UserModel> {
    return this.userObservable;
  }

  sendComing(data: any): void {
    this.socket.emit(this.eventComing, data);
  }
}
