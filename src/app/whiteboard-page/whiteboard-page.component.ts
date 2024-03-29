import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import Konva from 'konva';
import { ShapeService } from '../shape.service';
import { TextNodeService } from '../text-node.service';
import {WhiteBoardService} from './services/white-board.service';
import {AuthService} from '../auth/auth-service/auth.service';
import {Types} from '../Types.enum';
import UserModel from '../auth/model/User.model';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-whiteboard-page',
  templateUrl: './whiteboard-page.component.html',
  styleUrls: ['./whiteboard-page.component.scss']
})
export class WhiteboardPageComponent implements OnInit, AfterViewInit {

  @ViewChild('whiteboardContainer') whiteboardContainer: ElementRef | undefined;

  shapes: any = [];
  stage!: Konva.Stage;
  s!: Konva.Stage;
  layer!: Konva.Layer;
  selectedButton: any = {
    circle: false,
    rectangle: false,
    line: false,
    undo: false,
    erase: false,
    text: false
  };
  erase = false;
  transformers: Konva.Transformer[] = [];

  darkModeActive = false;

  color1 = 'black';
  color2 = 'white';
  currentColor = 'black';
  currentStrokeWidth = 2;

  public fontfamilys = [
    {title: 'Arial', value: 'Arial, sans-serif'},
    {title: 'Verdana', value: 'Verdana, sans-serif'},
    {title: 'Helvetica', value: 'Helvetica, sans-serif'},
    {title: 'Tahoma', value: 'Tahoma, sans-serif'},
    {title: 'Trebuchet MS', value: 'Trebuchet MS, sans-serif'},
    {title: 'Georgia', value: 'Georgia, serif'},
    {title: 'Garamond', value: 'Garamond, serif'},
    {title: 'Times New Roman', value: 'Times New Roman'},
    {title: 'Palatino Linotype', value: 'Palatino Linotype'},
    {title: 'Courier New', value: 'Courier New'},
    {title: 'Brush Script MT', value: 'Brush Script MT'},
  ];
  currentFont = this.fontfamilys[0].value;

  selectedColorNumber = 1;

  page = 1;

  user: any;

  constructor(
    private shapeService: ShapeService,
    private textNodeService: TextNodeService,
    private whiteBoardService: WhiteBoardService,
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.getUserObservable().subscribe(
      (user: UserModel) => {
        console.log(user);
        this.user = user;
      }
    );
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const width = this.whiteboardContainer?.nativeElement.offsetWidth;
    const height = this.whiteboardContainer?.nativeElement.offsetHeight;
    console.log(this.whiteboardContainer);
    //  console.log(width, height);
    this.stage = new Konva.Stage({
      container: 'white-board',
      width,
      height
    });

    this.s = this.stage;

    this.layer = new Konva.Layer();
    this.stage.add(this.layer);
    this.addLineListeners();

    this.whiteBoardService.listenForClear()
        .subscribe( () => { this.clearBoard(); } );

    this.whiteBoardService.listenForDrawing()
        .subscribe( (data: any) => {
          if (data.type === Types.NEW) {
            const newDrawing = JSON.parse( data.boardData );
            this.addShapeWithAttr(newDrawing.className.toLowerCase(), newDrawing.attrs, data.shapeId);
          } else if (data.type === Types.UPDATE) {
            const updatedDrawing = JSON.parse(data.boardData);
            this.removeShapeById(data.shapeId);
            this.addShapeWithAttr(updatedDrawing.className.toLowerCase(), updatedDrawing.attrs, data.shapeId);
            this.layer.batchDraw();
          } else if (data.type === Types.DELETE) {
            this.removeShapeById(data.shapeId);
          }
        });
  }

  logout(): void {
    this.router.navigateByUrl('/');
  }

  clearSelection(): void {
    Object.keys(this.selectedButton).forEach(key => {
      this.selectedButton[key] = false;
    });
  }

  setSelection(type: string): void {
    this.selectedButton[type] = true;
  }

