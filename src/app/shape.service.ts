import { Injectable } from '@angular/core';
import Konva from 'konva';

@Injectable({
  providedIn: 'root'
})
export class ShapeService {

  constructor() { }

  circle(): Konva.Circle {
    return new Konva.Circle({
      x: 100,
      y: 100,
      radius: 70,
      stroke: 'black',
      strokeWidth: 2,
      draggable: true
    });
  }

  line(pos: any, mode: string = 'brush', attr: any): Konva.Line {
    if (!attr) {
      return new Konva.Line({
        stroke: 'red',
        strokeWidth: 2,
        globalCompositeOperation:
          mode === 'brush' ? 'source-over' : 'destination-out',
        points: [pos.x, pos.y],
        draggable: false
      });
    }
    return new Konva.Line(attr);
  }

  rectangle(): Konva.Rect {
    return new Konva.Rect({
      x: 20,
      y: 20,
      width: 100,
      height: 50,
      stroke: 'black',
      strokeWidth: 2,
      draggable: true
    });
  }

  circleWithAttr(attr: any): Konva.Circle {
    return new Konva.Circle(attr);
  }

  lineWithAttr(pos: any, mode: string = 'brush', attr: any): Konva.Line {
    return new Konva.Line(attr);
  }

  rectangleWithAttr(attr: any): Konva.Rect {
    return new Konva.Rect(attr);
  }
}
