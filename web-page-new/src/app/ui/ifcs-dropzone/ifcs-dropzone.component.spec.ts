import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IfcsDropzoneComponent } from './ifcs-dropzone.component';

describe('IfDropzoneComponent', () => {
  let component: IfcsDropzoneComponent;
  let fixture: ComponentFixture<IfcsDropzoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IfcsDropzoneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IfcsDropzoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
