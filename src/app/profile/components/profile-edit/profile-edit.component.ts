import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Profile } from '../../models/profile.entity';
import { ProfileService, UserProfile } from '../../services/profile.service';
import { UserService } from '../../../authentication/services/user.service';
import { SideNavbarComponent } from "../../../shared/presentation/components/side-navbar/side-navbar.component";
import { LanguageSwitcher } from "../../../shared/presentation/components/language-switcher/language-switcher.component";
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

export interface ProfileFormValue {
  fullName: string;
  email: string;
  username: string;
  phone: string;
  location: string;
}

function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return newPassword && confirmPassword && newPassword !== confirmPassword
      ? { passwordMismatch: true }
      : null;
  };
}

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SideNavbarComponent,
    LanguageSwitcher,
    TranslateModule
  ],
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit, OnDestroy {
  private _profile?: Profile;

  @Input()
  set profile(value: Profile | undefined) {
    this._profile = value;
    if (value) {
      this.updateFormWithProfile();
    }
  }

  get profile(): Profile | undefined {
    return this._profile;
  }

  @Input() saving = false;
  @Input() errorMessage: string | null = null;

  @Output() saveProfile = new EventEmitter<ProfileFormValue>();
  @Output() cancelEdit = new EventEmitter<void>();

  private readonly formBuilder = inject(FormBuilder);
  private readonly profileService = inject(ProfileService);
  private readonly userService = inject(UserService);
  private avatarHasError = false;
  private readonly router = inject(Router);
  private destroy$ = new Subject<void>();

  readonly profileForm: FormGroup = this.formBuilder.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required, Validators.minLength(4)]],
    phone: ['', [Validators.required, Validators.minLength(7)]],
    location: ['', [Validators.required, Validators.minLength(3)]],
    currentPassword: ['', []],
    newPassword: ['', [Validators.minLength(6)]],
    confirmPassword: ['', [Validators.minLength(6)]]
  }, { validators: passwordMatchValidator() });

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { profile?: Profile };
    if (state?.profile) {
      this.profile = state.profile;
    }

    if (!this.profile) {
      const currentProfile = this.profileService.getProfileSnapshot();
      if (currentProfile) {
        this.profile = currentProfile;
      }
    }

    this.updateFormWithProfile();

    this.profileService.getProfile()
      .pipe(takeUntil(this.destroy$))
      .subscribe(profile => {
        if (profile) {
          this.profile = profile;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateFormWithProfile(): void {
    if (this._profile) {
      this.profileForm.patchValue({
        fullName: this._profile.fullName,
        email: this._profile.email,
        username: this._profile.username,
        phone: this._profile.phone,
        location: this._profile.location
      });
    }
  }

  submit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const { fullName, email, username, phone, location } = this.profileForm.value as ProfileFormValue;
    this.saveProfile.emit({ fullName, email, username, phone, location });
  }
  return(): void {
    this.router.navigate(['/profile']);
  }
  resetForm(): void {
    this.updateFormWithProfile();
    this.profileForm.get('currentPassword')?.reset('');
    this.profileForm.get('newPassword')?.reset('');
    this.profileForm.get('confirmPassword')?.reset('');
    this.cancelEdit.emit();
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.profileForm.get(fieldName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  get shouldShowAvatarImage(): boolean {
    return !!this.profile?.avatarUrl && !this.avatarHasError;
  }

  get avatarInitials(): string {
    if (!this.profile?.fullName) {
      return 'US';
    }
    return this.computeInitials(this.profile.fullName);
  }

  handleAvatarError(): void {
    this.avatarHasError = true;
  }

  private computeInitials(fullName: string): string {
    if (!fullName) {
      return 'US';
    }

    const initials = fullName
      .split(' ')
      .filter(part => part.trim().length > 0)
      .slice(0, 2)
      .map(part => part.trim().charAt(0).toUpperCase())
      .join('');

    return initials || fullName.charAt(0).toUpperCase();
  }
}
