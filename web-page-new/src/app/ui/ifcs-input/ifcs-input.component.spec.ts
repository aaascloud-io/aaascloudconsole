import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IfcsInputComponent } from './ifcs-input.component';

describe('IfInputComponent', () => {
  let component: IfcsInputComponent;
  let fixture: ComponentFixture<IfcsInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IfcsInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IfcsInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
