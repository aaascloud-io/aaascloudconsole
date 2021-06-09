import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IfDropzoneComponent } from './if-dropzone.component';

describe('IfDropzoneComponent', () => {
  let component: IfDropzoneComponent;
  let fixture: ComponentFixture<IfDropzoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IfDropzoneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IfDropzoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
