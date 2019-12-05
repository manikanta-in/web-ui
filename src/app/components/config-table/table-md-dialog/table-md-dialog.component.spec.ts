import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableMdDialogComponent } from './table-md-dialog.component';

describe('TableMdDialogComponent', () => {
  let component: TableMdDialogComponent;
  let fixture: ComponentFixture<TableMdDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableMdDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableMdDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
