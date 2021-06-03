import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IfTextareaComponent } from './if-textarea.component';

describe('IfTextareaComponent', () => {
  let component: IfTextareaComponent;
  let fixture: ComponentFixture<IfTextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IfTextareaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IfTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
