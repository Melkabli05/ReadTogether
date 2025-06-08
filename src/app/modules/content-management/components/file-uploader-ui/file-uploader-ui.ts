import { Component, Output, EventEmitter, signal } from '@angular/core';


@Component({
  selector: 'app-file-uploader-ui',
  standalone: true,
  imports: [],
  templateUrl: './file-uploader-ui.html'
})
export class FileUploaderUi {
  @Output() fileChange = new EventEmitter<File | null>();
  readonly fileName = signal<string>('');

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files.length ? input.files[0] : null;
    if (file && !['application/pdf', 'application/epub+zip', 'text/plain'].includes(file.type)) {
      this.fileName.set('');
      this.fileChange.emit(null);
      alert('Only PDF, ePub, or txt files are allowed.');
      return;
    }
    this.fileName.set(file ? file.name : '');
    this.fileChange.emit(file);
  }
  clearFile() {
    this.fileName.set('');
    this.fileChange.emit(null);
  }
}
