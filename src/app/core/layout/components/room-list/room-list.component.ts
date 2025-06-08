import { Component, Input } from '@angular/core';
import { RoomCard, RoomCardData } from '../../../../shared/components/room-card/room-card';
import { NgClass } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [NgClass, RoomCard, ButtonModule],
  template: `
    <div class="flex flex-col sm:flex-row mb-6 mt-4 justify-between items-center gap-2 sm:gap-0">
      <h2 class="text-xl sm:text-2xl font-bold">Available Rooms</h2>
      <!-- TODO: Show all arrow -->
      <p-button variant="text" label="Show all" [raised]="false" [rounded]="true" [icon]="'pi pi-angle-down'" [iconPos]="'right'" (onClick)="toggleShowAll()"/>
    </div>
    <div class="px-2 sm:px-0">
      <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        @for (room of visibleRooms; track room) {
          <app-room-card [room]="room"></app-room-card>
        }
      </div>
    </div>
    @if (shouldShowToggle) {
      <div class="flex justify-center mt-4">
        <button
          type="button"
          class="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold shadow hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          (click)="toggleShowAll()"
          aria-label="Toggle room list"
        >
          <i class="pi" [ngClass]="showAll ? 'pi-angle-up' : 'pi-angle-down'"></i>
          <span>{{ showAll ? 'Show less' : 'Show more' }}</span>
        </button>
      </div>
    }
  `,
})
export class RoomListComponent {
  @Input() maxVisible?: number;

  rooms: RoomCardData[] = [
    {
      title: 'Spanish Literature Club',
      description: 'Reading classic Spanish novels together with guided discussion and live sessions.',
      tags: ['Classic Literature', 'Discussion'],
      languages: ['Spanish'],
      persons: 4,
      maxPersons: 6,
      level: 'intermediate',
      status: 'live',
      host: {
        name: 'Maria Garcia',
        avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
        isReading: true
      },
      currentReader: {
        name: 'Maria Garcia',
        avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
        isHost: true
      },
      bookTitle: 'Cien años de soledad',
      members: [
        { name: 'Maria Garcia', avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg' },
        { name: 'Luis', avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg' },
        { name: 'Ana', avatarUrl: 'https://randomuser.me/api/portraits/women/65.jpg' },
        { name: 'Carlos', avatarUrl: 'https://randomuser.me/api/portraits/men/76.jpg' }
      ],
      actionLabel: 'Join Live Session',
      actionType: 'primary'
    },
    {
      title: 'French Poetry Circle',
      description: 'Exploring modern French poetry with pronunciation practice.',
      tags: ['Poetry', 'Pronunciation'],
      languages: ['French'],
      persons: 3,
      maxPersons: 4,
      level: 'advanced',
      status: 'live',
      host: {
        name: 'Pierre Dubois',
        avatarUrl: 'https://randomuser.me/api/portraits/men/45.jpg',
        isReading: false
      },
      currentReader: {
        name: 'Claire',
        avatarUrl: 'https://randomuser.me/api/portraits/women/22.jpg',
        isHost: false
      },
      bookTitle: 'Les Fleurs du mal',
      members: [
        { name: 'Pierre Dubois', avatarUrl: 'https://randomuser.me/api/portraits/men/45.jpg' },
        { name: 'Claire', avatarUrl: 'https://randomuser.me/api/portraits/women/22.jpg' },
        { name: 'Luc', avatarUrl: 'https://randomuser.me/api/portraits/men/33.jpg' }
      ],
      actionLabel: 'Join Live Session',
      actionType: 'primary'
    },
    {
      title: 'English Conversation Café',
      description: 'Casual English reading practice for beginners.',
      tags: ['Beginner', 'Conversation'],
      languages: ['English'],
      persons: 2,
      maxPersons: 8,
      level: 'beginner',
      status: 'waiting',
      host: {
        name: 'Host',
        avatarUrl: '',
        isReading: false
      },
      currentReader: {
        name: 'John',
        avatarUrl: 'https://randomuser.me/api/portraits/men/12.jpg',
        isHost: false
      },
      bookTitle: 'Simple Short Stories',
      members: [
        { name: 'John', avatarUrl: 'https://randomuser.me/api/portraits/men/12.jpg' },
        { name: 'Emma', avatarUrl: 'https://randomuser.me/api/portraits/women/19.jpg' }
      ],
      actionLabel: 'Join Room',
      actionType: 'secondary',
      startTime: 'in 5 min'
    },
    {
      title: 'German Book Club',
      description: 'Read and discuss German novels. All levels welcome!',
      tags: ['Literature', 'Discussion'],
      languages: ['German'],
      persons: 5,
      maxPersons: 10,
      level: 'intermediate',
      status: 'waiting',
      host: {
        name: 'Anna Schmidt',
        avatarUrl: 'https://randomuser.me/api/portraits/women/30.jpg',
        isReading: false
      },
      currentReader: {
        name: 'Anna Schmidt',
        avatarUrl: 'https://randomuser.me/api/portraits/women/30.jpg',
        isHost: true
      },
      bookTitle: 'Der Vorleser',
      members: [
        { name: 'Anna Schmidt', avatarUrl: 'https://randomuser.me/api/portraits/women/30.jpg' },
        { name: 'Max', avatarUrl: 'https://randomuser.me/api/portraits/men/41.jpg' },
        { name: 'Sophie', avatarUrl: 'https://randomuser.me/api/portraits/women/25.jpg' },
        { name: 'Lukas', avatarUrl: 'https://randomuser.me/api/portraits/men/55.jpg' },
        { name: 'Mia', avatarUrl: 'https://randomuser.me/api/portraits/women/12.jpg' }
      ],
      actionLabel: 'Join Room',
      actionType: 'secondary',
      startTime: 'at 10:30 PM'
    }
  ];

  showAll = false;

  get visibleRooms(): RoomCardData[] {
    if (!this.maxVisible || this.showAll) {
      return this.rooms;
    }
    return this.rooms.slice(0, this.maxVisible);
  }

  get shouldShowToggle(): boolean {
    return !!this.maxVisible && this.rooms.length > this.maxVisible;
  }

  toggleShowAll(): void {
    this.showAll = !this.showAll;
  }
} 