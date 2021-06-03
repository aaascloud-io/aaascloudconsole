import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IfDateComponent } from './if-date.component';

describe('IfDateComponent', () => {
  let component: IfDateComponent;
  let fixture: ComponentFixture<IfDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IfDateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IfDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
