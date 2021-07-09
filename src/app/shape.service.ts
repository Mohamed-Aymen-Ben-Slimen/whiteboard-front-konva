import { Injectable } from '@angular/core';
import Konva from 'konva';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class ShapeService {

  constructor() { }

  circle(): Konva.Circle {
    const circle =  new Konva.Circle({
      x: 100,
      y: 100,
      radius: 70,
      stroke: 'black',
      strokeWidth: 2,
      draggable: true
    });
    circle._id = uuidv4();
    console.log(circle);
    return circle;
  }

  line(pos: any, mode: string = 'brush', attr: any): Konva.Line {
    let line;
    if (!attr) {
       line = new Konva.Line({
        stroke: 'red',
        strokeWidth: 2,
        globalCompositeOperation:
          mode === 'brush' ? 'source-over' : 'destination-out',
        points: [pos.x, pos.y],
        draggable: false
      });
    } else {
      line = new Konva.Line(attr);
    }
    line._id = uuidv4();
    return line;
  }

  rectangle(): Konva.Rect {
    const rect = new Konva.Rect({
      x: 20,
      y: 20,
      width: 100,
      height: 50,
      stroke: 'black',
      strokeWidth: 2,
      draggable: true
    });
    rect._id = uuidv4();
    return rect;
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
