import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AppShell } from "./core/layout/components/app-shell/app-shell";

@Component({
  selector: 'app-root',
  imports: [ButtonModule, AppShell],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'readTogether';
}
