import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMdCreatorComponent } from './form-md-creator.component';

describe('FormMdCreatorComponent', () => {
  let component: FormMdCreatorComponent;
  let fixture: ComponentFixture<FormMdCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormMdCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormMdCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
