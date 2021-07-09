import { Injectable } from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Types} from '../../Types.enum';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class WhiteBoardService {

  drawingEventName = 'drawing';

  constructor(private socket: Socket) {}

  sendNewDrawing(room: string, drawings: any): void {
    this.socket.emit(this.drawingEventName, {
      type: Types.NEW,
      room,
      boardData: drawings,
      shapeId: uuidv4()
    });
  }
  getDrawing(): Observable<any> {
    return this.socket.fromEvent(this.drawingEventName).pipe(map((data) => data));
  }
}
