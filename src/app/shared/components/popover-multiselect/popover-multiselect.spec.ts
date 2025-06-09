import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverMultiselect } from './popover-multiselect';

describe('PopoverMultiselect', () => {
  let component: PopoverMultiselect;
  let fixture: ComponentFixture<PopoverMultiselect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopoverMultiselect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopoverMultiselect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
