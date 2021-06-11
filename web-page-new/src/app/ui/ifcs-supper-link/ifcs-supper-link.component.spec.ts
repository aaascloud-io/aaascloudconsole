import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IfcsSupperLinkComponent } from './ifcs-supper-link.component';

describe('IfSupperLinkComponent', () => {
  let component: IfcsSupperLinkComponent;
  let fixture: ComponentFixture<IfcsSupperLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IfcsSupperLinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IfcsSupperLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
