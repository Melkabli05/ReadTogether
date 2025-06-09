import { Component, computed, signal, input, output, model, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ChipModule } from 'primeng/chip';
import { PopoverMultiselect } from '../popover-multiselect/popover-multiselect';
import { Button, ButtonSeverity } from '../button/button';

export interface SortOption {
  label: string;
  value: string;
}

export interface HeaderStats {
  value: string;
  label: string;
}

export interface ActionButton {
  label: string;
  icon: string;
  action: string;
  severity?: ButtonSeverity;
  outlined?: boolean;
  disabled?: boolean;
}

@Component({
  selector: 'app-page-header',
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, ChipModule, PopoverMultiselect, Button],
  template: `
    <div class="rounded-2xl px-6 py-8" [class]="backgroundColor()">
      <!-- Header -->
      <div class='mb-8'>
        <h1 class='text-4xl font-bold text-white mb-2'>{{ title() }}</h1>
        <p class='text-emerald-100 text-lg'>{{ subtitle() }}</p>
      </div>

      <!-- Search, Filters, Sort, Actions -->
      <div class='flex flex-col gap-4'>
        <!-- Search Row -->
        <div class='flex flex-col w-full'>
          <div class='flex flex-col lg:flex-row gap-4 w-full'>
            <div class='flex-1 relative flex items-center'>
              <div class='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                <i class='pi pi-search text-emerald-300'></i>
              </div>
              <input
                type='text'
                [class]="'w-full pl-12 pr-4 py-3 text-base rounded-l-lg border border-emerald-300/50 text-white placeholder-emerald-200 focus:border-white focus:ring-white ' + backgroundColor()"
                pInputText
                [placeholder]='searchPlaceholder()'
                [ngModel]='searchQueryValue'
                (ngModelChange)='onSearchQueryChange($event)'
                (keyup.enter)="emitSearch()"
                aria-label='Search input'
                style='border-top-right-radius: 0; border-bottom-right-radius: 0;'
              />
              <button
                pButton
                type='button'
                class='py-4 px-4 rounded-r-lg border border-l-0 border-emerald-300/50 bg-white text-emerald-600 hover:bg-emerald-50 focus:border-white focus:ring-white transition-all duration-200 h-full'
                aria-label='Search'
                (click)='emitSearch()'
                style='border-top-left-radius: 0; border-bottom-left-radius: 0;'
              >
                <i class='pi pi-search'></i>
              </button>
            </div>

            <!-- Sort and Actions Row (right side) -->
            <div class='flex gap-3 items-center mt-4 lg:mt-0'>
              @if (showSort() && sortOptions().length > 0) {
                @if (sortOptionsType() === 'multi') {
                  <app-popover-multiselect
                    class=""
                    [options]="sortOptions()"
                    [(selected)]="selectedSortMulti"
                    [label]="sortMultiLabel()"
                    [placeholder]="sortMultiPlaceholder()"
                    [maxDisplayItems]="3"
                    (selectedChange)="onSortMultiChange($event)"
                  ></app-popover-multiselect>
                }
              }
              @if (showViewToggle()) {
                <app-button
                  [icon]="currentViewIcon()"
                  severity="white"
                  [outlined]="true"
                  [rounded]="true"
                  size="md"
                  (click)="gridView.set(!gridView()); viewToggle.emit(gridView())"
                />
              }
              @for (action of actionButtons(); track action.action) {
                <app-button
                  [label]="action.label"
                  [icon]="action.icon"
                  [severity]="action.severity ?? 'primary'"
                  [outlined]="action.outlined ?? false"
                  [disabled]="action.disabled ?? false"
                  size="md"
                  (click)="actionClick.emit(action)"
                />
              }
            </div>
          </div>
          <!-- Filters directly below search input -->
          @if (filterTemplate()) {
            <div class='mt-2'>
              <ng-container *ngTemplateOutlet='filterTemplate()'></ng-container>
            </div>
          }
          <!-- Selected Filters as Tags -->
          @if (shouldShowActiveFilters() && activeFilters().length > 0) {
            <hr class='my-4 border-t border-slate-200' />
            <div class='flex flex-wrap gap-2 items-center'>
              @for (filter of visibleFilters(); track filter.value) {
                <p-chip
                  [label]="filter.label"
                  class="bg-white border border-gray-300 text-xs font-medium shadow-sm p-1 px-2 rounded-full"
                  removable="true"
                  (onRemove)="removeFilter.emit(filter)"
                  aria-label="Remove filter"
                />
              }
              @if (showMoreFilters()) {
                <button
                  pButton
                  type='button'
                  label="+{{ activeFilters().length - 5 }} more"
                  class="p-button-sm p-button-rounded text-emerald-700 bg-emerald-100 border-emerald-300 font-semibold shadow px-2"
                  (click)='toggleShowAllFilters()'
                ></button>
              }
              @if (showAllFilters()) {
                <button
                  pButton
                  type='button'
                  label="Show less"
                  class="p-button-sm p-button-rounded text-emerald-700 bg-emerald-100 border-emerald-300 font-semibold shadow px-2"
                  (click)='toggleShowAllFilters()'
                ></button>
              }
              <button
                pButton
                type='button'
                label='Clear all'
                class='p-button-sm p-button-rounded p-button-danger font-bold shadow px-2'
                (click)='clearAllFilters.emit()'
              ></button>
            </div>
          }
        </div>
      </div>

      <!-- Results Counter -->
      @if (showResultsCounter() && resultsCountLabel()) {
        <div class='flex items-center justify-between mt-2'>
          <div class='flex items-center gap-2'>
            <div class='w-8 h-8 rounded-full flex items-center justify-center'>
              <i class='pi pi-search text-blue-600 text-sm'></i>
            </div>
            <span class='text-sm font-medium text-slate-700'>
              {{ resultsCountLabel() }}
            </span>
          </div>
          <div class='text-xs text-slate-500'>
            {{ resultsCountUpdatedLabel() }}
          </div>
        </div>
      }

      <!-- Statistics Cards -->
      @if (showStats() && stats().length > 0) {
        <div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          @for (stat of stats(); track stat.label) {
            <div class='bg-emerald-400/30 backdrop-blur-sm rounded-lg p-6 border border-emerald-300/30'>
              <div class='text-2xl font-bold text-white'>{{ stat.value }}</div>
              <div class='text-emerald-100 text-sm'>{{ stat.label }}</div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class PageHeader {
  title = input<string>('Header Title');
  subtitle = input<string>('Header subtitle or description');
  showSearch = input<boolean>(true);
  searchPlaceholder = input<string>('Search...');
  showSort = input<boolean>(true);
  sortOptions = input<SortOption[]>([]);
  sortPlaceholder = input<string>('Sort by');
  showViewToggle = input<boolean>(true);
  actionButtons = input<ActionButton[]>([]);
  filterTemplate = input<TemplateRef<unknown> | null>(null);
  showResultsCounter = input<boolean>(true);
  resultsCountLabel = input<string>('100');
  resultsCountUpdatedLabel = input<string>('Updated just now');
  showStats = input<boolean>(false);
  stats = input<HeaderStats[]>([]);
  sortOptionsType = input<'single' | 'multi'>('single');
  sortMultiLabel = input<string>('Filter');
  sortMultiPlaceholder = input<string>('Choose...');
  selectedSortMulti = model<string[]>([]);
  shouldShowActiveFilters = input<boolean>(true);
  backgroundColor = input<string>('bg-gradient-to-r from-emerald-500 to-teal-500');

  searchQuery = model<string>('');
  selectedSort = model<string>('');
  gridView = model<boolean>(true);

  searchChange = output<string>();
  sortChange = output<string | string[]>();
  viewToggle = output<boolean>();
  actionClick = output<ActionButton>();

  currentViewIcon = computed(() => this.gridView() ? 'pi pi-th-large' : 'pi pi-list');

  searchQueryValue = this.searchQuery();
  selectedSortValue = this.selectedSort();

  activeFilters = input<{ key: string; value: string; label: string }[]>([]);
  removeFilter = output<{ key: string; value: string; label: string }>();
  clearAllFilters = output<void>();

  showAllFilters = signal(false);

  visibleFilters() {
    const filters = this.activeFilters() ?? [];
    return this.showAllFilters() || filters.length <= 5
      ? filters
      : filters.slice(0, 5);
  }
  showMoreFilters() {
    return !this.showAllFilters() && (this.activeFilters()?.length ?? 0) > 5;
  }
  toggleShowAllFilters() {
    this.showAllFilters.set(!this.showAllFilters());
  }

  onSearchQueryChange(value: string) {
    this.searchQueryValue = value;
    this.searchQuery.set(value);
    this.searchChange.emit(value);
  }

  onSelectedSortChange(value: string | string[]) {
    this.selectedSortValue = value as string;
    this.selectedSort.set(value as string);
    // Only emit string if single select
    if (this.sortOptionsType() === 'single') {
      this.sortChange.emit(value as string);
    }
  }

  onSortMultiChange(values: string[]) {
    this.selectedSortMulti.set([...values]);
    // Only emit string[] if multi select
    if (this.sortOptionsType() === 'multi') {
      this.sortChange.emit([...values]);
    }
  }

  emitSearch() {
    this.searchChange.emit(this.searchQueryValue);
  }
} 