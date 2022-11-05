import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-pages-list',
  templateUrl: './pages-list.component.html',
  styleUrls: ['./pages-list.component.scss']
})
export class PagesListComponent implements OnInit {

  @Input() pagesLength = 10;

  @Output() selectedPageEvent = new EventEmitter<number>();

  pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  selected = 1;

  constructor() { }

  ngOnInit(): void {
  }

  selectPage(page: number): void {
    this.selected = page;
    this.selectedPageEvent.emit(page);
  }

}
