import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IfInputGroupComponent } from './if-input-group.component';

describe('IfInputGroupComponent', () => {
  let component: IfInputGroupComponent;
  let fixture: ComponentFixture<IfInputGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IfInputGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IfInputGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
