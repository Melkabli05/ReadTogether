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

const MOBILE_BREAKPOINT = 1024;

@Component({
  selector: 'app-sidebar',
  template: `
    <!-- Mobile Menu Button -->
    @if (isMobile() && !isMobileOpen()) {
      <button
        type="button"
      class="fixed top-4 left-4 z-[60] lg:hidden bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl shadow-lg
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200
             active:scale-95"
        (click)="openMobileSidebar()"
        [attr.aria-label]="'Open navigation menu'"
        [attr.aria-expanded]="isMobileOpen()"
        >
        <i class="pi pi-bars text-lg" aria-hidden="true"></i>
      </button>
    }
    
    <!-- Mobile Backdrop -->
    @if (isMobileOpen() && isMobile()) {
      <div
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
        (click)="closeMobileSidebar()"
        tabindex="-1"
        aria-hidden="true"
      ></div>
    }
    
    <aside
      [ngClass]="sidebarClasses()"
      class="flex flex-col h-screen shadow-2xl bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
             scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
      [attr.aria-label]="'Navigation sidebar'"
      [attr.aria-hidden]="isMobile() && !isMobileOpen()"
      [attr.aria-expanded]="isMobileOpen()"
      [attr.inert]="isMobile() && !isMobileOpen() ? '' : null"
      role="navigation"
      >
      <!-- Mobile Close Button -->
      @if (isMobile() && isMobileOpen()) {
        <button
          type="button"
        class="absolute top-4 right-4 z-10 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700
               text-gray-600 dark:text-gray-300 rounded-full p-2 transition-colors duration-200
               focus:outline-none focus:ring-2 focus:ring-blue-500"
          (click)="closeMobileSidebar()"
          aria-label="Close navigation menu"
          >
          <i class="pi pi-times text-lg" aria-hidden="true"></i>
        </button>
      }
    
      <!-- Header -->
      <div class="flex items-center justify-center px-4 h-16 py-6 border-b border-gray-200 dark:border-gray-700
                  bg-gradient-to-b from-blue-50/50 dark:from-gray-800/50 to-transparent">
        <a
          routerLink="/dashboard"
          class="inline-flex items-center gap-3 px-2 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
          (click)="onNavItemClick()"
          >
          <div class="flex-shrink-0">
            <svg
              width="32"
              height="34"
              viewBox="0 0 31 33"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="text-blue-600 dark:text-blue-400"
              >
              <path
                d="M15.1934 0V0V0L0.0391235 5.38288L2.35052 25.3417L15.1934 32.427V32.427V32.427L28.0364 25.3417L30.3478 5.38288L15.1934 0Z"
                fill="currentColor"
                />
              <mask id="mask0_1_52" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="31" height="33">
                <path
                  d="M15.1934 0V0V0L0.0391235 5.38288L2.35052 25.3417L15.1934 32.427V32.427V32.427L28.0364 25.3417L30.3478 5.38288L15.1934 0Z"
                  fill="white"
                  />
              </mask>
              <g mask="url(#mask0_1_52)">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M15.1935 0V3.5994V3.58318V20.0075V20.0075V32.427V32.427L28.0364 25.3417L30.3478 5.38288L15.1935 0Z"
                  fill="currentColor"
                  />
              </g>
            </svg>
          </div>
    
          @if (!collapsed() || isMobile()) {
            <div class="min-w-0">
              <span class="text-xl font-bold text-gray-800 dark:text-gray-100 truncate">
                Read<span class="text-blue-600 dark:text-blue-400">Together</span>
              </span>
            </div>
          }
        </a>
      </div>
    
      <!-- Navigation -->
      <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto" role="navigation">
        <ul class="space-y-1" role="list">
          @for (nav of navLinks; track trackByRouterLink($index, nav)) {
            <li role="none">
              <a
                [routerLink]="nav.routerLink"
                routerLinkActive="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600"
                [routerLinkActiveOptions]="{exact: true}"
              class="group flex items-center px-3 py-3 rounded-l-lg text-gray-700 dark:text-gray-200
                     hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                     focus:ring-offset-white dark:focus:ring-offset-gray-900
                     transition-all duration-200 relative min-h-[44px]"
                [attr.title]="collapsed() && !isMobile() ? nav.label : null"
                [pTooltip]="collapsed() && !isMobile() ? nav.label : ''"
                [tooltipPosition]="'right'"
                (click)="onNavItemClick()"
                >
                <div class="flex-shrink-0 flex items-center justify-center w-6 h-6">
                  <i
                    class="pi text-lg transition-colors duration-200"
                    [ngClass]="nav.icon"
                    aria-hidden="true"
                  ></i>
                </div>
                @if (!collapsed() || isMobile()) {
                  <div class="flex items-center justify-between flex-1 ml-3 min-w-0">
                    <span class="font-medium truncate transition-colors duration-200">
                      {{ nav.label }}
                    </span>
                    @if (nav.badge && nav.badge > 0) {
                      <span
                  class="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold
                         bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full
                         min-w-[1.25rem] h-5 animate-pulse"
                        [attr.aria-label]="nav.badge + ' unread items'"
                        >
                        {{ nav.badge && nav.badge > 99 ? '99+' : nav.badge }}
                      </span>
                    }
                  </div>
                }
                <!-- Collapsed state badge -->
                @if (nav.badge && nav.badge > 0 && collapsed() && !isMobile()) {
                  <span
                class="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold
                       bg-red-500 text-white rounded-full min-w-[1.25rem] h-5 animate-pulse"
                    [attr.aria-label]="nav.badge + ' unread items'"
                    >
                    {{ nav.badge > 9 ? '9+' : nav.badge }}
                  </span>
                }
              </a>
            </li>
          }
        </ul>
      </nav>
    
      <!-- Desktop Collapse Toggle -->
      @if (!isMobile()) {
        <div class="relative flex justify-center py-4">
          <hr class="absolute top-1/2 left-4 right-4 border-t border-gray-300 dark:border-gray-600" />
          <button
            type="button"
            (click)="toggleCollapse()"
            pRipple
          class="relative cursor-pointer bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600
                 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20
                 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400
                 flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                 shadow-sm hover:shadow-md active:scale-95"
            [attr.aria-label]="collapsed() ? 'Expand sidebar' : 'Collapse sidebar'"
            >
            <i
              class="pi text-sm transition-transform duration-200"
              [ngClass]="collapsed() ? 'pi-angle-right' : 'pi-angle-left'"
              aria-hidden="true"
            ></i>
          </button>
        </div>
      }
    
      <!-- User Profile -->
      <div class="mt-auto border-t border-gray-200 dark:border-gray-700">
        <div
          class="p-4 bg-gradient-to-t from-blue-50/50 dark:from-gray-800/50 to-transparent"
          [class]="getUserProfileClasses()"
          >
          <div class="flex-shrink-0" [class.self-center]="collapsed() && !isMobile()">
            <p-avatar
              image="https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png"
              shape="circle"
              [size]="collapsed() && !isMobile() ? 'normal' : 'large'"
              class="ring-2 ring-blue-100 dark:ring-blue-900/50"
              />
          </div>
    
          @if (!collapsed() || isMobile()) {
            <div class="flex items-center justify-between flex-1 ml-3 min-w-0">
              <div class="min-w-0 flex-1">
                <p class="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
                  Amy Elsner
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                  amy.elsner example.com
                </p>
              </div>
              <button
                type="button"
                pRipple
              class="ml-2 p-2 rounded-full text-gray-500 dark:text-gray-400
                     hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                     transition-colors duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Open user settings"
                >
                <i class="pi pi-cog text-sm" aria-hidden="true"></i>
              </button>
            </div>
          }
        </div>
      </div>
    </aside>
    `,
  styleUrl: './sidebar.scss',
  standalone: true,
  imports: [RouterModule, NgClass, AvatarModule, RippleModule, TooltipModule]
})
export class SidebarComponent {
  private document = inject(DOCUMENT);
  
