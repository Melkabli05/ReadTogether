import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

interface CacheEntry {
  response: any;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache = new Map<string, CacheEntry>();

  get(key: string): CacheEntry | null {
    return this.cache.get(key) ?? null;
  }

  set(key: string, response: any): void {
    const entry: CacheEntry = { response, timestamp: new Date().getTime() };
    this.cache.set(key, entry);
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
} 