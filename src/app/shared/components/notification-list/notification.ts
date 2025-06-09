import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { NotificationItem } from './notification-list.model';
import { RelativeTimePipe } from '../../pipes/relative-time-pipe';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-notification-item',
  imports: [RelativeTimePipe, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <li
      class="flex items-center gap-3 px-4 py-3 transition-colors rounded select-none focus:outline-none focus:bg-blue-100 hover:bg-blue-100 group"
      [class.cursor-pointer]="true"
      [class.bg-blue-50]="!item.read"
      [class.font-semibold]="!item.read"
      [class.bg-white]="item.read"
      (click)="markRead.emit(item.id)"
      tabindex="0"
      role="listitem"
      [attr.aria-label]="item.text"
      >
      <span class="icon text-lg" aria-hidden="true" [ngClass]="getIconClass(item.type)">
        <i class="pi"></i>
      </span>
      <div class="flex-1 min-w-0">
        <div class="truncate">{{ item.text }}</div>
        <div class="text-xs text-gray-400 mt-0.5">{{ item.time | relativeTime }}</div>
      </div>
      @if (!item.read) {
        <span class="w-2 h-2 bg-blue-500 rounded-full ml-2" aria-label="Unread notification"></span>
      }
    </li>
    `
})
export class Notification {
  @Input({ required: true }) item!: NotificationItem;
  @Output() markRead = new EventEmitter<string>();

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