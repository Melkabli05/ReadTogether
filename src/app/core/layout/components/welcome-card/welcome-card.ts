import { Component } from '@angular/core';

@Component({
  selector: 'app-welcome-card',
  standalone: true,
  template: `
    <section
      class="rounded-xl w-full px-6 py-4 flex flex-col gap-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-lg"
      aria-label="Welcome Card"
    >
      <h2 class="text-2xl font-bold">Good Morning, Alex!</h2>
      <p class="text-base font-medium text-white/90">Ready to continue your reading journey?</p>
      <div class="flex gap-3 mt-1">
        <button
          type="button"
          class="cursor-pointer flex items-center gap-2 px-5 py-2 rounded-lg bg-white text-blue-700 font-semibold shadow hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          aria-label="Start Reading Session"
        >
          <i class="pi pi-plus"></i>
          Start Reading Session
        </button>
        <button
          type="button"
          class="cursor-pointer flex items-center gap-2 px-5 py-2 rounded-lg border border-white text-white font-semibold bg-transparent hover:bg-white hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
          aria-label="Upload New Text"
        >
          <i class="pi pi-upload"></i>
          Upload New Text
        </button>
      </div>
    </section>
  `
})
export class WelcomeCard {} 