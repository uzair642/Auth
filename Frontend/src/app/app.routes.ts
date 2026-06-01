import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { LayoutComponent } from './features/dashboard/layout/layout.component';
import { OverviewComponent } from './features/dashboard/overview/overview.component';
import { ProfileManagerComponent } from './features/profile/profile-manager/profile-manager.component';
import { ProductManagerComponent } from './features/products/product-manager/product-manager.component';

export const routes: Routes = [
  { path: '', redirectTo: '/register', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  {
    path: 'dashboard', 
    component: LayoutComponent, 
    canActivate: [authGuard], 
    children: [
      { path: '', component: OverviewComponent },
      { path: 'profile', component: ProfileManagerComponent },
      { path: 'products', component: ProductManagerComponent }
    ]
  }
];
