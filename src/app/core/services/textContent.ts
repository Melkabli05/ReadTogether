import { inject, Injectable } from '@angular/core';
import { SupabaseClientService } from './SupabaseClient';
import { TextContent } from '../models/text-content.model';
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

function mapTextContentFromDb(db: any): TextContent {
  return {
    id: db.id,
    title: db.title,
    author: db.author,
    content: db.content,
    type: db.type,
    genre: db.genre,
    readingLevel: db.reading_level,
    coverImageUrl: db.cover_image_url,
    uploaderId: db.uploader_id,
    isPublicDomain: db.is_public_domain,
    wordCount: db.word_count,
    estimatedReadingTime: db.estimated_reading_time,
    rating: db.rating,
    createdAt: db.created_at ? new Date(db.created_at) : new Date(0),
    updatedAt: db.updated_at ? new Date(db.updated_at) : new Date(0),
  };
}

@Injectable({
  providedIn: 'root'
})
export class TextContentService {
  private readonly supabase = inject(SupabaseClientService).supabase;
  private cacheService = inject(CacheService);

  constructor() {}

  async getTextContent(id: string): Promise<TextContent | undefined> {
    const cacheKey = `text-content:${id}`;
    const cachedEntry = this.cacheService.get(cacheKey);

    if (cachedEntry) {
      const isExpired = new Date().getTime() - cachedEntry.timestamp > CACHE_TTL;
      if (!isExpired) {
        return cachedEntry.response;
      }
    }

    const { data, error } = await this.supabase
      .from('text_contents')
      .select('*')
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    const result = data[0] ? mapTextContentFromDb(data[0]) : undefined;
    this.cacheService.set(cacheKey, result);
    return result;
  }

  async getTextContentTitle(id: string): Promise<string | undefined> {
    const cacheKey = `text-content-title:${id}`;
    const cachedEntry = this.cacheService.get(cacheKey);

    if (cachedEntry) {
      const isExpired = new Date().getTime() - cachedEntry.timestamp > CACHE_TTL;
      if (!isExpired) {
        return cachedEntry.response;
      }
    }

    const { data, error } = await this.supabase
      .from('text_contents')
      .select('title')
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    const result = data[0]?.title;
    this.cacheService.set(cacheKey, result);
    return result;
  }

  async getTextContentByIds(ids: string[]): Promise<TextContent[]> {
    const cacheKey = `text-contents-by-ids:${simpleHash(JSON.stringify(ids))}`;
    const cachedEntry = this.cacheService.get(cacheKey);

    if (cachedEntry) {
      const isExpired = new Date().getTime() - cachedEntry.timestamp > CACHE_TTL;
      if (!isExpired) {
        return cachedEntry.response;
      }
    }

    const { data, error } = await this.supabase
      .from('text_contents')
      .select('*')
      .in('id', ids);

    if (error) {
      throw new Error(error.message);
    }

    const result = (data ?? []).map(mapTextContentFromDb);
    this.cacheService.set(cacheKey, result);
    return result;
  }
}