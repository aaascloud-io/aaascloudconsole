import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OverlaysComponent } from './overlays.component';

describe('OverlaysComponent', () => {
  let component: OverlaysComponent;
  let fixture: ComponentFixture<OverlaysComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OverlaysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverlaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
