import { Component, ViewEncapsulation, ChangeDetectionStrategy, input, TemplateRef, computed, inject, output } from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { Router } from '@angular/router';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { RoomStatus } from '../../../features/reading-room/models/room-status.enum';
export interface ExploreSectionEmptyState {
  icon: string;
  title: string;
  message: string;
}

@Component({
  selector: 'app-explore-section',
  imports: [CommonModule, NgTemplateOutlet, FormsModule, SelectModule, InfiniteScrollDirective],
  templateUrl: './explore-section.html',
  styles: [
    `
   :host ::ng-deep .p-select {
     border: none !important;
     box-shadow: none !important;
   }
   :host ::ng-deep .no-border-select.p-select {
     border: none !important;
     box-shadow: none !important;
   }
    `
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExploreSection<T = unknown> {
  // === Inputs ===
  readonly title = input.required<string>();
  readonly icon = input.required<string>();
  readonly items = input.required<T[]>();
  readonly emptyState = input.required<ExploreSectionEmptyState>();
  readonly cardTemplate = input.required<TemplateRef<{ $implicit: T; index: number }>>();

  readonly colorClass = input<string>('');
  readonly buttonColorClass = input<string>('bg-gray-50 text-gray-700 hover:bg-gray-100');
  readonly showMoreLabel = input<string | undefined>(undefined);
  readonly showMoreRoute = input<string | undefined>(undefined);
  readonly animateIcon = input<boolean>(false);
  readonly badge = input<string | undefined>(undefined);
  readonly trackByFn = input<(index: number, item: T) => string | number>(
    (index: number, item: T) => (item as { id?: string | number })?.id ?? index
  );
  readonly showSort = input<boolean>(true);
  readonly sortOptions = input<{ label: string; value: string }[] | undefined>(undefined);
  readonly loading = input<boolean>(false);
  readonly selectedSort = input<string | undefined>(undefined);

  readonly loadMore = output<void>();
  readonly sortChanged = output<string>();

  private readonly router = inject(Router);

  handleLoadMore(): void {
    this.loadMore.emit();
  }

  handleSortChange(value: string): void {
    this.sortChanged.emit(value);
  }

  handleShowMore(): void {
    const route = this.showMoreRoute();
    if (!route) return;
  
    const isScheduled = this.title() === 'Scheduled Rooms';
    if (isScheduled) {
      this.router.navigate([route], { queryParams: { status: RoomStatus.Scheduled } });
    } else {
      this.router.navigate([route]);
    }
  }  

  get shouldUseInfiniteScroll(): boolean {
    return this.items().length > 4;
  }
}