  addShape(type: string, send = false): void {
    this.clearSelection();
    this.setSelection(type);
    if (type === 'circle') {
      this.addCircle(null, '0', true);
    }
    else if (type === 'line') {
      this.addLine();
    }
    else if (type === 'rectangle') {
      this.addRectangle(null, '0', true);
    }
    else if (type === 'text') {
      this.addText(null, '0', true);
    }
  }

  addShapeWithAttr(type: string, attr: any, shapeId: string, send = false): void {
    if (type === 'circle') {
      this.addCircle(attr, shapeId, send);
    }
    else if (type === 'line') {
      const line = this.shapeService.lineWithAttr(null, '', attr, shapeId);
      this.shapes.push(line);
      this.layer.add(line);
      this.stage.add(this.layer);
      if (send) { this.whiteBoardService.sendNewDrawing( this.user.roomname, line ); }
    }
    else if (type === 'rect') {
      this.addRectangle(attr, shapeId, send);
    }
    else if (type === 'text') {
      this.addText(attr, shapeId, send);
    }
  }

  addText(attr = null, shapeId: string, send = false): void {
    const text = !attr ? this.textNodeService.textNode(this.stage, this.layer) : this.textNodeService.textNodeWithAttr(this.stage, this.layer, attr, shapeId);
    text.textNode.on('transformend', () => {
      this.whiteBoardService.sendUpdateDrawing( this.user.roomname, this.getShapeById(text.textNode._id));
    });
    text.textNode.on('dragend', () => {
      this.whiteBoardService.sendUpdateDrawing( this.user.roomname, this.getShapeById(text.textNode._id));
    });
    this.shapes.push(text.textNode);
    this.transformers.push(text.tr);
    if (send) { this.whiteBoardService.sendNewDrawing( this.user.roomname, text.textNode ); }
  }

  addCircle(attr = null, shapeId: string = '0', send = false): void {
    const circle = !attr ? this.shapeService.circle(this.currentColor, this.currentStrokeWidth) : this.shapeService.circleWithAttr(attr, shapeId);
    circle.on('transformend', () => {
      this.whiteBoardService.sendUpdateDrawing( this.user.roomname, this.getShapeById(circle._id));
    });
    circle.on('dragend', () => {
      this.whiteBoardService.sendUpdateDrawing( this.user.roomname, this.getShapeById(circle._id));
    });
    this.shapes.push(circle);
    this.layer.add(circle);
    this.stage.add(this.layer);
    this.addTransformerListeners();
    if (send) { this.whiteBoardService.sendNewDrawing( this.user.roomname, circle ); }
  }

  addRectangle(attr = null, shapeId: string = '0', send = false): void {
    const rectangle = !attr ? this.shapeService.rectangle(this.currentColor, this.currentStrokeWidth) : this.shapeService.rectangleWithAttr(attr, shapeId);
    rectangle.on('transformend', () => {
      this.whiteBoardService.sendUpdateDrawing( this.user.roomname, this.getShapeById(rectangle._id));
    });
    rectangle.on('dragend', () => {
      this.whiteBoardService.sendUpdateDrawing( this.user.roomname, this.getShapeById(rectangle._id));
    });
    this.shapes.push(rectangle);
    this.layer.add(rectangle);
    this.stage.add(this.layer);
    this.addTransformerListeners();
    if (send) { this.whiteBoardService.sendNewDrawing( this.user.roomname, rectangle ); }
  }

  addLine(): void {
    this.selectedButton.line = true;
  }

  addLineListeners(): void {
    const component = this;
    let lastLine: any;
    let isPaint: any;
    this.stage.on('mousedown touchstart', (e) => {
      if (!component.selectedButton.line && !component.erase) {
        return;
      }
      isPaint = true;
      const pos = component.stage.getPointerPosition();
      const mode = component.erase ? 'erase' : 'brush';
      lastLine = component.shapeService.line(pos, mode, null, this.currentColor, this.currentStrokeWidth);
      component.layer.add(lastLine);
    });
    this.stage.on('mouseup touchend', () => {
      if (isPaint) {
        component.shapes.push(lastLine);
        this.whiteBoardService.sendNewDrawing( this.user.roomname, lastLine );
      }
      isPaint = false;
    });
    // and core function - drawing
    this.stage.on('mousemove touchmove', () => {
      if (!isPaint) {
        return;
      }
      const position: any = component.stage.getPointerPosition();
      const newPoints = lastLine.points().concat([position.x, position.y]);
      lastLine.points(newPoints);
      component.layer.batchDraw();
    });
  }

