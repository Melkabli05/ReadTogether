import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerFilter } from './partner-filter';

describe('PartnerFilter', () => {
  let component: PartnerFilter;
  let fixture: ComponentFixture<PartnerFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnerFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartnerFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
