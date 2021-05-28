import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IfSupperLinkComponent } from './if-supper-link.component';

describe('IfSupperLinkComponent', () => {
  let component: IfSupperLinkComponent;
  let fixture: ComponentFixture<IfSupperLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IfSupperLinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IfSupperLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
