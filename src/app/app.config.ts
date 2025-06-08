import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideBrowserGlobalErrorListeners(), 
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    providePrimeNG({
      ripple: true,
      inputVariant: 'filled',
      theme: {
          preset: Aura,
          options: {
              darkModeSelector: '.system-theme',
              cssLayer: {
                name: 'primeng',
                order: 'theme, base, primeng'
            }
          }
      }
    })
  ]
};
