import { Injectable } from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WhiteBoardService {

  drawingEventName = 'drawing';

  constructor(private socket: Socket) {}

  sendDrawing(room: string, drawings: any[]): void {
    this.socket.emit(this.drawingEventName, {
      room,
      boardData: drawings,
    });
  }
  getDrawing(): Observable<any> {
    return this.socket.fromEvent(this.drawingEventName).pipe(map((data) => data));
  }
}
