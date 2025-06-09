import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Usage:
 * <app-loader></app-loader> // Inline
 * <app-loader overlay></app-loader> // Full-screen overlay
 * <app-loader size="sm"></app-loader> // Small
 */
@Component({
  selector: 'app-loader',
  imports: [CommonModule],
  template: `
    @if (!overlay()) {
      <div
        class="flex items-center justify-center w-full h-full"
        [ngClass]="containerClass()"
        role="status"
        aria-label="Loading"
        >
        <svg
          class="pl"
          [ngClass]="svgClass()"
          viewBox="0 0 240 240"
          aria-hidden="true"
          >
          <circle class="pl__ring pl__ring--a stroke-red-500 dark:stroke-red-400" cx="120" cy="120" r="105" fill="none" stroke-width="20" stroke-dasharray="0 660" stroke-dashoffset="-330" stroke-linecap="round"></circle>
          <circle class="pl__ring pl__ring--b stroke-orange-400 dark:stroke-orange-300" cx="120" cy="120" r="35" fill="none" stroke-width="20" stroke-dasharray="0 220" stroke-dashoffset="-110" stroke-linecap="round"></circle>
          <circle class="pl__ring pl__ring--c stroke-blue-600 dark:stroke-blue-400" cx="85" cy="120" r="70" fill="none" stroke-width="20" stroke-dasharray="0 440" stroke-linecap="round"></circle>
          <circle class="pl__ring pl__ring--d stroke-pink-500 dark:stroke-pink-400" cx="155" cy="120" r="70" fill="none" stroke-width="20" stroke-dasharray="0 440" stroke-linecap="round"></circle>
        </svg>
        <span class="sr-only">Loading...</span>
      </div>
    } @else {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60">
        <div
          class="flex items-center justify-center"
          [ngClass]="containerClass()"
          role="status"
          aria-label="Loading"
          >
          <svg
            class="pl"
            [ngClass]="svgClass()"
            viewBox="0 0 240 240"
            aria-hidden="true"
            >
            <circle class="pl__ring pl__ring--a stroke-red-500 dark:stroke-red-400" cx="120" cy="120" r="105" fill="none" stroke-width="20" stroke-dasharray="0 660" stroke-dashoffset="-330" stroke-linecap="round"></circle>
            <circle class="pl__ring pl__ring--b stroke-orange-400 dark:stroke-orange-300" cx="120" cy="120" r="35" fill="none" stroke-width="20" stroke-dasharray="0 220" stroke-dashoffset="-110" stroke-linecap="round"></circle>
            <circle class="pl__ring pl__ring--c stroke-blue-600 dark:stroke-blue-400" cx="85" cy="120" r="70" fill="none" stroke-width="20" stroke-dasharray="0 440" stroke-linecap="round"></circle>
            <circle class="pl__ring pl__ring--d stroke-pink-500 dark:stroke-pink-400" cx="155" cy="120" r="70" fill="none" stroke-width="20" stroke-dasharray="0 440" stroke-linecap="round"></circle>
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    }
    `,
  styles: [`
    .pl__ring {
      animation: ringA 2s linear infinite;
    }
    .pl__ring--a { animation-name: ringA; }
    .pl__ring--b { animation-name: ringB; }
    .pl__ring--c { animation-name: ringC; }
    .pl__ring--d { animation-name: ringD; }
    @keyframes ringA {
      from, 4% { stroke-dasharray: 0 660; stroke-width: 20; stroke-dashoffset: -330; }
      12% { stroke-dasharray: 60 600; stroke-width: 30; stroke-dashoffset: -335; }
      32% { stroke-dasharray: 60 600; stroke-width: 30; stroke-dashoffset: -595; }
      40%, 54% { stroke-dasharray: 0 660; stroke-width: 20; stroke-dashoffset: -660; }
      62% { stroke-dasharray: 60 600; stroke-width: 30; stroke-dashoffset: -665; }
      82% { stroke-dasharray: 60 600; stroke-width: 30; stroke-dashoffset: -925; }
      90%, to { stroke-dasharray: 0 660; stroke-width: 20; stroke-dashoffset: -990; }
    }
    @keyframes ringB {
      from, 12% { stroke-dasharray: 0 220; stroke-width: 20; stroke-dashoffset: -110; }
      20% { stroke-dasharray: 20 200; stroke-width: 30; stroke-dashoffset: -115; }
      40% { stroke-dasharray: 20 200; stroke-width: 30; stroke-dashoffset: -195; }
      48%, 62% { stroke-dasharray: 0 220; stroke-width: 20; stroke-dashoffset: -220; }
      70% { stroke-dasharray: 20 200; stroke-width: 30; stroke-dashoffset: -225; }
      90% { stroke-dasharray: 20 200; stroke-width: 30; stroke-dashoffset: -305; }
      98%, to { stroke-dasharray: 0 220; stroke-width: 20; stroke-dashoffset: -330; }
    }
    @keyframes ringC {
      from { stroke-dasharray: 0 440; stroke-width: 20; stroke-dashoffset: 0; }
      8% { stroke-dasharray: 40 400; stroke-width: 30; stroke-dashoffset: -5; }
      28% { stroke-dasharray: 40 400; stroke-width: 30; stroke-dashoffset: -175; }
      36%, 58% { stroke-dasharray: 0 440; stroke-width: 20; stroke-dashoffset: -220; }
      66% { stroke-dasharray: 40 400; stroke-width: 30; stroke-dashoffset: -225; }
      86% { stroke-dasharray: 40 400; stroke-width: 30; stroke-dashoffset: -395; }
      94%, to { stroke-dasharray: 0 440; stroke-width: 20; stroke-dashoffset: -440; }
    }
    @keyframes ringD {
      from, 8% { stroke-dasharray: 0 440; stroke-width: 20; stroke-dashoffset: 0; }
      16% { stroke-dasharray: 40 400; stroke-width: 30; stroke-dashoffset: -5; }
      36% { stroke-dasharray: 40 400; stroke-width: 30; stroke-dashoffset: -175; }
      44%, 50% { stroke-dasharray: 0 440; stroke-width: 20; stroke-dashoffset: -220; }
      58% { stroke-dasharray: 40 400; stroke-width: 30; stroke-dashoffset: -225; }
      78% { stroke-dasharray: 40 400; stroke-width: 30; stroke-dashoffset: -395; }
      86%, to { stroke-dasharray: 0 440; stroke-width: 20; stroke-dashoffset: -440; }
    }
  `]
})
export class LoaderComponent {
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly overlay = input<boolean>(false);

  containerClass() {
    switch (this.size()) {
      case 'sm': return 'min-h-[2em]';
      case 'lg': return 'min-h-[10em]';
      case 'md':
      default: return 'min-h-[6em]';
    }
  }

  svgClass() {
    switch (this.size()) {
      case 'sm': return 'w-8 h-8';
      case 'lg': return 'w-32 h-32';
      case 'md':
      default: return 'w-24 h-24';
    }
  }
} 