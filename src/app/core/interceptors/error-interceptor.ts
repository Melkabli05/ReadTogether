import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';

/**
 * Global HTTP error interceptor with PrimeNG Toast notifications.
 * Shows user-friendly error messages and logs errors for debugging.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  // Inject MessageService (PrimeNG)
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error) => {
      if (error?.status === 0) {
        console.warn('[HTTP Request Cancelled]', 'A request was cancelled, likely due to cache busting.');
        return throwError(() => error);
      }
      // Log error details for debugging
      console.error('[HTTP ERROR] : ', error);
      // Show a user-friendly toast notification
      messageService.add({
        severity: 'error',
        summary: 'Request Error',
        detail: error?.error?.message || error?.message || 'An unexpected error occurred.',
        life: 5000
      });
      return throwError(() => error);
    })
  );
};
