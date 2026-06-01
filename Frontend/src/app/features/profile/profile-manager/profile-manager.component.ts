import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ProfileService } from '../../../core/services/profile.service';

@Component({
  selector: 'app-profile-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSlideToggleModule],
  templateUrl: './profile-manager.component.html',
  styleUrl: './profile-manager.component.css'
})
export class ProfileManagerComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  businessForm: FormGroup;
  profilePictureUrl: string | null = null;
  businessLogoUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      phoneNumber: [''],
      isOtpEnabled: [false]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.businessForm = this.fb.group({
      companyName: ['', Validators.required],
      address: [''],
      taxNumber: [''],
      phoneNumber: ['']
    });
  }

  ngOnInit() {
    this.profileService.getProfile().subscribe(res => {
      if (res) {
        this.profileForm.patchValue({
          fullName: res.fullName,
          phoneNumber: res.phoneNumber,
          isOtpEnabled: res.isOtpEnabled
        });
        this.profilePictureUrl = res.profilePictureUrl;
      }
    });

    this.profileService.getBusinessProfile().subscribe(res => {
      if (res) {
        this.businessForm.patchValue({
          companyName: res.companyName,
          address: res.address,
          taxNumber: res.taxNumber,
          phoneNumber: res.phoneNumber
        });
        this.businessLogoUrl = res.logoUrl;
      }
    });
  }

  updateProfile() {
    if (this.profileForm.valid) {
      this.profileService.updateProfile(this.profileForm.value).subscribe({
        next: () => {
          this.snackBar.open('Profile updated', 'Close', { duration: 3000 });
          this.profileForm.markAsPristine();
        },
        error: () => this.snackBar.open('Update failed', 'Close', { duration: 3000 })
      });
    }
  }

  changePassword() {
    if (this.passwordForm.valid) {
      this.profileService.changePassword(this.passwordForm.value).subscribe({
        next: () => {
          this.snackBar.open('Password changed successfully', 'Close', { duration: 3000 });
          this.passwordForm.reset();
        },
        error: (err) => {
          let msg = 'Password change failed';
          if (err.error) {
            if (err.error.message) {
              msg = err.error.message;
            } else if (Array.isArray(err.error) && err.error.length > 0) {
              msg = err.error.map((e: any) => e.description).join(' ');
            }
          }
          this.snackBar.open(msg, 'Close', { duration: 5000 });
        }
      });
    }
  }

  updateBusinessProfile() {
    if (this.businessForm.valid) {
      this.profileService.updateBusinessProfile(this.businessForm.value).subscribe({
        next: () => {
          this.snackBar.open('Business profile updated', 'Close', { duration: 3000 });
          this.businessForm.markAsPristine();
        },
        error: () => this.snackBar.open('Update failed', 'Close', { duration: 3000 })
      });
    }
  }

  getProfileImageUrl() {
    if (!this.profilePictureUrl) return 'https://ui-avatars.com/api/?name=User&background=random';
    if (this.profilePictureUrl.startsWith('http')) return this.profilePictureUrl;
    return `http://localhost:5026${this.profilePictureUrl}`;
  }

  getBusinessLogoUrl() {
    if (!this.businessLogoUrl) return 'https://ui-avatars.com/api/?name=Business&background=random';
    if (this.businessLogoUrl.startsWith('http')) return this.businessLogoUrl;
    return `http://localhost:5026${this.businessLogoUrl}`;
  }

  onProfilePictureSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.profileService.uploadProfilePicture(file).subscribe({
        next: (res) => {
          this.profilePictureUrl = res.url;
          this.snackBar.open('Profile picture updated', 'Close', { duration: 3000 });
        },
        error: () => this.snackBar.open('Failed to upload picture', 'Close', { duration: 3000 })
      });
    }
  }

  onBusinessLogoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.profileService.uploadBusinessLogo(file).subscribe({
        next: (res) => {
          this.businessLogoUrl = res.url;
          this.snackBar.open('Business logo updated', 'Close', { duration: 3000 });
        },
        error: () => this.snackBar.open('Failed to upload logo', 'Close', { duration: 3000 })
      });
    }
  }
}
