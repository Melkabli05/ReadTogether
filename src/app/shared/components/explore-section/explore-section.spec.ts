import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreSection } from './explore-section';

describe('ExploreSection', () => {
  let component: ExploreSection;
  let fixture: ComponentFixture<ExploreSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExploreSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExploreSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
