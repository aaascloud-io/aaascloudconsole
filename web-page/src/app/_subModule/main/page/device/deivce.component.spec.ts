import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeivceComponent } from './deivce.component';

describe('DeivceComponent', () => {
  let component: DeivceComponent;
  let fixture: ComponentFixture<DeivceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeivceComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeivceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
