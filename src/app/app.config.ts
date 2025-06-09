import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { withInterceptors } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import { errorInterceptor } from './core/interceptors/error-interceptor';
import { MessageService } from 'primeng/api';
import { cacheInterceptor } from './core/interceptors/cache-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    provideAnimationsAsync(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([errorInterceptor, cacheInterceptor])),
    provideRouter(routes, withComponentInputBinding()),
    providePrimeNG({
      ripple: true,
      inputVariant: 'filled',
      theme: {
          preset: Aura,
          options: {
              darkModeSelector: '.system-theme',
              cssLayer: { name: 'primeng', order: 'theme, base, primeng' }
          }
      }
    })
  ]
};
