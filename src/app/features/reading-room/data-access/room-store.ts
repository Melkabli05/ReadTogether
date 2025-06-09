import { computed, inject, Injectable } from '@angular/core';
import { signalStore, withState, withComputed, withMethods } from '@ngrx/signals';
import { patchState } from '@ngrx/signals';
import { Room } from '../models/room.model';
import { RoomFilters, RoomService } from './room.service';
import { RoomStatus } from '../models/room-status.enum';

type RoomStoreState = {
  rooms: Room[];
  total: number;
  isLoading: boolean;
  filters: RoomFilters;
  page: number;
  pageSize: number;
  error?: string;
};

const initialState: RoomStoreState = {
  rooms: [],
  total: 0,
  isLoading: false,
  filters: {
    search: '',
    languages: [],
    sortBy: 'recent',
    status: RoomStatus.Live,
  },
  page: 1,
  pageSize: 25,
  error: undefined,
};

export const RoomStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed(({ rooms }) => ({
    hasMore: computed(() => rooms().length < 111),
  })),

  withMethods((store, api = inject(RoomService)) => ({
    setFilters(filters: Partial<Omit<RoomFilters, 'status'> & { status?: RoomStatus }>) {
      patchState(store, (state) => ({
        filters: { ...state.filters, ...filters },
        page: 1,
      }));
    },
    setStatusFilter(status: RoomStatus) {
      patchState(store, (state) => ({
        filters: { ...state.filters, status },
        page: 1,
      }));
    },
    setPage(page: number) {
      patchState(store, { page });
    },
    async loadRooms(reset = false) {
      patchState(store, { isLoading: true, error: undefined });
      try {
        const { rooms, total } = await api.getRooms({
          ...store.filters(),
          page: store.page(),
          pageSize: store.pageSize(),
        });
        patchState(store, (state) => ({
          rooms: reset ? rooms : [...state.rooms, ...rooms.filter(r => !state.rooms.some(e => e.id === r.id))],
          total,
        }));
      } catch (err: any) {
        patchState(store, { error: err.message ?? 'Failed to load rooms' });
      } finally {
        patchState(store, { isLoading: false });
      }
    },
    clearRooms() {
      patchState(store, { rooms: [], total: 0 });
    },
  }))
);