  undo(): void {
    const removedShape = this.shapes.pop();
    this.transformers.forEach(t => {
      t.detach();
    });
    if (removedShape) {
      removedShape.destroy();
    }
    this.whiteBoardService.sendDeleteDrawing( this.user.roomname, removedShape);
    this.layer.draw();
  }

  addTransformerListeners(): void {
    const component = this;
    const tr = new Konva.Transformer();
    this.stage.on('click', (e) => {
      if (!this.stage.clickStartShape) {
        return;
      }
      if (e.target._id === this.stage.clickStartShape._id) {
        component.addDeleteListener(e.target);
        component.layer.add(tr);
        // tr.attachTo(e.target);
        tr.nodes([e.target]);
        component.transformers.push(tr);
        component.layer.draw();
      }
      else {
        tr.detach();
        component.layer.draw();
      }
    });
  }

  addDeleteListener(shape: any): void {
    const component = this;
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Delete') {
        shape.remove();
        component.transformers.forEach(t => {
          t.detach();
        });
        const selectedShape = component.shapes.find((s: any) => s._id === shape._id);
        selectedShape.remove();
        e.preventDefault();
      }
      component.layer.batchDraw();
    });
  }

  clearBoard(send = false): void {
    this.transformers.forEach(t => {
      t.detach();
    });
    this.shapes.forEach( (shape: Konva.Shape) => {
      shape.destroy();
    } );
    this.shapes = [];
    if (send) {
      this.whiteBoardService.sendClearBoard(this.user.roomname);
    }
    this.layer.draw();
  }

  removeShapeById(id: any): void {
    this.getShapeById(id).destroy();
    this.shapes = this.shapes.filter( (shape: Konva.Shape) => shape._id !== id);
    this.layer.draw();
  }


  getShapeById(id: any): Konva.Shape {
    return this.shapes.find((s: any) => s._id === id);
  }

  changeColor(colorNumber: number): void {

  }

  changeStrokeWidth(target: any): void {
    this.currentStrokeWidth = target.value;
    console.log(this.currentStrokeWidth);
    console.log(target);
  }

  handleDarkMode(): void {
    this.darkModeActive = !this.darkModeActive;
    this.currentColor = 'white';
  }

  saveBoard(): void {
    this.whiteBoardService.saveBoard()
      .subscribe(
        (data) => {
          console.log(data);
        }
      );
  }

  changePage(page: number): void {
    this.page = page;
  }

  changeLayer1(): void {
    console.log(this.stage);
    this.stage = new Konva.Stage({
        container: 'white-board',
        width: this.whiteboardContainer?.nativeElement.offsetWidth,
        height: this.whiteboardContainer?.nativeElement.offsetHeight
      });
    this.layer = new Konva.Layer();
    this.stage.add(this.layer);
    this.addLineListeners();

    this.whiteBoardService.listenForClear()
      .subscribe( () => { this.clearBoard(); } );

    this.whiteBoardService.listenForDrawing()
      .subscribe( (data: any) => {
        if (data.type === Types.NEW) {
          const newDrawing = JSON.parse( data.boardData );
          this.addShapeWithAttr(newDrawing.className.toLowerCase(), newDrawing.attrs, data.shapeId);
        } else if (data.type === Types.UPDATE) {
          const updatedDrawing = JSON.parse(data.boardData);
          this.removeShapeById(data.shapeId);
          this.addShapeWithAttr(updatedDrawing.className.toLowerCase(), updatedDrawing.attrs, data.shapeId);
          this.layer.batchDraw();
        } else if (data.type === Types.DELETE) {
          this.removeShapeById(data.shapeId);
        }
      });
    console.log(this.stage);
  }

  changeLayer2(): void {
    console.log(this.stage);
    this.stage = this.s;
    console.log(this.stage);
  }
}
