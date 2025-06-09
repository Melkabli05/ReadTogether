import { Routes } from '@angular/router';
import { explorePageResolver } from '../../core/resolvers/explore-page-resolver';

export const DISCOVERY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/explore/explore-page').then(m => m.ExplorePage),
    resolve: { exploreData: explorePageResolver },
  },
  {
    path: 'find-partner',
    loadComponent: () =>
      import('./pages/find-partner/find-partner.page').then(
        m => m.FindPartnerPage
      ),
  },
  {
    path: 'browse-texts',
    loadComponent: () =>
      import('./pages/browse-texts/browse-texts.page').then(
        m => m.BrowseTextsPage
      ),
  },
]; 