import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTexts } from './my-texts';

describe('MyTexts', () => {
  let component: MyTexts;
  let fixture: ComponentFixture<MyTexts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyTexts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyTexts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