  collapsed = signal(false);
  isMobileOpen = signal(false);
  private windowWidth = signal(typeof window !== 'undefined' ? window.innerWidth : 1200);
  
  isMobile = computed(() => this.windowWidth() < MOBILE_BREAKPOINT);
  
  // Dynamic sidebar classes with better responsive behavior
  sidebarClasses = computed(() => {
    const baseClasses = 'fixed top-0 left-0 z-50 transition-all duration-300 ease-in-out overflow-y-auto';
    
    if (this.isMobile()) {
      return `${baseClasses} h-full w-80 max-w-[85vw] ${
        this.isMobileOpen() ? 'translate-x-0' : '-translate-x-full'
      }`;
    }
    
    // Desktop classes
    return `${baseClasses} lg:static lg:translate-x-0 h-screen ${
      this.collapsed() ? 'w-16' : 'w-64'
    }`;
  });

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
      const body = this.document.body;
      if (this.isMobileOpen() && this.isMobile()) {
        body.classList.add('overflow-hidden');
      } else {
        body.classList.remove('overflow-hidden');
      }
    });

    // Auto-reset collapsed state on mobile
    effect(() => {
      if (this.isMobile() && this.collapsed()) {
        this.collapsed.set(false);
      }
    });

    // Restore collapsed state from localStorage (desktop only)
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedState = localStorage.getItem('sidebar-collapsed');
      if (savedState !== null) {
        this.collapsed.set(JSON.parse(savedState));
      }
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (typeof window !== 'undefined') {
      this.windowWidth.set(window.innerWidth);
      if (window.innerWidth >= MOBILE_BREAKPOINT && this.isMobileOpen()) {
        this.closeMobileSidebar();
      }
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
    if (this.isMobile()) {
      this.isMobileOpen.set(true);
    }
  }

  closeMobileSidebar() {
    this.isMobileOpen.set(false);
    const menuBtn = this.document.querySelector('[aria-label="Open navigation menu"]') as HTMLElement;
    if (menuBtn) {
      menuBtn.focus();
    }
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

  // Helper method for user profile section classes
  getUserProfileClasses() {
    if (!this.collapsed() || this.isMobile()) {
      return 'flex';
    }
    return 'flex flex-col items-center space-y-2';
  }

  // TrackBy function for better performance
  trackByRouterLink(index: number, nav: NavLink): string {
    return nav.routerLink;
  }
}