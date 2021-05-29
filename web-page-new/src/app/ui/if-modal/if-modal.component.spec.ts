import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IfModalComponent } from './if-modal.component';

describe('IfModalComponent', () => {
  let component: IfModalComponent;
  let fixture: ComponentFixture<IfModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IfModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IfModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
