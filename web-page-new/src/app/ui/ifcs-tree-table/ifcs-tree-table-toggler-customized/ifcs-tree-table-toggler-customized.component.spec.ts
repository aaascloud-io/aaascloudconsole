import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IfcsTreeTableTogglerCustomizedComponent } from './ifcs-tree-table-toggler-customized.component';

describe('IfcsTreeTableTogglerCustomizedComponent', () => {
  let component: IfcsTreeTableTogglerCustomizedComponent;
  let fixture: ComponentFixture<IfcsTreeTableTogglerCustomizedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IfcsTreeTableTogglerCustomizedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IfcsTreeTableTogglerCustomizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
