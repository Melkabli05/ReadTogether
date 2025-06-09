import { 
  Component, 
  signal, 
  effect, 
  computed, 
  HostListener, 
  inject,
  DestroyRef,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { NgClass } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { DOCUMENT } from '@angular/common';
import { Button } from '../../../../shared/components/button/button';
import { TooltipModule } from 'primeng/tooltip';
import { filter } from 'rxjs/operators';

interface NavLink {
  readonly label: string;
  readonly icon: string;
  readonly routerLink: string;
  readonly badge?: number;
  readonly ariaLabel?: string;
}

const MOBILE_BREAKPOINT = 1024;
const SIDEBAR_STORAGE_KEY = 'sidebar-collapsed' as const;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  imports: [RouterModule, NgClass, AvatarModule, TooltipModule, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': '"sidebar-host"',
    '[attr.data-collapsed]': 'collapsed()',
    '[attr.data-mobile-open]': 'isMobileOpen()'
  }
})
export class SidebarComponent implements OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  
  // Signals for reactive state management
  readonly collapsed = signal(false);
  readonly isMobileOpen = signal(false);
  private readonly windowWidth = signal(this.getInitialWindowWidth());
  
  // Computed values
  readonly isMobile = computed(() => this.windowWidth() < MOBILE_BREAKPOINT);
  
  readonly sidebarClasses = computed(() => {
    const baseClasses = [
      'sidebar',
      'fixed', 'top-0', 'left-0', 'z-50',
      'flex', 'flex-col', 'h-screen',
      'transition-all', 'duration-300', 'ease-in-out',
      'overflow-hidden',
      'shadow-2xl',
      'bg-white', 'dark:bg-gray-900',
      'border-r', 'border-gray-200', 'dark:border-gray-700'
    ];
    
    if (this.isMobile()) {
      return [
        ...baseClasses,
        'h-full', 'w-80', 'max-w-[85vw]',
        this.isMobileOpen() ? 'translate-x-0' : '-translate-x-full'
      ].join(' ');
    }
    
    return [
      ...baseClasses,
      'lg:static', 'lg:translate-x-0',
      this.collapsed() ? 'w-16' : 'w-64'
    ].join(' ');
  });

  readonly navLinks: readonly NavLink[] = [
    { 
      label: 'Home', 
      icon: 'pi-home', 
      routerLink: '/',
      ariaLabel: 'Navigate to home page'
    },
    { 
      label: 'Discover', 
      icon: 'pi-compass', 
      routerLink: '/discover',
      ariaLabel: 'Discover new content'
    },
    { 
      label: 'Reading Rooms', 
      icon: 'pi-megaphone', 
      routerLink: '/reading-rooms',
      ariaLabel: 'Access reading rooms'
    },
    { 
      label: 'Library', 
      icon: 'pi-book', 
      routerLink: '/my-texts',
      ariaLabel: 'View your personal library'
    },
    { 
      label: 'Book Clubs', 
      icon: 'pi-users', 
      routerLink: '/clubs',
      ariaLabel: 'Join book clubs'
    },
    { 
      label: 'Schedule', 
      icon: 'pi-calendar', 
      routerLink: '/schedule',
      ariaLabel: 'View your schedule'
    },
    { 
      label: 'Your Sessions', 
      icon: 'pi-ticket', 
      routerLink: '/reading-sessions',
      ariaLabel: 'Manage your reading sessions'
    },
    { 
      label: 'Community', 
      icon: 'pi-comments', 
      routerLink: '/community',
      ariaLabel: 'Connect with the community'
    }
  ] as const;

  constructor() {
    this.setupEffects();
    this.restoreCollapsedState();
  }

  ngOnInit(): void {
    this.setupRouterSubscription();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateWindowWidth();
    this.handleMobileViewportChange();
  }

  @HostListener('window:keydown.escape')
  onEscape(): void {
    if (this.isMobileOpen()) {
      this.closeMobileSidebar();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.isMobile() && this.isMobileOpen()) {
      const target = event.target as HTMLElement;
      const sidebar = this.document.querySelector('.sidebar');
      
      if (sidebar && !sidebar.contains(target) && !this.isMenuButton(target)) {
        this.closeMobileSidebar();
      }
    }
  }

  toggleCollapse(): void {
    if (this.isMobile()) return;
    
    this.collapsed.update(current => {
      const newValue = !current;
      this.saveCollapsedState(newValue);
      return newValue;
    });
  }

  openMobileSidebar(): void {
    if (this.isMobile()) {
      this.isMobileOpen.set(true);
    }
  }

  closeMobileSidebar(): void {
    this.isMobileOpen.set(false);
    this.restoreFocusToMenuButton();
  }

  toggleMobileSidebar(): void {
    if (this.isMobile()) {
      this.isMobileOpen.update(current => !current);
    }
  }

  onNavItemClick(): void {
    if (this.isMobile()) {
      this.closeMobileSidebar();
    }
  }

  getUserProfileClasses(): string {
    const baseClasses = ['flex', 'items-center'];
    
    if (this.collapsed() && !this.isMobile()) {
      return [...baseClasses, 'flex-col', 'space-y-2'].join(' ');
    }
    
    return baseClasses.join(' ');
  }

  trackByRouterLink(_index: number, nav: NavLink): string {
    return nav.routerLink;
  }

  private setupEffects(): void {
    // Handle body overflow for mobile sidebar
    effect(() => {
      const body = this.document.body;
      const shouldLockScroll = this.isMobileOpen() && this.isMobile();
      
      body.classList.toggle('overflow-hidden', shouldLockScroll);
      body.classList.toggle('sidebar-mobile-open', shouldLockScroll);
    });

    // Auto-reset collapsed state on mobile
    effect(() => {
      if (this.isMobile() && this.collapsed()) {
        this.collapsed.set(false);
      }
    });
  }

  private setupRouterSubscription(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        if (this.isMobile() && this.isMobileOpen()) {
          this.closeMobileSidebar();
        }
      });
  }

  private getInitialWindowWidth(): number {
    if (typeof window === 'undefined') return 1200;
    return window.innerWidth;
  }

  private updateWindowWidth(): void {
    if (typeof window !== 'undefined') {
      this.windowWidth.set(window.innerWidth);
    }
  }

  private handleMobileViewportChange(): void {
    if (typeof window !== 'undefined' && 
        window.innerWidth >= MOBILE_BREAKPOINT && 
        this.isMobileOpen()) {
      this.closeMobileSidebar();
    }
  }

  private restoreCollapsedState(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    
    try {
      const savedState = localStorage.getItem(SIDEBAR_STORAGE_KEY);
      if (savedState !== null) {
        this.collapsed.set(JSON.parse(savedState));
      }
    } catch (error) {
      console.warn('Failed to restore sidebar state:', error);
    }
  }

  private saveCollapsedState(value: boolean): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(value));
    } catch (error) {
      console.warn('Failed to save sidebar state:', error);
    }
  }

  private restoreFocusToMenuButton(): void {
    const menuBtn = this.document.querySelector('[data-menu-trigger]') as HTMLElement;
    if (menuBtn) {
      menuBtn.focus();
    }
  }

  private isMenuButton(element: HTMLElement): boolean {
    return element.closest('[data-menu-trigger]') !== null;
  }
}