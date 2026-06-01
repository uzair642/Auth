import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav mode="side" opened class="sidenav">
        <div class="sidenav-header">
          <h2>Dashboard</h2>
        </div>
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <div matListItemTitle>Overview</div>
          </a>
          <a mat-list-item routerLink="/dashboard/products" routerLinkActive="active">
            <mat-icon matListItemIcon>inventory</mat-icon>
            <div matListItemTitle>Products</div>
          </a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <mat-toolbar color="primary" class="toolbar">
          <span>Authentication & Authorization System</span>
          <span class="spacer"></span>
          <button mat-icon-button routerLink="/dashboard/profile" title="Profile">
            <mat-icon>account_circle</mat-icon>
          </button>
          <button mat-icon-button (click)="logout()" title="Logout">
            <mat-icon>logout</mat-icon>
          </button>
        </mat-toolbar>
        <div class="content-wrapper">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
    }
    .sidenav {
      width: 250px;
      background-color: #ffffff;
      border-right: 1px solid #e0e0e0;
    }
    .sidenav-header {
      padding: 24px 16px;
      border-bottom: 1px solid #f0f0f0;
      margin-bottom: 8px;
    }
    .sidenav-header h2 {
      margin: 0;
      font-weight: 600;
      color: var(--primary-color);
    }
    .active {
      background-color: var(--secondary-color) !important;
      color: var(--primary-color) !important;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .toolbar {
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      z-index: 2;
      position: relative;
    }
    .content-wrapper {
      padding: 24px;
      height: calc(100vh - 112px);
      overflow-y: auto;
    }
  `]
})
export class LayoutComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
