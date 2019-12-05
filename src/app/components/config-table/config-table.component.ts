import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  isStringType,
  isDateType,
  isDropDown,
  isMultiSelect,
  isSlider,
  isSliderToggle,
} from 'src/app/constants/utility';
import { MatDialog, MatDialogConfig, MatDialogRef, MatSlideToggleChange } from '@angular/material';
import { TableMdDialogComponent } from './table-md-dialog/table-md-dialog.component';

@Component({
  selector: 'app-config-table',
  templateUrl: './config-table.component.html',
  styleUrls: ['./config-table.component.css'],
})
export class ConfigTableComponent implements OnInit {
  @Input()
  data: any[];

  @Input()
  cols: any[];

  @Input()
  isAdd: boolean;

  @Output() formDataSave: EventEmitter<any> = new EventEmitter<any>();

  @Output() stateChangeEvent: EventEmitter<any> = new EventEmitter<any>();

  displayDialog: boolean;

  selModel: any = {};

  updateModel: any = null;

  addLabel = 'Add';

  @Input()
  header = 'Config Data Table';

  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  public isStringType(col: any): boolean {
    return isStringType(col);
  }

  public isDateType(col: any): boolean {
    return isDateType(col);
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

  public isSliderToggle(col: any): boolean {
    return isSliderToggle(col);
  }

  /**
   *
   */
  onRowSelect(event) {
    this.updateModel = JSON.parse(JSON.stringify(event.data));

    this.displayDialog = false;
    this.addLabel = 'Update';
  }

  onRowUnselect(event) {
    this.updateModel = null;
    this.addLabel = 'Add';
  }

  showDialogToAdd() {
    this.cols.forEach(col => {
      this.selModel[col.field] = '';
    });
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      cols: this.cols,
      selModel: this.updateModel || this.selModel,
      title: this.header,
    };
    const dialogRef: MatDialogRef<TableMdDialogComponent> = this.dialog.open(
      TableMdDialogComponent,
      dialogConfig,
    );
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.formDataSave.emit({action: this.addLabel, data});
      }
    });
  }

  onToggleChange(event: MatSlideToggleChange, rowData: any) {
    this.stateChangeEvent.emit({ event, rowData });
  }

  onCloseDialog(event: boolean) {
    this.displayDialog = event;
  }

  public isChecked(rowData: any): boolean {
    rowData.checked = rowData.status === 'ACTIVE';
    return rowData.status === 'ACTIVE';
  }

  deleteData(): void {
    this.formDataSave.emit({action: 'delete', data: this.updateModel});
  }



}
