import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IfcsTextareaComponent } from './ifcs-textarea.component';

describe('IfTextareaComponent', () => {
  let component: IfcsTextareaComponent;
  let fixture: ComponentFixture<IfcsTextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IfcsTextareaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IfcsTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
