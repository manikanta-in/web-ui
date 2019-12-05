import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  isStringType,
  isDateType,
  isDropDown,
  isMultiSelect,
  isSlider,
} from 'src/app/constants/utility';

@Component({
  selector: 'app-table-dialog',
  templateUrl: './table-dialog.component.html',
  styleUrls: ['./table-dialog.component.css'],
})
export class TableDialogComponent implements OnInit {
  @Output() dialogCloseEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  displayDialog: boolean;

  @Input()
  header: string;

  @Input()
  selModel: any;

  @Input()
  cols: any[];

  constructor() {}

  ngOnInit() {
    this.displayDialog = true;
  }

  delete() {
    this.displayDialog = false;
  }

  save() {
    this.displayDialog = false;
  }
  close() {
    this.dialogCloseEvent.emit(this.displayDialog);
  }

  public isDateType(col: any): boolean {
    return isDateType(col);
  }

  public isStringType(col: any): boolean {
    return isStringType(col);
  }

  public isDropDown(col: any): boolean {
    return isDropDown(col);
  }

  public isMultiSelect(col: any): boolean {
    return isMultiSelect(col);
  }

  public isSlider(col: any): boolean {
    return isSlider(col);
  }
}
