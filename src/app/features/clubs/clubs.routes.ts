import { Routes } from '@angular/router';

export const CLUBS_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/club-list/club-list.page').then(m => m.ClubListPage)
  },
  {
    path: 'feed',
    loadComponent: () => import('./pages/club-feed/club-feed.page').then(m => m.ClubFeedPage)
  },
  {
    path: 'create',
    loadComponent: () => import('./pages/create-club/create-club.page').then(m => m.CreateClubPage)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/club-detail/club-detail.page').then(m => m.ClubDetailPage)
  },
  {
    path: ':id/room',
    loadComponent: () => import('./pages/club-room/club-room.page').then(m => m.ClubRoomPage)
  }
]; 