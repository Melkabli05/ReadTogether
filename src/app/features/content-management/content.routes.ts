import { Routes } from '@angular/router';

export const CONTENT_MANAGEMENT_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'my-library'
  },
  {
    path: 'upload-text',
    loadComponent: () => import('./pages/upload-text/upload-text.page').then(m => m.UploadTextPage)
  },
  {
    path: 'my-library',
    loadComponent: () => import('./pages/my-library/my-library.page').then(m => m.MyLibraryPage)
  }
]; 