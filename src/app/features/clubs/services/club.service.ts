import { inject, Injectable } from '@angular/core';
import { SupabaseClientService } from '../../../core/services/SupabaseClient';
import { Club } from '../models/club.model';
import { MOCK_CLUBS } from '../../../core/models/mock-data';
import { mapClubFromDb } from '../models/club.mapper';
import { CacheService } from '../../../core/services/cache.service';

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

@Injectable({ providedIn: 'root' })
export class ClubService {
    private readonly supabase = inject(SupabaseClientService);
    private cacheService = inject(CacheService);

    async getClubs(filters?: {
        search?: string;
        languages?: string[];
        genres?: string[];
        types?: string[];
        activity?: string[];
        membershipTypes?: string[];
        joinedOnly?: boolean;
        userId?: string;
        sortBy?: string;
        page?: number;
        pageSize?: number;
    }): Promise<{ clubs: Club[]; total: number }> {
        const cacheKey = `clubs:${simpleHash(JSON.stringify(filters ?? {}))}`;
        const cachedEntry = this.cacheService.get(cacheKey);

        if (cachedEntry) {
            const isExpired = new Date().getTime() - cachedEntry.timestamp > CACHE_TTL;
            if (!isExpired) {
                return cachedEntry.response;
            }
        }

        const page = filters?.page ?? 1;
        const pageSize = filters?.pageSize ?? 12;
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        let query = this.supabase.supabase.from('clubs').select('*', { count: 'exact' }).range(from, to);

        if (filters?.search) {
            query = query.textSearch('fts', filters.search, { type: 'plain' });
        }

        // Filtering
        if (filters?.languages?.length) {
            query = query.in('language', filters.languages);
        }
        if (filters?.genres?.length) {
            query = query.in('genre', filters.genres);
        }
        if (filters?.types?.length) {
            // 'types' means public/private
            if (filters.types.includes('Public') && !filters.types.includes('Private')) {
                query = query.eq('is_public', true);
            } else if (!filters.types.includes('Public') && filters.types.includes('Private')) {
                query = query.eq('is_public', false);
            }
            // If both, do nothing (all clubs are included)
        }
        if (filters?.activity?.length) {
            query = query.in('activity_level', filters.activity);
        }
        if (filters?.membershipTypes?.length) {
            query = query.in('membership_type', filters.membershipTypes);
        }
        if (filters?.joinedOnly && filters.userId) {
            // This assumes you have a club_members table with club_id and member_id
            // You may need to join or do a separate query
            // For now, just a placeholder
            // query = query.contains('members', [filters.userId]);
        }

        // Sorting
        if (filters?.sortBy) {
            switch (filters.sortBy) {
                case 'most-members':
                    query = query.order('member_count', { ascending: false });
                    break;
                case 'recently-active':
                case 'newest':
                    query = query.order('created_at', { ascending: false });
                    break;
                case 'az':
                    query = query.order('name', { ascending: true });
                    break;
                case 'best-match':
                default:
                    // No-op or custom logic
                    break;
            }
        }

        const { data, error, count } = await query;
        if (error) throw error;
        const clubs = (data ?? []).map(mapClubFromDb);
        const result = { clubs, total: count ?? 0 };
        this.cacheService.set(cacheKey, result);
        return result;
    }

    async getClub(id: string): Promise<Club | null> {
        const cacheKey = `club:${id}`;
        const cachedEntry = this.cacheService.get(cacheKey);

        if (cachedEntry) {
            const isExpired = new Date().getTime() - cachedEntry.timestamp > CACHE_TTL;
            if (!isExpired) {
                return cachedEntry.response;
            }
        }

        const { data, error } = await this.supabase.supabase.from('clubs').select('*').eq('id', id).single();
        if (error) throw error;
        const result = data ? mapClubFromDb(data) : null;
        this.cacheService.set(cacheKey, result);
        return result;
    }

    async createClub(club: Club): Promise<Club> {
        this.cacheService.clear();
        const { data, error } = await this.supabase.supabase.from('clubs').insert([club]).select().single();
        if (error) throw error;
        return mapClubFromDb(data);
    }

    async updateClub(id: string, club: Partial<Club>): Promise<Club> {
        this.cacheService.clear();
        const { data, error } = await this.supabase.supabase.from('clubs').update(club).eq('id', id).select().single();
        if (error) throw error;
        return mapClubFromDb(data);
    }

    async deleteClub(id: string): Promise<void> {
        this.cacheService.clear();
        const { error } = await this.supabase.supabase.from('clubs').delete().eq('id', id);
        if (error) throw error;
    }

    async getClubMembers(id: string) {
        const cacheKey = `club-members:${id}`;
        const cachedEntry = this.cacheService.get(cacheKey);

        if (cachedEntry) {
            const isExpired = new Date().getTime() - cachedEntry.timestamp > CACHE_TTL;
            if (!isExpired) {
                return cachedEntry.response;
            }
        }

        const { data, error } = await this.supabase.supabase.from('club_members').select('*').eq('club_id', id);
        this.cacheService.set(cacheKey, data);
        return data;
    }

    async addClubMember(clubId: string, memberId: string) {
        this.cacheService.clear();
        const { data, error } = await this.supabase.supabase.from('club_members').insert({ club_id: clubId, member_id: memberId });
        return data;
    }

    async removeClubMember(clubId: string, memberId: string) {
        this.cacheService.clear();
        const { data, error } = await this.supabase.supabase.from('club_members').delete().eq('club_id', clubId).eq('member_id', memberId);
        return data;
    }

    async getClubEvents(id: string) {
        const cacheKey = `club-events:${id}`;
        const cachedEntry = this.cacheService.get(cacheKey);

        if (cachedEntry) {
            const isExpired = new Date().getTime() - cachedEntry.timestamp > CACHE_TTL;
            if (!isExpired) {
                return cachedEntry.response;
            }
        }

        const { data, error } = await this.supabase.supabase.from('club_events').select('*').eq('club_id', id);
        this.cacheService.set(cacheKey, data);
        return data;
    }

    

    // seed data
    async seedClubs() {
        this.cacheService.clear();
        for(const club of MOCK_CLUBS) {
            await this.createClub(club);
        }
    }
} 