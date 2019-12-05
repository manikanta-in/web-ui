import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-table-md-dialog',
  templateUrl: './table-md-dialog.component.html',
  styleUrls: ['./table-md-dialog.component.css'],
})
export class TableMdDialogComponent implements OnInit {
  title: string;
  cols: any = [];
  selModel: any = {};
  constructor(
    private dialogRef: MatDialogRef<TableMdDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data,
  ) {
    this.title = data ? data.title : '';
    this.cols = data ? data.cols : [];
    this.selModel = data ? data.selModel : {};
  }

  ngOnInit() {}

  close() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.selModel);
  }
}
