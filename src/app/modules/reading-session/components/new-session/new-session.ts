import { Component, signal, computed, output } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { FileUploaderUi } from '../../../content-management/components/file-uploader-ui/file-uploader-ui';

interface NewSessionForm {
  title: string;
  description: string;
  date: Date | null;
  partner: string;
  file: File | null;
}

@Component({
  selector: 'app-new-session',
  standalone: true,
  imports: [FormsModule, CalendarModule, FileUploaderUi],
  templateUrl: './new-session.html'
})
export class NewSession {
  readonly form = signal<NewSessionForm>({
    title: '',
    description: '',
    date: null,
    partner: '',
    file: null
  });

  readonly isValid = computed(() =>
    !!this.form().title && !!this.form().date && !!this.form().partner && !!this.form().file
  );

  submitted = output<void>();

  onTitleChange(value: string) {
    this.form.set({ ...this.form(), title: value });
  }
  onDescriptionChange(value: string) {
    this.form.set({ ...this.form(), description: value });
  }
  onDateChange(value: Date | null) {
    this.form.set({ ...this.form(), date: value });
  }
  onPartnerChange(value: string) {
    this.form.set({ ...this.form(), partner: value });
  }
  onFileChange(file: File | null) {
    this.form.set({ ...this.form(), file });
  }
  onSubmit() {
    if (!this.isValid()) return;
    // TODO: Implement session creation logic
    alert('Session scheduled!');
    this.submitted.emit();
  }
}
