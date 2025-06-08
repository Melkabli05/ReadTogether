import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseTexts } from './browse-texts';

describe('BrowseTexts', () => {
  let component: BrowseTexts;
  let fixture: ComponentFixture<BrowseTexts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowseTexts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrowseTexts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
