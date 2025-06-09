import { Component, input, output, model, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { SelectButtonModule } from 'primeng/selectbutton';

export interface TabItem {
  label: string;
  value: string;
  icon?: string;
  disabled?: boolean;
  tooltip?: string;
  activeColor?: string;
  // TODO: Add tooltip icon to the tab when hover on this tooltip icon then show the tooltip

}

@Component({
  selector: 'app-tabs-list',
  imports: [CommonModule, TooltipModule],
  templateUrl: './tabs-list.component.html',
  styleUrl: './tabs-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsListComponent {
  readonly tabs = input.required<readonly TabItem[]>();
  readonly activeTab = model.required<string>();
  readonly tabClass = input<string>('');
  readonly navClass = input<string>('');
  readonly tablistLabel = input<string>('Tabs');

  readonly tabChange = output<string>();

  // Keyboard navigation
  private focusedIndex = signal(0);

  onTabClick(tab: TabItem, idx: number): void {
    if (!tab.disabled) {
      this.activeTab.set(tab.value);
      this.tabChange.emit(tab.value);
      this.focusedIndex.set(idx);
    }
  }

  onKeydown(event: KeyboardEvent, idx: number): void {
    const tabs = this.tabs();
    let newIndex = idx;
    if (event.key === 'ArrowRight') {
      newIndex = (idx + 1) % tabs.length;
    } else if (event.key === 'ArrowLeft') {
      newIndex = (idx - 1 + tabs.length) % tabs.length;
    } else if (event.key === 'Home') {
      newIndex = 0;
    } else if (event.key === 'End') {
      newIndex = tabs.length - 1;
    } else {
      return;
    }
    event.preventDefault();
    this.focusedIndex.set(newIndex);
    const tab = tabs[newIndex];
    if (!tab.disabled) {
      this.activeTab.set(tab.value);
      this.tabChange.emit(tab.value);
    }
  }

  isActive(tab: TabItem): boolean {
    return this.activeTab() === tab.value;
  }

  isFocused(idx: number): boolean {
    return this.focusedIndex() === idx;
  }
} 