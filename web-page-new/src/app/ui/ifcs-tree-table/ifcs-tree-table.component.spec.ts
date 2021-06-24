import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IfcsTreeTableComponent } from './ifcs-tree-table.component';

describe('IfcsTreeTableComponent', () => {
  let component: IfcsTreeTableComponent;
  let fixture: ComponentFixture<IfcsTreeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IfcsTreeTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IfcsTreeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
