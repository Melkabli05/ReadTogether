import { Component, inject, ChangeDetectionStrategy, ViewEncapsulation, effect, signal, model, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { ActionButton, PageHeader } from '../../../../shared/components/page-header/page-header';
import { ExploreSection } from '../../../../shared/components/explore-section/explore-section';
import { RoomCard } from '../../../../shared/components/room-card/room-card';
import { LANGUAGE_LIST } from '../../../../shared/models/language-list.model';
import { DialogModule } from 'primeng/dialog';
import { RoomStore } from '../../data-access/room-store';

import { ActivatedRoute } from '@angular/router';
import { TabsListComponent } from '../../../../shared/components/tabs-list/tabs-list.component';
import { RoomStatus } from '../../models/room-status.enum';
import { Router } from '@angular/router';
import { RoomCreatePage } from "../room-create/room-create.page";

@Component({
  selector: 'app-room-list-page',
  imports: [
    FormsModule,
    InputTextModule,
    DropdownModule,
    TagModule,
    PageHeader,
    ExploreSection,
    RoomCard,
    DialogModule,
    TabsListComponent,
    RoomCreatePage
],
  templateUrl: './room-list.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [RoomStore],
})
export class RoomListPage {
  readonly store = inject(RoomStore);
  readonly languageOptions = LANGUAGE_LIST.map(lang => ({ label: lang.name, value: lang.code }));
  readonly sortOptions = [
    { label: 'Most Recent', value: 'recent' },
    { label: 'A-Z', value: 'az' }
  ];
  readonly openRoomDialogOpen = signal(false);
  readonly activeTab = model<RoomStatus>(RoomStatus.Live);
  readonly RoomStatus = RoomStatus;

  readonly route = inject(ActivatedRoute);

  constructor() {
    effect(() => {
      this.route.queryParams.subscribe(params => {
        const status = params['status'] as RoomStatus ?? RoomStatus.Live;
        this.activeTab.set(status);
        this.store.setStatusFilter(status);
      });
    });

    effect(() => {
      this.store.loadRooms(this.store.page() === 1);
    });

    effect(() => {
      this.store.setStatusFilter(this.activeTab());
    });
  }

  onSearchChange(query: string) {
    this.store.setFilters({ search: query });
  }

  onSortLanguageChange(languages: string[] | string) {
    if (Array.isArray(languages)) {
      this.store.setFilters({ languages });
    } else if (typeof languages === 'string') {
      this.store.setFilters({ languages: [languages] });
    }
  }

  onSortChange(sortBy: string) {
    this.store.setFilters({ sortBy: sortBy as any });
  }

  onLoadMore() {
    if (!this.store.hasMore() || this.store.isLoading()) return;
    this.store.setPage(this.store.page() + 1);
    this.store.loadRooms(false);
  }

  getTotalResults(): number {
    return this.store.rooms().length;
  }

  openRoomDialog(): void {
    this.openRoomDialogOpen.set(true);
  }

  closeOpenRoomDialog(): void {
    this.openRoomDialogOpen.set(false);
  }

  onHeaderAction(event: ActionButton): void {
    if (event.action === 'open') {
      this.openRoomDialog();
    }
  }

  setActiveTab(tab: string) {
    if (tab === RoomStatus.Live || tab === RoomStatus.Scheduled) {
      this.activeTab.set(tab as RoomStatus);
    }
  }

  setStatusFilter(status: RoomStatus) {
    this.store.setStatusFilter(status);
  }
} 