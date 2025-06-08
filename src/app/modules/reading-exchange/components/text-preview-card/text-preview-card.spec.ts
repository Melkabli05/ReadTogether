import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextPreviewCard } from './text-preview-card';

describe('TextPreviewCard', () => {
  let component: TextPreviewCard;
  let fixture: ComponentFixture<TextPreviewCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextPreviewCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextPreviewCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
