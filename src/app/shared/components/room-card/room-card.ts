import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { PrimeIcons } from 'primeng/api';

export type RoomLevel = 'beginner' | 'intermediate' | 'advanced';
export type RoomStatus = 'live' | 'waiting' | 'ended';

export interface RoomCardData {
  title: string;
  description: string;
  tags: string[];
  languages: string[];
  persons: number;
  maxPersons: number;
  level: RoomLevel;
  status: RoomStatus;
  host: {
    name: string;
    avatarUrl?: string;
    isReading: boolean;
  };
  currentReader?: {
    name: string;
    avatarUrl?: string;
    isHost: boolean;
  };
  bookTitle: string;
  members: { name: string; avatarUrl?: string }[];
  actionLabel: string;
  actionType: 'primary' | 'secondary';
  startTime?: string;
}


@Component({
  selector: 'app-room-card',
  standalone: true,
  imports: [NgClass],
  template: `
    <article
      class="rounded-2xl w-full h-full p-6 flex flex-col gap-4 bg-white shadow-md border border-gray-100 hover:shadow-lg transition cursor-pointer"
      tabindex="0"
      aria-label="Room Card"
      >
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-3">
          @if (room.host.avatarUrl) {
            <img [src]="room.host.avatarUrl" [alt]="room.host.name" class="w-10 h-10 rounded-full border-2 border-white shadow" />
          }
          <div>
            <h3 class="text-lg font-bold text-gray-900 leading-tight">{{ room.title }}</h3>
            <p class="text-xs text-gray-500">Host: {{ room.host.name }}</p>
            <span
              class="text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap mt-1 inline-block"
              [ngClass]="{
                'bg-green-100 text-green-700': room.level === 'beginner',
                'bg-yellow-100 text-yellow-700': room.level === 'intermediate',
                'bg-red-100 text-red-700': room.level === 'advanced'
              }"
              >
              {{ room.level }}
            </span>
          </div>
        </div>
      </div>

      <p class="text-sm text-gray-600 mb-1 line-clamp-2 min-h-[2.5rem]">{{ room.description }}</p>
      
      <div class="min-h-[3.25rem]">
        @if (room.status === 'live' && room.currentReader) {
          <div class="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            @if (room.currentReader.avatarUrl) {
              <img [src]="room.currentReader.avatarUrl" [alt]="room.currentReader.name" class="w-8 h-8 rounded-full border-2 border-white shadow" />
            }
            <span class="font-medium text-green-800">{{ room.currentReader.name }}</span>
            <i class="pi pi-microphone text-green-700"></i>
            @if (room.currentReader.isHost) {
              <span class="ml-1 text-xs text-green-600">(Host)</span>
            }
          </div>
        }
        @if (room.status === 'waiting') {
          <div class="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
            <i class="pi pi-clock text-yellow-700"></i>
            <span class="font-medium text-yellow-800">Starts {{ room.startTime ? 'at ' + room.startTime : 'soon' }}</span>
          </div>
        }
      </div>

      <div class="flex-grow">
          <div class="flex items-center justify-between text-gray-500 text-sm border-b border-gray-100 pb-2">
            <div class="flex items-center gap-2">
              <i class="pi pi-users"></i>
              <span>{{ room.persons }}/{{ room.maxPersons }} members</span>
            </div>
            <div class="flex items-center gap-1">
              <i class="pi pi-globe"></i>
              <span>{{ room.languages[0] }}</span>
            </div>
          </div>
          <div class="text-sm text-gray-700 mt-2">
            <span class="font-medium">Reading:</span> {{ room.bookTitle }}
          </div>
          <div class="flex items-center gap-1 mt-2">
            @for (member of room.members; track member; let i = $index) {
              @if (member.avatarUrl) {
                <img
                  [src]="member.avatarUrl"
                  [alt]="member.name"
                  class="w-8 h-8 rounded-full border-2 border-white -ml-2 first:ml-0 shadow"
                  [attr.title]="member.name"
                  />
              } @else {
                <span class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 border-2 border-white -ml-2 first:ml-0 shadow text-gray-500 text-base" [attr.title]="member.name">
                  {{ member.name.charAt(0) }}
                </span>
              }
            }
          </div>
          <div class="flex flex-wrap gap-2 mt-2">
            @for (tag of room.tags; track tag) {
              <span class="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-medium">{{ tag }}</span>
            }
          </div>
      </div>


      <div class="mt-auto pt-2"> <button
          type="button"
          class="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold shadow transition focus:outline-none focus:ring-2 focus:ring-blue-400"
          [ngClass]="{
            'bg-blue-700 text-white hover:bg-blue-800': room.actionType === 'primary',
            'bg-white text-blue-700 border border-blue-700 hover:bg-blue-50': room.actionType === 'secondary'
          }"
          aria-label="Room action button"
          >
          @if (room.status === 'live') {
            <i class="pi pi-microphone"></i>
          }
          @if (room.status === 'waiting') {
            <i class="pi pi-sign-in"></i>
          }
          {{ room.actionLabel }}
        </button>
      </div>
    </article>
    `
})
export class RoomCard {
  @Input({ required: true }) room!: RoomCardData;

  PrimeIcons = PrimeIcons;
}