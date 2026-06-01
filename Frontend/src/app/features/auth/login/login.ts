import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  loginForm: FormGroup;
  otpForm: FormGroup;
  isLoading = false;
  isOtpRequired = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.otpForm = this.fb.group({
      otp0: ['', Validators.required],
      otp1: ['', Validators.required],
      otp2: ['', Validators.required],
      otp3: ['', Validators.required],
      otp4: ['', Validators.required],
      otp5: ['', Validators.required]
    });
  }

  onLoginSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.cdr.detectChanges();
    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        setTimeout(() => {
          this.isLoading = false;
          if (res.isOtpRequired) {
            this.isOtpRequired = true;
            this.snackBar.open('Please check your email for the OTP code.', 'Close', { duration: 5000 });
          } else {
            this.router.navigate(['/dashboard']);
          }
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        setTimeout(() => {
          this.isLoading = false;
          const msg = err.error?.message || 'Login failed';
          this.snackBar.open(msg, 'Close', { duration: 4000 });
          this.cdr.detectChanges();
        });
      }
    });
  }

  onOtpSubmit() {
    if (this.otpForm.invalid) return;

    this.isLoading = true;
    this.cdr.detectChanges();
    const otpValue = `${this.otpForm.value.otp0}${this.otpForm.value.otp1}${this.otpForm.value.otp2}${this.otpForm.value.otp3}${this.otpForm.value.otp4}${this.otpForm.value.otp5}`;
    
    const payload = {
      email: this.loginForm.value.email,
      otp: otpValue
    };

    this.authService.verifyOtp(payload).subscribe({
      next: () => {
        this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        setTimeout(() => {
          this.isLoading = false;
          const msg = err.error?.message || 'Invalid OTP';
          this.snackBar.open(msg, 'Close', { duration: 4000 });
          this.cdr.detectChanges();
        });
      }
    });
  }

  onOtpInput(index: number, event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    
    // Jump to next box
    if (input.value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
    
    // Jump to previous box on backspace
    if (event.key === 'Backspace' && !input.value && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  }
}
