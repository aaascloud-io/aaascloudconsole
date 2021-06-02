import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IfInputComponent } from './if-input.component';

describe('IfInputComponent', () => {
  let component: IfInputComponent;
  let fixture: ComponentFixture<IfInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IfInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IfInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
