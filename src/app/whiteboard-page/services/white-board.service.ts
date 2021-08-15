import { Injectable } from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Types} from '../../Types.enum';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {AuthService} from "../../auth/auth-service/auth.service";
import UserModel from "../../auth/model/User.model";

@Injectable({
  providedIn: 'root'
})
export class WhiteBoardService {

  user: any;

  drawingEventName = 'drawing';
  clearEventName = 'clear';

  constructor(private socket: Socket,
              private http: HttpClient,
              private authService: AuthService) {
    this.authService.getUserObservable().subscribe(
      (user: UserModel) => {
        console.log(user);
        this.user = user;
      }
    );
  }

  sendNewDrawing(room: string, drawing: any): void {
    this.socket.emit(this.drawingEventName, {
      type: Types.NEW,
      room,
      boardData: drawing,
      shapeId: drawing._id,
    });
  }

  sendUpdateDrawing(room: string, drawing: any): void {
    this.socket.emit(this.drawingEventName, {
      type: Types.UPDATE,
      room,
      boardData: drawing,
      shapeId: drawing._id,
    });
  }

  sendDeleteDrawing(room: string, drawing: any): void {
    this.socket.emit(this.drawingEventName, {
      type: Types.DELETE,
      room,
      boardData: drawing,
      shapeId: drawing._id,
    });
  }

  listenForDrawing(): Observable<any> {
    return this.socket.fromEvent(this.drawingEventName).pipe(map((data) => data));
  }

  sendClearBoard(room: string): void {
    this.socket.emit(this.clearEventName, {
      room,
    });
  }

  listenForClear(): Observable<any> {
    return this.socket.fromEvent(this.clearEventName);
  }

  saveBoard(): Observable<any> {
    return this.http.post(
      `${environment.serverURL}/api/rooms/save`,
      {roomname: this.user.roomname}
    );
  }
}
