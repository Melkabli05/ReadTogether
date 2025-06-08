import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadText } from './upload-text';

describe('UploadText', () => {
  let component: UploadText;
  let fixture: ComponentFixture<UploadText>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadText]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadText);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
