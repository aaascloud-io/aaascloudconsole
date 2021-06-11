import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IfcsDateComponent } from './ifcs-date.component';

describe('IfDateComponent', () => {
  let component: IfcsDateComponent;
  let fixture: ComponentFixture<IfcsDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IfcsDateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IfcsDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
