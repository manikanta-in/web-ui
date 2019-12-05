import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { SlideMenuModule } from 'primeng/slidemenu';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { AccordionModule } from 'primeng/components/accordion/accordion';
import { OrderListModule } from 'primeng/orderlist';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SliderModule } from 'primeng/slider';
import { DialogModule } from 'primeng/dialog';


const primeModules = [
  DropdownModule,
  CalendarModule,
  TableModule,
  SlideMenuModule,
  AccordionModule,
  OrderListModule,
  MultiSelectModule,
  DynamicDialogModule,
  InputSwitchModule,
  SliderModule,
  DialogModule
];

@NgModule({
  declarations: [],
  imports: [CommonModule, ...primeModules],
  exports: [...primeModules]
})
export class PrimengModule {}
