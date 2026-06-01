import { Component, ChangeDetectorRef, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.parent) return null;
  const newPassword = control.parent.get('newPassword')?.value;
  const confirmPassword = control.value;
  
  if (newPassword && confirmPassword && newPassword !== confirmPassword) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-forgot-password',
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
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  step: 'email' | 'otp' | 'password' = 'email';
  emailForm: FormGroup;
  otpForm: FormGroup;
  passwordForm: FormGroup;
  isLoading = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.otpForm = this.fb.group({
      otp0: ['', Validators.required],
      otp1: ['', Validators.required],
      otp2: ['', Validators.required],
      otp3: ['', Validators.required],
      otp4: ['', Validators.required],
      otp5: ['', Validators.required]
    });

    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, passwordMatchValidator]]
    });
  }

  ngOnInit() {
    this.passwordForm.get('newPassword')?.valueChanges.subscribe(() => {
      this.passwordForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  onRequestOtp() {
    if (this.emailForm.invalid) return;

    this.isLoading.set(true);
    this.authService.forgotPassword({ email: this.emailForm.value.email }).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.step = 'otp';
        this.snackBar.open(res.message || 'OTP sent successfully', 'Close', { duration: 5000 });
      },
      error: (err) => {
        this.isLoading.set(false);
        this.snackBar.open('Failed to request OTP', 'Close', { duration: 4000 });
      }
    });
  }

  onVerifyOtp() {
    if (this.otpForm.invalid) return;

    this.isLoading.set(true);
    const otpValue = `${this.otpForm.value.otp0}${this.otpForm.value.otp1}${this.otpForm.value.otp2}${this.otpForm.value.otp3}${this.otpForm.value.otp4}${this.otpForm.value.otp5}`;
    
    this.authService.verifyResetOtp({ email: this.emailForm.value.email, otp: otpValue }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.step = 'password';
        this.snackBar.open('OTP verified! Please enter your new password.', 'Close', { duration: 4000 });
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err.error?.message || 'Invalid OTP';
        this.snackBar.open(msg, 'Close', { duration: 4000 });
      }
    });
  }

  onResetSubmit() {
    if (this.passwordForm.invalid) return;

    this.isLoading.set(true);
    
    const otpValue = `${this.otpForm.value.otp0}${this.otpForm.value.otp1}${this.otpForm.value.otp2}${this.otpForm.value.otp3}${this.otpForm.value.otp4}${this.otpForm.value.otp5}`;
    
    const payload = {
      email: this.emailForm.value.email,
      otp: otpValue,
      newPassword: this.passwordForm.value.newPassword
    };

    this.authService.resetPassword(payload).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.snackBar.open('Password reset successfully! Please login.', 'Close', { duration: 4000 });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err.error?.message || 'Password reset failed';
        this.snackBar.open(msg, 'Close', { duration: 4000 });
      }
    });
  }

  onOtpInput(index: number, event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    
    // Jump to next box
    if (input.value && index < 5) {
      const nextInput = document.getElementById(`reset-otp-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
    
    // Jump to previous box on backspace
    if (event.key === 'Backspace' && !input.value && index > 0) {
      const prevInput = document.getElementById(`reset-otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  }
}
