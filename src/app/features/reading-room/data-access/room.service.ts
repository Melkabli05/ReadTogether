import { inject, Injectable } from '@angular/core';
import { SupabaseClientService } from '../../../core/services/SupabaseClient';
import { Room } from '../models/room.model';
import { mapRoomFromDb } from '../models/room.mapper';
import { RoomHost } from '../models/room-host.model';
import { RoomStatus } from '../models/room-status.enum';
import { CacheService } from '../../../core/services/cache.service';

const CACHE_TTL = 90000; // 90 seconds

function mapRoomHostFromDb(db: any): RoomHost {
  return {
    id: db.id,
    roomId: db.room_id,
    userId: db.user_id,
    assignedAt: db.assigned_at ? new Date(db.assigned_at) : new Date(0),
  };
}

export interface RoomFilters {
  search?: string;
  languages?: string[];
  status?: RoomStatus;
  sortBy?: RoomSortOption;
  page?: number;
  pageSize?: number;
}

const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash;
  }
  return hash.toString();
};

export type RoomSortOption = 'recent' | 'az';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private supabaseClient = inject(SupabaseClientService);
  private cacheService = inject(CacheService);

  constructor() {}

  async getRoom(roomId: string): Promise<Room> {
    const cacheKey = `room:${roomId}`;
    const cachedEntry = this.cacheService.get(cacheKey);

    if (cachedEntry) {
      const isExpired = new Date().getTime() - cachedEntry.timestamp > CACHE_TTL;
      if (!isExpired) {
        return cachedEntry.response;
      }
    }

    const { data, error } = await this.supabaseClient.supabase
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .single();
    if (error) throw new Error(error.message);
    return mapRoomFromDb(data);
  }

  /**
   * Fetch rooms with optional filters and pagination.
   * Supports sorting by 'recent' (scheduled_time desc), 'az' (title asc).
   */
  async getRooms(filters: RoomFilters = {}): Promise<{ rooms: Room[]; total: number }> {
    const cacheKey = `rooms:${simpleHash(JSON.stringify(filters))}`;
    const cachedEntry = this.cacheService.get(cacheKey);

    if (cachedEntry) {
      const isExpired = new Date().getTime() - cachedEntry.timestamp > CACHE_TTL;
      if (!isExpired) {
        console.log(`[RoomService] Cache HIT for key: ${cacheKey}`);
        return cachedEntry.response;
      }
      console.log(`[RoomService] Cache EXPIRED for key: ${cacheKey}`);
    } else {
      console.log(`[RoomService] Cache MISS for key: ${cacheKey}`);
    }

    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 12;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    let query = this.supabaseClient.supabase.from('rooms').select('*', { count: 'exact' }).range(from, to);
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.languages && filters.languages.length > 0) query = query.in('language', filters.languages);
    if (filters.search) query = query.textSearch('title', filters.search, { type: 'plain' });
    switch (filters.sortBy) {
      case 'az':
        query = query.order('title', { ascending: true });
        break;
      case 'recent':
      default:
        query = query.order('scheduled_time', { ascending: false });
        break;
    }
    const { data, error, count } = await query;
    if (error) throw new Error(error.message);

    const result = { rooms: (data ?? []).map(mapRoomFromDb), total: count ?? 0 };
    console.log(`[RoomService] Caching result for key: ${cacheKey}`);
    this.cacheService.set(cacheKey, result);
    return result;
  }

  async createRoom(room: Room): Promise<Room> {
    this.cacheService.clear();
    console.log('[RoomService] Cache cleared due to createRoom.');
    const { data, error } = await this.supabaseClient.supabase
      .from('rooms')
      .insert(room)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return mapRoomFromDb(data);
  }

  async updateRoom(roomId: string, room: Room): Promise<Room> {
    this.cacheService.clear();
    console.log('[RoomService] Cache cleared due to updateRoom.');
    const { data, error } = await this.supabaseClient.supabase
      .from('rooms')
      .update(room)
      .eq('id', roomId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return mapRoomFromDb(data);
  }

  async deleteRoom(roomId: string): Promise<void> {
    this.cacheService.clear();
    console.log('[RoomService] Cache cleared due to deleteRoom.');
    const { error } = await this.supabaseClient.supabase
      .from('rooms')
      .delete()
      .eq('id', roomId);
    if (error) throw new Error(error.message);
  }

  async joinRoom(roomId: string, userId: string): Promise<void> {
    this.cacheService.clear();
    console.log('[RoomService] Cache cleared due to joinRoom.');
    // Placeholder for future implementation
  }

  async leaveRoom(roomId: string, userId: string): Promise<void> {
    this.cacheService.clear();
    console.log('[RoomService] Cache cleared due to leaveRoom.');
    // Placeholder for future implementation
  }

  /**
   * Fetches all hosts for a given room, mapped to RoomHost model.
   */
  async getRoomHosts(roomId: string): Promise<RoomHost[]> {
    const cacheKey = `room-hosts:${roomId}`;
    const cachedEntry = this.cacheService.get(cacheKey);

    if (cachedEntry) {
      const isExpired = new Date().getTime() - cachedEntry.timestamp > CACHE_TTL;
      if (!isExpired) {
        return cachedEntry.response;
      }
    }

    const { data, error } = await this.supabaseClient.supabase
      .from('room_hosts')
      .select('*')
      .eq('room_id', roomId);
    if (error) throw new Error(error.message);

    const result = (data ?? []).map(mapRoomHostFromDb);
    this.cacheService.set(cacheKey, result);
    return result;
  }
}