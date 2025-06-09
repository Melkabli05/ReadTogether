import { Component } from '@angular/core';
import { Button } from "../../../../shared/components/button/button";

@Component({
  selector: 'app-welcome-card',
  template: `
    <section
      class="rounded-xl w-full px-3 sm:px-3 py-4 flex flex-col gap-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-lg"
      aria-label="Welcome Card"
    >
      <h2 class="text-xl sm:text-2xl font-bold">Good Morning, Alex!</h2>
      <p class="text-sm sm:text-base font-medium text-white/90">Ready for your next reading session? Dive back in or discover something new</p>

      <div class="flex flex-col sm:flex-row gap-3 mt-1">
        <app-button
          [label]="'Open a New Room'"
          [icon]="'pi-plus'"
          [severity]="'basic'"
        />

        <app-button
          label="Upload New Text"
          severity="info"
          [icon]="'pi-upload'"
        />
      </div>
    </section>
  `,
  imports: [Button]
})
export class WelcomeCard {} 