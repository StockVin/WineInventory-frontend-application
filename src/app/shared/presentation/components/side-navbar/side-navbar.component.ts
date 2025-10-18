import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { filter, takeUntil } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileService } from '../../../../profile/services/profile.service';
import { Subject } from 'rxjs';

export interface NavItem {
  icon: string;
  label: string;
  route: string;
  isActive?: boolean;
}

@Component({
  selector: 'app-side-navbar',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.css']
})
export class SideNavbarComponent implements OnInit, OnDestroy {
  isExpanded = true;
  navItems: NavItem[] = [
    { icon: 'home', label: 'side-navbar.options.dashboard', route: '/dashboard' },
    { icon: 'wine_bar', label: 'side-navbar.options.wine', route: '/orders' },
    { icon: 'inventory', label: 'side-navbar.options.inventory', route: '/inventory' },
    { icon: 'assessment', label: 'side-navbar.options.report', route: '/reports' },
    { icon: 'notifications', label: 'side-navbar.options.alert', route: '/alerts' },
    { icon: 'settings', label: 'side-navbar.options.configuration', route: '/profile' }
  ];

  unreadAlerts = 3;

  profileUsername = '';
  profileEmail = '';

  private get localUser() {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  }

  private destroy$ = new Subject<void>();

  constructor(private router: Router, private profileService: ProfileService) {}

  ngOnInit() {
    this.setActiveItem();

    const fallbackUser = this.localUser;
    if (fallbackUser) {
      this.profileUsername = fallbackUser.username ?? '';
      this.profileEmail = fallbackUser.email ?? '';
    }

    this.profileService
      .getProfile()
      .pipe(takeUntil(this.destroy$))
      .subscribe(profile => {
        if (profile) {
          this.profileUsername = profile.username;
          this.profileEmail = profile.email;
        }
      });

    const token = localStorage.getItem('token');
    if (token) {
      this.profileService
        .refreshProfile()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          error: () => {
          }
        });
    } else {
    }

    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        filter((event): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe(event => this.setActiveItem(event.urlAfterRedirects ?? this.router.url));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }

  setActiveItem(url?: string) {
    const currentRoute = url ?? this.router.url;
    this.navItems.forEach(item => {
      item.isActive = currentRoute.includes(item.route);
    });
  }

  onNavItemClick(item: NavItem) {
    this.navItems.forEach(i => i.isActive = false);
    item.isActive = true;
    this.router.navigate([item.route]);
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.router.navigate(['/sign-in']);
  }
}