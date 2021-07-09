import { Injectable } from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Types} from '../../Types.enum';
import Konva from 'konva';

@Injectable({
  providedIn: 'root'
})
export class WhiteBoardService {

  drawingEventName = 'drawing';

  constructor(private socket: Socket) {}

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

  getDrawing(): Observable<any> {
    return this.socket.fromEvent(this.drawingEventName).pipe(map((data) => data));
  }
}
