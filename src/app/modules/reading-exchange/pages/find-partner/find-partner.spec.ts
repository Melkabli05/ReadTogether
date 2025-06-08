import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindPartner } from './find-partner';

describe('FindPartner', () => {
  let component: FindPartner;
  let fixture: ComponentFixture<FindPartner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindPartner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindPartner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
