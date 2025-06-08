import { Component, signal, computed } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { FileUploaderUi } from '../../components/file-uploader-ui/file-uploader-ui';

interface UploadTextForm {
  title: string;
  description: string;
  file: File | null;
}

@Component({
  selector: 'app-upload-text',
  standalone: true,
  imports: [FormsModule, FileUploaderUi],
  templateUrl: './upload-text.html'
})
export class UploadText {
  readonly form = signal<UploadTextForm>({
    title: '',
    description: '',
    file: null
  });

  readonly isValid = computed(() =>
    !!this.form().title && !!this.form().file
  );

  onTitleChange(value: string) {
    this.form.set({ ...this.form(), title: value });
  }
  onDescriptionChange(value: string) {
    this.form.set({ ...this.form(), description: value });
  }
  onFileChange(file: File | null) {
    this.form.set({ ...this.form(), file });
  }
  onSubmit() {
    if (!this.isValid()) return;
    // TODO: Implement upload logic
    alert('Text uploaded!');
  }
}
