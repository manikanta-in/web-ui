import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({ name: 'sortBy' })
export class SortByPipe implements PipeTransform {
  transform(value: any[], column: string, order: 'asc' | 'desc' = 'asc'): any[] {
    if (!value) {
      return value;
    }
    if (!column || column === '') {
      console.log('values sorted applied');
      console.log(value);
      return value.sort();
    }
    if (value.length <= 1) {
      return value;
    } // array with only one item
    return _.orderBy(value, [column], [order]);
  }
}
