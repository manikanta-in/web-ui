import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import {
  isStringType,
  isDateType,
  isDropDown,
  isMultiSelect,
  isSlider,
} from 'src/app/constants/utility';

@Component({
  selector: 'app-form-md-creator',
  templateUrl: './form-md-creator.component.html',
  styleUrls: ['./form-md-creator.component.css'],
})
export class FormMdCreatorComponent implements OnInit {
  autoTicks = true;
  disabled = false;
  invert = false;
  showTicks = true;
  step = 1;
  thumbLabel = true;
  value = 0;
  vertical = false;
  todayDate = new Date();
  tickInterval = 1;

  @Input()
  selModel: any;

  @Input()
  cols: any[];

  constructor() {}

  ngOnInit() {
    this.cols = this.cols.filter(col => col.formAdd !== false);
  }

  public isDateType(col: any): boolean {
    return isDateType(col);
  }

  public isStringType(col: any): boolean {
    return isStringType(col) && col.formAdd !== false;
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

  public changeDate(field, event): void {
    this.selModel[field] = event.value;
  }

  public isDisabled(col): boolean {
    if (col.disabled) {
      if (col.disabled.condition === 'equals null') {
        return !this.selModel[col.disabled.field];
      }
    }
    return false;
  }

  public getMinDate(col): Date {
    if (col.initialValue) {
      if (col.initialValue.condition === 'after') {
        return this.selModel[col.disabled.field];
      }
    }
    return null;
  }

  public getMaxDate(col): Date {
    return this.todayDate;
  }
}
