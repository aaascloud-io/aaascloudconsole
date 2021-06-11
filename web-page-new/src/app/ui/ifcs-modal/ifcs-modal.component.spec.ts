import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IfcsModalComponent } from './ifcs-modal.component';

describe('IfModalComponent', () => {
  let component: IfcsModalComponent;
  let fixture: ComponentFixture<IfcsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IfcsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IfcsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
