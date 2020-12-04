import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowcommandComponent } from './showcommand.component';

describe('ShowcommandComponent', () => {
  let component: ShowcommandComponent;
  let fixture: ComponentFixture<ShowcommandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShowcommandComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowcommandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
