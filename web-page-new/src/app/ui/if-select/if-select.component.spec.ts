import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IfSelectComponent } from './if-select.component';

describe('IfSelectComponent', () => {
  let component: IfSelectComponent;
  let fixture: ComponentFixture<IfSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IfSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IfSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
