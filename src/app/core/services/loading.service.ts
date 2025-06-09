import { Injectable, signal } from '@angular/core';

/**
 * Global LoadingService for managing app-wide loading state.
 * Usage:
 *   const loadingService = inject(LoadingService);
 *   loadingService.show();
 *   loadingService.hide();
 *   loadingService.toggle();
 *   loadingService.isLoading(); // signal<boolean>
 */
@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly _isLoading = signal(false);

  /**
   * Readonly signal for loading state.
   * Use in components: loadingService.isLoading()
   */
  readonly isLoading = this._isLoading.asReadonly();

  show(): void {
    this._isLoading.set(true);
  }

  hide(): void {
    this._isLoading.set(false);
  }

  toggle(): void {
    this._isLoading.update(v => !v);
  }
} 