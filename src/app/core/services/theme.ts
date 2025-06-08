import { Injectable, effect, signal } from '@angular/core';

const DARK_CLASS = 'system-theme';
const STORAGE_KEY = 'theme-mode';
export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class Theme {
  private readonly mode = signal<ThemeMode>(this.getInitialMode());

  readonly isDarkMode = signal(this.computeIsDarkMode());

  constructor() {
    effect(() => {
      const mode = this.mode();
      this.applyTheme(mode);
      localStorage.setItem(STORAGE_KEY, mode);
      this.isDarkMode.set(this.computeIsDarkMode());
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (this.mode() === 'system') {
        this.isDarkMode.set(this.computeIsDarkMode());
        this.applyTheme('system');
      }
    });
  }

  getMode(): ThemeMode {
    return this.mode();
  }

  setMode(mode: ThemeMode): void {
    this.mode.set(mode);
  }

  toggleDarkMode(): void {
    const current = this.isDarkMode();
    this.setMode(current ? 'light' : 'dark');
  }

  private getInitialMode(): ThemeMode {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
    return 'system';
  }

  private computeIsDarkMode(): boolean {
    const mode = this.mode();
    if (mode === 'dark') return true;
    if (mode === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private applyTheme(mode: ThemeMode): void {
    const html = document.documentElement;
    const isDark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    html.classList.toggle(DARK_CLASS, isDark);
  }
}
