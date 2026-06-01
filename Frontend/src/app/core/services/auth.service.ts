import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5026/api/auth'; // Ensure ASP.NET core runs here
  private tokenKey = 'jwt_token';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {  
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap((res: any) => {
        if (res.token) { 
          this.setToken(res.token); 
        }
      })
    );
  }

  verifyOtp(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-otp`, data).pipe(
      tap((res: any) => {
        if (res.token) {
          this.setToken(res.token);
        }
      })
    );
  }

  forgotPassword(data: { email: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, data);
  }

  verifyResetOtp(data: { email: string, otp: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-reset-otp`, data);
  }

  resetPassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, data);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.isAuthenticatedSubject.next(true);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
}
