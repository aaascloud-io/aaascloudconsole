import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IfLinkComponent } from './if-link.component';

describe('IfLinkComponent', () => {
  let component: IfLinkComponent;
  let fixture: ComponentFixture<IfLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IfLinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IfLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
