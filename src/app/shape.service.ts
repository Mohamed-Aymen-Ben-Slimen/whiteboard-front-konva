import { Injectable } from '@angular/core';
import Konva from 'konva';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class ShapeService {

  constructor() { }

  circle(color: string = 'black', strokeWidth: number = 2): Konva.Circle {
    const circle =  new Konva.Circle({
      x: 100,
      y: 100,
      radius: 70,
      stroke: color,
      strokeWidth,
      draggable: true
    });
    circle._id = uuidv4();
    return circle;
  }

  line(pos: any, mode: string = 'brush', attr: any, color: string = 'black', strokeWidth: number = 2, shapeId: string = '0'): Konva.Line {
    let line;
    if (!attr) {
       line = new Konva.Line({
        stroke: color,
        strokeWidth,
        globalCompositeOperation:
          mode === 'brush' ? 'source-over' : 'destination-out',
        points: [pos.x, pos.y],
        draggable: false
      });
    } else {
      line = new Konva.Line(attr);
    }
    line._id = shapeId === '0' ? uuidv4() : shapeId;
    return line;
  }

  rectangle(color: string = 'black', strokeWidth: number = 2): Konva.Rect {
    const rect = new Konva.Rect({
      x: 20,
      y: 20,
      width: 100,
      height: 50,
      stroke: color,
      strokeWidth,
      draggable: true
    });
    rect._id = uuidv4();
    return rect;
  }

  circleWithAttr(attr: any, shapeId: string = '0'): Konva.Circle {
    const circle =  new Konva.Circle(attr);
    circle._id = shapeId === '0' ? uuidv4() : shapeId;
    return circle;
  }

  lineWithAttr(pos: any, mode: string = 'brush', attr: any, shapeId: string = '0'): Konva.Line {
    const line =  new Konva.Line(attr);
    line._id = shapeId === '0' ? uuidv4() : shapeId;
    return line;
  }

  rectangleWithAttr(attr: any, shapeId: string = '0'): Konva.Rect {
    const rect = new Konva.Rect(attr);
    rect._id = shapeId === '0' ? uuidv4() : shapeId;
    return rect;
  }
}
