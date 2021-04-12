import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeTableTogglerCustomizedComponent } from './tree-table-toggler-customized.component';

describe('TreeTableTogglerCustomizedComponent', () => {
  let component: TreeTableTogglerCustomizedComponent;
  let fixture: ComponentFixture<TreeTableTogglerCustomizedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreeTableTogglerCustomizedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeTableTogglerCustomizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
