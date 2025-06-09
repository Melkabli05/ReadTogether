import { Component, OnInit, ViewChild, signal, inject, ChangeDetectorRef } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';

import { RippleModule } from 'primeng/ripple';
import { MenubarModule } from 'primeng/menubar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { MenuModule } from 'primeng/menu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { NotificationList } from '../../../../shared/components/notification-list/notification-list';
import { PopoverModule } from 'primeng/popover';
import { DialogModule } from 'primeng/dialog';
import { Theme } from '../../../services/theme';
import { NotificationGroup } from '../../../../shared/components/notification-list/notification-list.model';
import { Button, ButtonSeverity } from "../../../../shared/components/button/button";

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
  imports: [MenubarModule, BadgeModule, AvatarModule, InputTextModule, RippleModule, AutoCompleteModule, DropdownModule, FormsModule, MenuModule, OverlayPanelModule, OverlayBadgeModule, NotificationList, PopoverModule, DialogModule, Button]
})
export class Topbar implements OnInit {
  private theme = inject(Theme);
  private cdr = inject(ChangeDetectorRef);

  isDarkMode = this.theme.isDarkMode;

  toggleTheme() {
    this.theme.toggleDarkMode();
  }
  items: MenuItem[] = [];
  newSessionDialogOpen = signal(false);

  searchOptions = [
    { label: 'All', value: 'all' },
    { label: 'Texts', value: 'texts' },
    { label: 'Users', value: 'users' }
  ];
  selectedFilter = this.searchOptions[0];
  searchQuery = '';
  searchResults: string[] = [];

  @ViewChild('notificationPopover') notificationPopover!: any;

  notifications = signal<NotificationGroup[]>([
    {
      group: 'Today',
      items: [
        {
          id: '1',
          type: 'invitation',
          text: 'You have a new reading invitation.',
          time: new Date().toISOString(),
          read: false
        },
        {
          id: '2',
          type: 'accepted',
          text: 'John accepted your reading invitation.',
          time: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 min ago
          read: false
        }
      ]
    },
    {
      group: 'Yesterday',
      items: [
        {
          id: '3',
          type: 'message',
          text: 'New message from Jane.',
          time: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
          read: true
        },
        {
          id: '4',
          type: 'reminder',
          text: 'Reading session with Bob starts soon.',
          time: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(), // 20 hours ago
          read: true
        },
        {
          id: '5',
          type: 'comment',
          text: 'Anna commented on your annotation.',
          time: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(), // 23 hours ago
          read: true
        }
      ]
    }
  ]);

  get unreadCount(): number {
    return this.notifications().reduce((acc, group) => acc + group.items.length, 0);
  }

  showNotifications(event: Event) {
    this.notificationPopover.toggle(event);
  }

  ngOnInit() {
    this.items = [
      {
        label: 'Profile',
        icon: 'pi pi-user',
      },
      {
        label: 'Settings',
        icon: 'pi pi-cog',
      },
      {
        separator: true,
      },
      {
        label: 'Sign Out',
        icon: 'pi pi-sign-out',
        command: () => {
          this.signOut();
        }
      }
    ];
  }

  onSearch(event: { query: string }) {
    const allSuggestions: Record<string, string[]> = {
      all: ['Text: Angular Best Practices', 'User: John Doe', 'Text: PrimeNG Guide', 'User: Jane Smith'],
      texts: ['Angular Best Practices', 'PrimeNG Guide', 'Tailwind Tips'],
      users: ['John Doe', 'Jane Smith', 'Alice Johnson']
    };
    const filter = this.selectedFilter.value;
    const query = event.query.toLowerCase();
    this.searchResults = (allSuggestions[filter] || allSuggestions['all'])
      .filter((option: string) => option.toLowerCase().includes(query));
  }

  signOut() {
    console.log('Sign out');
  }

  onStartNewSession() {
    this.newSessionDialogOpen.set(true);
  }

  closeNewSessionDialog() {
    this.newSessionDialogOpen.set(false);
    this.cdr.detectChanges();
  }

  get searchPlaceholder(): string {
    switch (this.selectedFilter.value) {
      case 'texts':
        return 'Search texts...';
      case 'users':
        return 'Search users...';
      default:
        return 'Search everything...';
    }
  }

  get themeIcon(): string {
    return this.isDarkMode() ? 'pi pi-sun' : 'pi pi-moon';
  }
  get themeSeverity(): ButtonSeverity {
    return this.isDarkMode() ? 'info' : 'secondary';
  }
}
