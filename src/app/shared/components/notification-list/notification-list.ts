import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { NotificationGroup, NotificationItem } from './notification-list.model';
import { Notification } from './notification';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [OverlayBadgeModule, Notification],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="bg-white rounded-lg w-full max-w-md max-h-96 overflow-y-auto" aria-label="Notifications" aria-live="polite" role="list">
      <header class="flex justify-between items-center px-4 py-2 border-b border-gray-200">
        <span class="font-bold text-base">Notifications</span>
        <div class="flex gap-2">
          <button type="button" class="text-xs font-medium px-2 py-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500" (click)="markAllRead.emit()" aria-label="Mark all as read">Mark all as read</button>
          <button type="button" class="text-xs font-medium px-2 py-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500" (click)="clearAll.emit()" aria-label="Clear all notifications">Clear all</button>
        </div>
      </header>
      @for (group of notifications(); let i = $index; track groupTrackBy(i, group)) {
        <div class="text-xs uppercase text-gray-400 font-semibold px-4 pt-4 pb-1">{{ group.group }}</div>
        <ul>
          @for (n of group.items; let j = $index; track itemTrackBy(j, n)) {
            <app-notification-item
              [item]="n"
              (markRead)="markRead.emit($event)"
            ></app-notification-item>
          }
        </ul>
      }
      @if (!notifications() || notifications().length === 0) {
        <div class="text-center text-gray-400 py-8">No notifications</div>
      }
    </section>
  `
})
export class NotificationList {
  readonly notifications = input<readonly NotificationGroup[]>([]);
  readonly markAllRead = output<void>();
  readonly clearAll = output<void>();
  readonly markRead = output<string>();

  readonly groupTrackBy = (index: number, group: NotificationGroup) => group.group;
  readonly itemTrackBy = (index: number, item: NotificationItem) => item.id;

  getIconClass(type: NotificationItem['type']): string {
    switch (type) {
      case 'invitation':
        return 'pi pi-user-plus text-blue-500';
      case 'accepted':
        return 'pi pi-check-circle text-green-500';
      case 'message':
        return 'pi pi-envelope text-purple-500';
      case 'reminder':
        return 'pi pi-clock text-yellow-500';
      case 'comment':
        return 'pi pi-comment text-cyan-500';
      default:
        return '';
    }
  }
}
