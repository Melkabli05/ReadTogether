import { inject, Injectable } from '@angular/core';
import { SupabaseClientService } from './SupabaseClient';
import { User, mapUserFromDb } from '../models/user.model';
import { CacheService } from './cache.service';

const CACHE_TTL = 90000; // 90 seconds

const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash;
  }
  return hash.toString();
};

export type UserSortOption = 'most-followers' | 'most-posts' | 'most-likes' | 'most-comments';

export interface UserFilters {
  search?: string;
  nativeIn?: string,
  learning?: string,
  status?: string;
  sortBy?: UserSortOption;
  page?: number;
  pageSize?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly supabase = inject(SupabaseClientService).supabase;
  private cacheService = inject(CacheService);
  
  async getUsers(filters: UserFilters): Promise<User[]> {
    const cacheKey = `users:${simpleHash(JSON.stringify(filters))}`;
    const cachedEntry = this.cacheService.get(cacheKey);

    if (cachedEntry) {
      const isExpired = new Date().getTime() - cachedEntry.timestamp > CACHE_TTL;
      if (!isExpired) {
        return cachedEntry.response;
      }
    }

    let query = this.supabase.from('users').select('*');

    // === Filtering ===
    if (filters.search) {
      // Search by display name or username (case-insensitive)
      query = query.ilike('display_name', `%${filters.search}%`);
    }
    if (filters.nativeIn) {
      query = query.contains('languages', [{ code: filters.nativeIn, proficiency: 'native' }]);
    }
    if (filters.learning) {
      query = query.contains('languages', [{ code: filters.learning, proficiency: 'learning' }]);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    // === Sorting ===
    switch (filters.sortBy) {
      case 'most-followers':
        query = query.order('followers', { ascending: false });
        break;
      case 'most-posts':
        query = query.order('stats->posts', { ascending: false });
        break;
      case 'most-likes':
        query = query.order('stats->likes', { ascending: false });
        break;
      case 'most-comments':
        query = query.order('stats->comments', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    // === Pagination ===
    if (filters.page && filters.pageSize) {
      const from = (filters.page - 1) * filters.pageSize;
      const to = from + filters.pageSize - 1;
      query = query.range(from, to);
    }

    // === Execute Query ===
    const { data, error } = await query;
    if (error) {
      // Optionally log error here
      return [];
    }
    const result = (data ?? []).map(mapUserFromDb);
    this.cacheService.set(cacheKey, result);
    return result;
  }

  // get users by ids
  async getUsersByIds(userIds: string[]): Promise<User[]> {
    const cacheKey = `users-by-ids:${simpleHash(JSON.stringify(userIds))}`;
    const cachedEntry = this.cacheService.get(cacheKey);

    if (cachedEntry) {
      const isExpired = new Date().getTime() - cachedEntry.timestamp > CACHE_TTL;
      if (!isExpired) {
        return cachedEntry.response;
      }
    }

    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .in('id', userIds);

    if (error) {
      throw new Error(error.message);
    }

    const result = (data ?? []).map(mapUserFromDb);
    this.cacheService.set(cacheKey, result);
    return result;
  }

  //get user by id
  async getUser(userId: string): Promise<User> {
    const cacheKey = `user:${userId}`;
    const cachedEntry = this.cacheService.get(cacheKey);

    if (cachedEntry) {
      const isExpired = new Date().getTime() - cachedEntry.timestamp > CACHE_TTL;
      if (!isExpired) {
        return cachedEntry.response;
      }
    }

    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    const result = mapUserFromDb(data);
    this.cacheService.set(cacheKey, result);
    return result;
  }
}