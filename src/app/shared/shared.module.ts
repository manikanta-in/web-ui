import { DialogComponent } from './../layouts/dialog/dialog.component';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule, DatePipe } from '@angular/common';
import { PrimengModule } from './primeng/primeng.module';
import { MaterialModule } from 'src/app/shared/material/material.module';

import { ConfigTableComponent } from '../components/config-table/config-table.component';
import { MainHeaderComponent } from '../layouts/main-header/main-header.component';
import { MainFooterComponent } from '../layouts/main-footer/main-footer.component';
import { MainLayoutComponent } from '../layouts/main-layout/main-layout.component';
import { TableDialogComponent } from '../components/config-table/table-dialog/table-dialog.component';
import { FormCreatorComponent } from '../components/form-creator/form-creator.component';
import { TableMdDialogComponent } from '../components/config-table/table-md-dialog/table-md-dialog.component';
import { FormMdCreatorComponent } from '../components/form-md-creator/form-md-creator.component';
import { SortByPipe } from './../pipes/sort-pipe';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    FontAwesomeModule,
    FormsModule,
    PrimengModule,
    MaterialModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpClientModule,
  ],
  declarations: [
    MainHeaderComponent,
    MainFooterComponent,
    MainLayoutComponent,
    TableDialogComponent,
    ConfigTableComponent,
    FormCreatorComponent,
    TableMdDialogComponent,
    FormMdCreatorComponent,
    DialogComponent,
    SortByPipe,
  ],
  entryComponents: [TableMdDialogComponent],
  exports: [
    ConfigTableComponent,
    TableDialogComponent,
    FormCreatorComponent,
    DialogComponent,
    DatePipe,
    SortByPipe,
  ],
})
export class SharedModule {}
