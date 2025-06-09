import { 
  Component, 
  input, 
  ChangeDetectionStrategy, 
  signal, 
  computed,
  viewChild,
  ElementRef,
  model,
  output
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { PopoverModule, Popover } from 'primeng/popover';
import { RippleModule } from 'primeng/ripple';

export interface PopoverMultiselectOption {
  label: string;
  value: string;
  disabled?: boolean;
  icon?: string;
}

@Component({
  selector: 'app-popover-multiselect',
  imports: [
    FormsModule,
    CheckboxModule,
    ButtonModule,
    PopoverModule,
    RippleModule
  ],
  template: `
    <div class="relative inline-block">
      <button
        #triggerButton
        type="button"
        pButton
        class="px-4 py-3 text-sm font-medium border transition-all duration-200"
        [class.bg-green-100]="hasSelections()"
        [class.text-green-700]="hasSelections()"
        [class.border-green-200]="hasSelections()"
        [class.bg-slate-100]="!hasSelections()"
        [class.text-slate-700]="!hasSelections()"
        [class.border-slate-200]="!hasSelections()"
        [class.hover:bg-green-50]="!hasSelections()"
        (click)="op.toggle($event)"
        [attr.aria-expanded]="op.overlayVisible"
        [attr.aria-haspopup]="true"
        [attr.aria-label]="ariaLabel()"
        >
        @if (icon()) {
          <i [class]="icon() + ' mr-2 text-xs'"></i>
        } @else {
          <i class="pi pi-book mr-2 text-xs"></i>
        }
        {{ displayLabel() }}
        @if (selectedCount() > 0 ) {
          <span class="ml-2 px-2 py-0.5 bg-green-200 text-green-800 text-xs rounded-full">
            {{ selectedCount() }}
          </span>
        }
      </button>

      <p-popover #op (onShow)="onPanelShow()" [style]="{ 'width': dropdownWidth() }">
        <div
          class="flex flex-col"
          role="listbox"
          [attr.aria-multiselectable]="true"
          [attr.aria-label]="'Select from ' + options().length + ' options'"
          >
          <div class="p-2 border-b border-slate-200 dark:border-slate-700">
            <div class="relative">
              <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true"></i>
              <input
                #searchInput
                type="text"
                [ngModel]="searchTerm()"
                (ngModelChange)="searchTerm.set($event)"
                class="w-full pl-9 pr-3 py-2 rounded-lg border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 bg-white dark:bg-slate-800 text-sm transition-all duration-200 placeholder:text-slate-400"
                [placeholder]="searchPlaceholder()"
                [attr.aria-label]="'Search through ' + options().length + ' options'"
                autocomplete="off"
                spellcheck="false"
                />
            </div>
          </div>

          <!-- Options List -->
          <div class="max-h-64 overflow-y-auto p-1">
            @if (filteredOptions().length === 0) {
              <div class="px-4 py-8 text-center">
                <i class="pi pi-inbox text-slate-300 dark:text-slate-600 text-4xl mb-3 block" aria-hidden="true"></i>
                <p class="text-slate-500 text-sm font-medium">{{ noResultsMessage() }}</p>
              </div>
            } @else {
              @for (option of filteredOptions(); track trackByValue($index, option)) {
                <div
                  class="flex items-center px-3 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-700/50 cursor-pointer transition-colors duration-150 rounded-lg group"
                  [class.font-semibold]="isSelected(option.value)"
                  [class.opacity-50]="option.disabled"
                  [class.cursor-not-allowed]="option.disabled"
                  (click)="!option.disabled && toggleOption(option.value)"
                  [attr.role]="'option'"
                  [attr.aria-selected]="isSelected(option.value)"
                  [attr.aria-disabled]="option.disabled"
                  >
                  <p-checkbox
                    [binary]="true"
                    [ngModel]="isSelected(option.value)"
                    (onChange)="!option.disabled && toggleOption(option.value)"
                    class="mr-3"
                    [attr.aria-label]="'Toggle ' + option.label"
                  ></p-checkbox>

                  <div class="flex items-center gap-2.5 flex-1 min-w-0">
                    @if (option.icon) {
                      <i [class]="option.icon + ' text-base text-slate-500 dark:text-slate-400'"></i>
                    }
                    <span class="truncate text-sm text-slate-800 dark:text-slate-200">{{ option.label }}</span>
                  </div>
                  @if (isSelected(option.value)) {
                    <i class="pi pi-check text-blue-600 dark:text-blue-400 text-sm ml-auto"></i>
                  }
                </div>
              }
            }
          </div>

          <!-- Footer Actions -->
          @if (showFooterActions()) {
            <div class="border-t border-slate-200 dark:border-slate-700 p-2 flex items-center justify-end gap-2">
              <button
                pButton
                pRipple
                type="button"
                label="Clear"
                class="p-button-text p-button-sm"
                (click)="clearAll()"
                [disabled]="!hasSelections()"
              ></button>
              <button
                pButton
                pRipple
                type="button"
                label="Select All"
                class="p-button-text p-button-sm"
                (click)="selectAll()"
                [disabled]="allSelected()"
              ></button>
            </div>
          }
        </div>
      </p-popover>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopoverMultiselect {
  // Modern Angular inputs using the new input() function
  selected = model<string[]>([]);
  options = input<PopoverMultiselectOption[]>([]);
  placeholder = input('Select options');
  icon = input<string>();
  label = input('');
  searchPlaceholder = input('Search...');
  showFooterActions = input(true);
  noResultsMessage = input('No results found');
  dropdownWidth = input('320px');
  maxDisplayItems = input(2);
  
  selectionChange = output<string[]>();
  panelShow = output<void>();
  panelHide = output<void>();
  
  searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');
  op = viewChild.required<Popover>('op');
  
  searchTerm = signal('');

  filteredOptions = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    let filtered = this.options();
    
    if (term) {
      filtered = filtered.filter(option => 
        option.label.toLowerCase().includes(term)
      );
    }
    
    const selectedSet = new Set(this.selected());
    return [
      ...filtered.filter(option => selectedSet.has(option.value)),
      ...filtered.filter(option => !selectedSet.has(option.value))
    ];
  });

  selectedCount = computed(() => (this.selected() ?? []).length);
  hasSelections = computed(() => this.selectedCount() > 0);
  
  allSelected = computed(() => 
    this.options().length > 0 && 
    this.selectedCount() === this.options().filter(opt => !opt.disabled).length
  );

  displayLabel = computed(() => {
    if (!this.hasSelections()) {
      return this.label() || this.placeholder();
    }
    
    if (this.selectedCount() <= this.maxDisplayItems()) {
      return this.options()
        .filter(opt => this.selected().includes(opt.value))
        .map(opt => opt.label)
        .join(', ');
    }
    
    return `${this.selectedCount()} selected`;
  });

  ariaLabel = computed(() => {
    const baseLabel = this.label() || 'Multiselect';
    return this.hasSelections() 
      ? `${baseLabel}: ${this.displayLabel()}`
      : baseLabel;
  });
  
  onPanelShow(): void {
    this.searchTerm.set('');
    this.panelShow.emit();
    // Use modern setTimeout with proper signal access
    setTimeout(() => {
      const searchInputEl = this.searchInput();
      if (searchInputEl) {
        searchInputEl.nativeElement.focus();
      }
    }, 50);
  }

  isSelected(value: string): boolean {
    return (this.selected() ?? []).includes(value);
  }

  toggleOption(value: string): void {
    const currentSelected = this.selected() ?? [];
    const newSelected = this.isSelected(value)
      ? currentSelected.filter(v => v !== value)
      : [...currentSelected, value];
    
    this.selected.set(newSelected);
    this.selectionChange.emit(newSelected);
  }

  selectAll(): void {
    const allValues = this.options()
      .filter(option => !option.disabled)
      .map(option => option.value);
    
    this.selected.set(allValues);
    this.selectionChange.emit(allValues);
  }

  clearAll(): void {
    this.selected.set([]);
    this.selectionChange.emit([]);
  }

  trackByValue(index: number, option: PopoverMultiselectOption): string {
    return `${option.value}_${index}`;
  }
}