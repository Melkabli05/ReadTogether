import { Component, inject, input, signal, computed, effect, Signal } from '@angular/core';
import { NgClass, CommonModule } from '@angular/common';
import { NgOptimizedImage } from '@angular/common';
import { Room } from '../../../features/reading-room/models/room.model';
import { RoomStatus } from '../../../features/reading-room/models/room-status.enum';
import { User } from '../../../core/models/user.model';
import { RoomHost } from '../../../features/reading-room/models/room-host.model';
import { RoomService } from '../../../features/reading-room/data-access/room.service';
import { UserService } from '../../../core/services/user-service';
import { TextContentService } from '../../../core/services/textContent';
import { Button } from '../button/button';
import { ButtonSeverity } from '../button/button';

@Component({
  selector: 'app-room-card',
  imports: [CommonModule, NgClass, NgOptimizedImage, Button],
  template: `
    <article
      class="rounded-2xl p-4 sm:p-5 bg-white shadow-md border border-gray-100 transition hover:shadow-lg cursor-pointer flex flex-col gap-3 w-full fixed-room-card-height"
      [ngClass]="{ 'ring-2 ring-green-300': room().status === RoomStatus.Live }"
      tabindex="0"
    >
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-3">
          @if (hostUser()?.profilePictureUrl) {
            <img
              [ngSrc]="hostUser()?.profilePictureUrl ?? ''"
              [alt]="hostUser()?.displayName ?? 'Host'"
              width="40"
              height="40"
              class="w-10 h-10 rounded-full border border-gray-200 shadow"
            />
          } @else {
            <span
              class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 text-gray-600 border border-gray-200 text-lg font-bold"
              [title]="hostUser()?.displayName ?? 'Host'"
            >
              {{ hostUser()?.displayName?.charAt(0) ?? 'U' }}
            </span>
          }
          <div>
            <h3 class="text-base font-semibold text-gray-800">{{ room().title }}</h3>
            <p class="text-xs text-gray-500">Host: {{ hostUser()?.displayName ?? 'Unknown' }}</p>
          </div>
        </div>
        <span
          class="text-xs px-2 py-0.5 rounded-full font-medium"
          [ngClass]="statusBadgeClass()"
        >
          {{ statusLabel() }}
        </span>
      </div>
      <p class="text-sm text-gray-600 line-clamp-2 min-h-[2rem]">{{ room().description }}</p>
      @if (room().status === RoomStatus.Live && resolvedCurrentReader()) {
        <div class="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg p-2">
          @if (resolvedCurrentReader()?.profilePictureUrl) {
            <img
              [ngSrc]="resolvedCurrentReader()?.profilePictureUrl ?? ''"
              [alt]="resolvedCurrentReader()?.displayName ?? 'Current Reader'"
              width="32"
              height="32"
              class="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-white shadow"
            />
          }
          <span class="text-green-700 font-medium text-sm">{{ resolvedCurrentReader()?.displayName ?? 'Unknown' }}</span>
          <i class="pi pi-microphone text-green-700 text-sm"></i>
          @if (isHostCurrentReader()) {
            <span class="text-xs text-green-600 ml-1">(Host)</span>
          }
        </div>
      }
      @if (room().status === RoomStatus.Scheduled) {
        <div class="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-2">
          <i class="pi pi-clock text-yellow-700"></i>
          <span class="text-sm text-yellow-800">Starts at {{ room().scheduledTime | date:'shortTime' }}</span>
        </div>
      }
      <div class="flex flex-wrap gap-2 mt-1 text-xs text-gray-700">
        <div class="flex items-center gap-1">
          <i class="pi pi-users"></i>
          {{ room().audienceCount }} audience
        </div>
        <div class="flex items-center gap-1">
          <i class="pi pi-globe"></i>
          <span>{{ room().language }}</span>
        </div>
      </div>
      <div class="text-sm text-gray-800">
        <span class="font-medium">Text :</span> {{ resolvedTextContent() || 'Unknown' }}
      </div>
      <div class="flex items-center -space-x-3 mt-2">
        @for (host of resolvedHosts(); track host.id) {
          @if (host.profilePictureUrl) {
            <img
              [ngSrc]="host.profilePictureUrl"
              class="w-6 h-6 rounded-full border-2 border-white shadow"
              [alt]="host.displayName"
              [title]="host.displayName"
              width="24"
              height="24"
            />
          } @else {
            <span
              class="w-6 h-6 flex items-center justify-center rounded-full bg-gray-300 text-gray-600 border-2 border-white text-xs font-bold"
              [title]="host.displayName"
            >
              {{ host.displayName ? host.displayName.charAt(0) : (host.username ? host.username.charAt(0) : '?') }}
            </span>
          }
        }
      </div>
      <div class="flex flex-wrap gap-1 mt-2">
        @for (tag of room().tags; track tag) {
          <span class="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-medium">
            {{ tag }}
          </span>
        }
      </div>
      <app-button
        class="mt-auto"
        [label]="actionLabel()"
        [icon]="actionIcon()"
        [severity]="actionSeverity()"
        [outlined]="isOutlined()"
        [size]="'sm'"
        [fullWidth]="true"
      />
    </article>
  `,
  styles: [`
    .fixed-room-card-height {
      min-height: 27rem;
      height: 27rem;
    }
  `]
})
export class RoomCard {
  // --- Input ---
  readonly room = input.required<Room>();
  readonly RoomStatus = RoomStatus;

