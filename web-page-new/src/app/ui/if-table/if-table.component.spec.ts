import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IfTableComponent } from './if-table.component';

describe('IfTableComponent', () => {
  let component: IfTableComponent;
  let fixture: ComponentFixture<IfTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IfTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IfTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
