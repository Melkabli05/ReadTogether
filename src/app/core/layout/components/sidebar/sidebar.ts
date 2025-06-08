import { Component, signal, effect, computed, HostListener, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgClass } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { DOCUMENT } from '@angular/common';

interface NavLink {
  label: string;
  icon: string;
  routerLink: string;
  badge?: number;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  standalone: true,
  imports: [RouterModule, NgClass, AvatarModule, RippleModule, TooltipModule]
})
export class SidebarComponent {
  private document = inject(DOCUMENT);
  
  collapsed = signal(false);
  isMobileOpen = signal(false);
  
  isMobile = computed(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 640;
    }
    return false;
  });
  
  sidebarClasses = computed(() => ({
    'fixed top-0 left-0 h-screen z-50 transition-all duration-300 ease-in-out': true,
    'bg-white dark:bg-gray-900 shadow-xl border-r border-gray-200 dark:border-gray-700': true,
    'overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600': true,
    
    // Mobile styles
    'w-full max-w-sm': this.isMobile(),
    'transform translate-x-0': this.isMobile() && this.isMobileOpen(),
    'transform -translate-x-full': this.isMobile() && !this.isMobileOpen(),
    
    // Desktop styles  
    'sm:static sm:translate-x-0': !this.isMobile(),
    'w-16': !this.isMobile() && this.collapsed(),
    'w-64': !this.isMobile() && !this.collapsed(),
  }));

  navLinks: NavLink[] = [
    { label: 'Home', icon: 'pi-home', routerLink: '/dashboard' },
    { label: 'My Library', icon: 'pi-book', routerLink: '/my-texts', badge: 3 },
    { label: 'Find Partners', icon: 'pi-users', routerLink: '/find-partner' },
    { label: 'My Sessions', icon: 'pi-calendar', routerLink: '/reading-sessions', badge: 2 },
    { label: 'Community', icon: 'pi-comments', routerLink: '/community' }
  ];

  constructor() {
    // Handle body overflow when mobile sidebar is open
    effect(() => {
      if (this.isMobileOpen()) {
        this.document.body.classList.add('overflow-hidden', 'sm:overflow-auto');
      } else {
        this.document.body.classList.remove('overflow-hidden', 'sm:overflow-auto');
      }
    });

    // Auto-collapse on mobile
    effect(() => {
      if (this.isMobile() && this.collapsed()) {
        this.collapsed.set(false);
      }
    });

    // Restore collapsed state from localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedState = localStorage.getItem('sidebar-collapsed');
      if (savedState !== null) {
        this.collapsed.set(JSON.parse(savedState));
      }
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth >= 640 && this.isMobileOpen()) {
      this.closeMobileSidebar();
    }
  }

  @HostListener('window:keydown.escape')
  onEscape() {
    if (this.isMobileOpen()) {
      this.closeMobileSidebar();
    }
  }

  toggleCollapse() {
    if (!this.isMobile()) {
      this.collapsed.update(v => {
        const newValue = !v;
        // Save to localStorage
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('sidebar-collapsed', JSON.stringify(newValue));
        }
        return newValue;
      });
    }
  }

  openMobileSidebar() {
    this.isMobileOpen.set(true);
  }

  closeMobileSidebar() {
    this.isMobileOpen.set(false);
  }

  toggleMobileSidebar() {
    this.isMobileOpen.update(v => !v);
  }

  onNavItemClick() {
    // Auto-close mobile sidebar when navigation item is clicked
    if (this.isMobile()) {
      this.closeMobileSidebar();
    }
  }
}