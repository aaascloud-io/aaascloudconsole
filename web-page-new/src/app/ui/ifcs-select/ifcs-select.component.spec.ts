import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IfcsSelectComponent } from './ifcs-select.component';

describe('IfSelectComponent', () => {
  let component: IfcsSelectComponent;
  let fixture: ComponentFixture<IfcsSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IfcsSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IfcsSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
