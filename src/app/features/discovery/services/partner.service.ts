import { inject, Injectable } from '@angular/core';
import { CacheService } from '../../../core/services/cache.service';
import { SupabaseClientService } from '../../../core/services/SupabaseClient';
import { User } from '../../../core/models/user.model';

const CACHE_TTL = 3600000; // 1 hour

@Injectable({ providedIn: 'root' })
export class PartnerService {
  private cacheService = inject(CacheService);
  private supabase = inject(SupabaseClientService).supabase;

  /**
   * Suggest partners for a user based on shared reading interests and languages.
   * - Excludes the user themselves.
   * - Prioritizes users with overlapping interests and languages.
   * - Returns up to a specified number of best matches.
   */
  async suggestPartners(userId: string, limit: number = 4): Promise<User[]> {
    const cacheKey = `suggest-partners:${userId}:${limit}`;
    const cachedEntry = this.cacheService.get(cacheKey);

    if (cachedEntry) {
      const isExpired = new Date().getTime() - cachedEntry.timestamp > CACHE_TTL;
      if (!isExpired) {
        return cachedEntry.response;
      }
    }

    const { data, error } = await this.supabase.rpc('suggest_partners', {
      p_user_id: userId,
      p_limit: limit,
    });

    if (error) {
      console.error('Error suggesting partners:', error);
      return [];
    }

    this.cacheService.set(cacheKey, data);
    return data;
  }
} 