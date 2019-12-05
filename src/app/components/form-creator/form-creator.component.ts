import { Component, OnInit, Input } from '@angular/core';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import {
  isStringType,
  isDateType,
  isDropDown,
  isMultiSelect,
  isSlider,
} from 'src/app/constants/utility';

@Component({
  selector: 'app-form-creator',
  templateUrl: './form-creator.component.html',
  styleUrls: ['./form-creator.component.css'],
})
export class FormCreatorComponent implements OnInit {
  @Input()
  selModel: any;

  @Input()
  cols: any[];

  public localFields: Object = { text: 'Name', value: 'Code' };

  public localWaterMark: string = 'Select countries';

  private _tickInterval = 1;

  autoTicks = true;
  disabled = false;
  invert = false;
  showTicks = true;
  step = 1;
  thumbLabel = true;
  value = 0;
  vertical = false;

  constructor() {}

  ngOnInit() {}

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

  get tickInterval(): number | 'auto' {
    return this.showTicks ? (this.autoTicks ? 'auto' : this._tickInterval) : 0;
  }
  set tickInterval(value) {
    this._tickInterval = coerceNumberProperty(value);
  }
}
