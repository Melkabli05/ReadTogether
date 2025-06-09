import { Component, signal, computed, output } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { FileUploaderUi } from '../../../content-management/components/file-uploader-ui/file-uploader-ui';
import { AutoCompleteModule } from 'primeng/autocomplete';

interface Partner {
  name: string;
  avatarUrl: string;
}

interface NewSessionForm {
  title: string;
  description: string;
  date: Date | null;
  partner: Partner | null;
  file: File | null;
}

@Component({
  selector: 'app-new-session',
  standalone: true,
  imports: [FormsModule, CalendarModule, AutoCompleteModule, FileUploaderUi],
  templateUrl: './new-session.html'
})
export class NewSession {
  readonly today = new Date();

  private readonly partners = [
    { name: 'Alice Johnson', avatarUrl: 'https://i.pravatar.cc/150?img=1' },
    { name: 'Bob Smith', avatarUrl: 'https://i.pravatar.cc/150?img=2' },
    { name: 'Charlie Lee', avatarUrl: 'https://i.pravatar.cc/150?img=3' }
  ] satisfies Partner[];

  readonly filteredPartners = signal<Partner[]>([]);
  readonly isLoading = signal(false);

  readonly form = signal<NewSessionForm>({
    title: '',
    description: '',
    date: null,
    partner: null,
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
  onPartnerChange(value: Partner | null) {
    this.form.set({ ...this.form(), partner: value });
  }
  onFileChange(file: File | null) {
    this.form.set({ ...this.form(), file });
  }
  searchPartners(event: { query: string }) {
    const query = event.query?.toLowerCase() ?? '';
    this.filteredPartners.set(
      this.partners.filter(partner => partner.name.toLowerCase().includes(query))
    );
  }
  removeFile() {
    this.form.set({ ...this.form(), file: null });
  }
  async onSubmit() {
    if (!this.isValid()) return;
    this.isLoading.set(true);
    try {
      // TODO: Implement session creation logic
      await new Promise(res => setTimeout(res, 1000)); // Simulate async
      alert('Session scheduled!');
      this.submitted.emit();
    } finally {
      this.isLoading.set(false);
    }
  }
}
