import { inject, Injectable } from '@angular/core';
import { CacheService } from '../../../core/services/cache.service';

const CACHE_TTL = 90000; // 90 seconds

@Injectable({ providedIn: 'root' })
export class TextDiscoveryService {
  private cacheService = inject(CacheService);
} 