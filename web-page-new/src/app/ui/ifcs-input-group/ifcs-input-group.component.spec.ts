import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IfcsInputGroupComponent } from './ifcs-input-group.component';

describe('IfInputGroupComponent', () => {
  let component: IfcsInputGroupComponent;
  let fixture: ComponentFixture<IfcsInputGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IfcsInputGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IfcsInputGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
