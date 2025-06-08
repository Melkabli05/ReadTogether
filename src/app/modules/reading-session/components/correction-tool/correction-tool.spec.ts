import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectionTool } from './correction-tool';

describe('CorrectionTool', () => {
  let component: CorrectionTool;
  let fixture: ComponentFixture<CorrectionTool>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorrectionTool]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorrectionTool);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
