import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ErrorlistComponent } from './errorlist.component';

describe('ContactsComponent', () => {
  let component: ErrorlistComponent;
  let fixture: ComponentFixture<ErrorlistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
