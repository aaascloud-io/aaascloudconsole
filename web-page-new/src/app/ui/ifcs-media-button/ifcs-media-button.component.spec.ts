import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IfcsMediaButtonComponent } from './ifcs-media-button.component';

describe('IfcsMediaButtonComponent', () => {
  let component: IfcsMediaButtonComponent;
  let fixture: ComponentFixture<IfcsMediaButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IfcsMediaButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IfcsMediaButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