  // --- Services ---
  private readonly userService = inject(UserService);
  private readonly roomService = inject(RoomService);
  private readonly textService = inject(TextContentService);

  // --- Signals for async data ---
  readonly resolvedHosts = signal<readonly User[]>([]);
  readonly resolvedTextContent = signal<string | undefined>(undefined);
  readonly resolvedCurrentReader = signal<User | undefined>(undefined);
  
  // --- Fetch hosts and text content reactively ---
  constructor() {
    // Fetch hosts for the room
    effect(() => {
      const roomId = this.room().id;
      this.roomService.getRoomHosts(roomId).then((roomHosts: RoomHost[]) => {
        const userIds = roomHosts.map(h => h.userId);
        this.userService.getUsersByIds(userIds).then((users: User[]) => {
          this.resolvedHosts.set(users);
        });
      });
    });
    // Fetch text content title
    effect(() => {
      const textContentId = this.room().textContentId;
      if (textContentId) {
        this.textService.getTextContentTitle(textContentId).then((title: string | undefined) => {
          this.resolvedTextContent.set(title ?? undefined);
        });
      }
    });

    // Fetch current reader
    effect(() => {
      const currentReaderId = this.room().currentReaderId;
      if (currentReaderId) {
        this.userService.getUser(currentReaderId).then((user: User | undefined) => {
          this.resolvedCurrentReader.set(user ?? undefined);
        });
      }
    });
  }
  

  // --- Computed: Host user (first host) ---
  readonly hostUser = computed<User | undefined>(() => this.resolvedHosts()[0]);

  readonly isHostCurrentReader = computed<boolean>(() =>
    this.room().currentReaderId === this.hostUser()?.id
  );

  readonly statusLabel = computed<string>(() => getRoomStatusLabel(this.room().status));

  readonly statusBadgeClass = computed<Record<string, boolean>>(() => {
    return {
      'bg-green-100 text-green-700': this.room().status === RoomStatus.Live,
      'bg-yellow-100 text-yellow-700': this.room().status === RoomStatus.Scheduled,
      'bg-gray-100 text-gray-600': this.room().status === RoomStatus.Ended,
      'bg-red-100 text-red-700': this.room().status === RoomStatus.Cancelled
    };
  });

  readonly actionLabel = computed<string>(() => getRoomActionLabel(this.room().status));

  readonly actionIcon = computed<string | null>(() => {
    const status = this.room().status;
    if (status === RoomStatus.Live) {
      return 'pi pi-microphone';
    }
    if (status === RoomStatus.Scheduled) {
      return 'pi pi-sign-in';
    }
    return null;
  });

  readonly actionSeverity = computed<ButtonSeverity>(() => {
    const status = this.room().status;
    if (status === RoomStatus.Live || status === RoomStatus.Scheduled) {
      return 'primary';
    }
    return 'secondary';
  });

  readonly isOutlined = computed<boolean>(() => this.room().status !== RoomStatus.Live);
}

function getRoomStatusLabel(status: RoomStatus): string {
  switch (status) {
    case RoomStatus.Live:
      return 'Live';
    case RoomStatus.Scheduled:
      return 'Upcoming';
    case RoomStatus.Ended:
      return 'Ended';
    case RoomStatus.Cancelled:
      return 'Cancelled';
    default:
      return '';
  }
}

function getRoomActionLabel(status: RoomStatus): string {
  switch (status) {
    case RoomStatus.Live:
      return 'Join Room';
    case RoomStatus.Scheduled:
      return 'RSVP';
    case RoomStatus.Ended:
      return 'View Recap';
    default:
      return 'View';
  }
}
