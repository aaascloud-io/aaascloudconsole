import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimcardComponent } from './simcard.component';

describe('SimcardComponent', () => {
  let component: SimcardComponent;
  let fixture: ComponentFixture<SimcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimcardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
