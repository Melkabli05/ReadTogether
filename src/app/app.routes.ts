import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/discovery/discovery.routes').then(m => m.DISCOVERY_ROUTES),
  },
  {
    path: 'clubs',
    loadChildren: () => import('./features/clubs/clubs.routes').then(m => m.CLUBS_ROUTES)
  },
  {
    path: 'reading-rooms',
    loadChildren: () => import('./features/reading-room/reading-room.route').then(m => m.READING_ROOM_ROUTES)
  }
];
