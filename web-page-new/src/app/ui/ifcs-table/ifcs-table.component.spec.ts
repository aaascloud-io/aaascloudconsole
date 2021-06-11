import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IfcsTableComponent } from './ifcs-table.component';

describe('IfTableComponent', () => {
  let component: IfcsTableComponent;
  let fixture: ComponentFixture<IfcsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IfcsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IfcsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
