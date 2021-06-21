import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IfcsBadgeComponent } from './ifcs-badge.component';

describe('IfcsBadgeComponent', () => {
  let component: IfcsBadgeComponent;
  let fixture: ComponentFixture<IfcsBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IfcsBadgeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IfcsBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
