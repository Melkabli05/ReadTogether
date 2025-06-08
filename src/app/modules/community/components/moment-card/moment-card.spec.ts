import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MomentCard } from './moment-card';

describe('MomentCard', () => {
  let component: MomentCard;
  let fixture: ComponentFixture<MomentCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MomentCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MomentCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
