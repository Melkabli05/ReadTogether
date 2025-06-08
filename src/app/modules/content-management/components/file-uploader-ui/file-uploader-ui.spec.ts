import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploaderUi } from './file-uploader-ui';

describe('FileUploaderUi', () => {
  let component: FileUploaderUi;
  let fixture: ComponentFixture<FileUploaderUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileUploaderUi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileUploaderUi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
