import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IfcsLinkComponent } from './ifcs-link.component';

describe('IfLinkComponent', () => {
  let component: IfcsLinkComponent;
  let fixture: ComponentFixture<IfcsLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IfcsLinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IfcsLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
