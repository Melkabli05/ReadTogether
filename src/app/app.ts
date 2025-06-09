import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SidebarComponent } from "./core/layout/components/sidebar/sidebar";
import { Topbar } from "./core/layout/components/topbar/topbar";
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [ButtonModule, SidebarComponent, Topbar, RouterOutlet, ToastModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'readTogether';
  protected isSaving = false;
  protected isSubmitting = false;
  protected isFormValid = true;

  handleClick($event: MouseEvent) {
    console.log('Button clicked', $event);
  }

  handleSave($event: MouseEvent) {
    console.log('Button clicked', $event);
  }

  handleSubmit($event: MouseEvent) {
    console.log('Button clicked', $event);
  }
}
