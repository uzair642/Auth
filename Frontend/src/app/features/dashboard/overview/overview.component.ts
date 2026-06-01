import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ProfileService } from '../../../core/services/profile.service';
import { ProductService } from '../../../core/services/product.service';

import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="overview-container">
      <h1>Welcome back, {{ profile?.fullName || 'User' }}!</h1>
      <p class="subtitle">Here's what's happening with your account today.</p>

      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-header">
              <mat-icon color="primary">inventory_2</mat-icon>
              <h3>Total Products</h3>
            </div>
            <div class="stat-value">{{ totalProducts }} {{ totalProducts === 1 ? 'Product' : 'Products' }}</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-header">
              <mat-icon color="accent">business</mat-icon>
              <h3>Business Profile</h3>
            </div>
            <div class="stat-value">{{ hasBusinessProfile ? 'Active' : 'Not Setup' }}</div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .overview-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    h1 {
      font-size: 28px;
      margin-bottom: 8px;
      color: var(--primary-color);
    }
    .subtitle {
      color: var(--text-secondary);
      margin-bottom: 32px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }
    .stat-card {
      padding: 16px;
      transition: transform 0.2s ease;
    }
    .stat-card:hover {
      transform: translateY(-4px);
    }
    .stat-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }
    .stat-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 500;
      color: var(--text-secondary);
    }
    .stat-header mat-icon {
      transform: scale(1.2);
    }
    .stat-value {
      font-size: 24px;
      font-weight: 600;
      color: var(--text-primary);
    }
  `]
})
export class OverviewComponent implements OnInit {
  profile: any = null;
  hasBusinessProfile = false;
  totalProducts = 0;

  constructor(
    private profileService: ProfileService,
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.profileService.getProfile().subscribe(res => {
      this.profile = res;
      this.cdr.detectChanges();
    });

    this.profileService.getBusinessProfile().subscribe(res => {
      this.hasBusinessProfile = !!res;
      this.cdr.detectChanges();
    });

    this.productService.getProducts().subscribe({
      next: (res) => {
        this.totalProducts = res ? res.length : 0;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });
  }
}
