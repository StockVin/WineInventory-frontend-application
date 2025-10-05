
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Profile } from '../../models/profile.entity';

export interface ProfileFormValue {
  fullName: string;
  email: string;
  username: string;
  phone: string;
  location: string;

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {ProfileService, UserProfile} from '../../services/profile.service';
import { Profile } from '../../models/profile.entity';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MapDialogComponent } from '../map-dialog/map-dialog.component';
import { UserService } from '../../../authentication/services/user.service';

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
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.css',
  host: {
    class: 'card profile-card'
  }
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css'],
  standalone: true,
  imports: [
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    ReactiveFormsModule,
    CommonModule,
  ],
})
export class ProfileEditComponent implements OnChanges {
  @Input({ required: true }) profile!: Profile;
  @Input() saving = false;
  @Input() errorMessage: string | null = null;

  @Output() saveProfile = new EventEmitter<ProfileFormValue>();
  @Output() cancelEdit = new EventEmitter<void>();

  private readonly formBuilder = inject(FormBuilder);
  private avatarHasError = false;

  readonly profileForm: FormGroup = this.formBuilder.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required, Validators.minLength(4)]],
    phone: ['', [Validators.required, Validators.minLength(7)]],
    location: ['', [Validators.required, Validators.minLength(3)]],
    currentPassword: ['', []],
    newPassword: ['', [Validators.minLength(6)]],
    confirmPassword: ['', [Validators.minLength(6)]]
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['profile'] && this.profile) {
      this.avatarHasError = false;
      this.patchFormWithProfile(this.profile);
    }
  }

  get avatarInitials(): string {
    return this.computeInitials(this.profile?.fullName ?? '');
  }

  submit(): void {
    if (this.profileForm.invalid || !this.ensurePasswordsMatch()) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const { fullName, email, username, phone, location } = this.profileForm.value as ProfileFormValue;
    this.saveProfile.emit({ fullName, email, username, phone, location });
  }

  resetForm(): void {
    if (this.profile) {
      this.patchFormWithProfile(this.profile);
    }
    this.profileForm.get('currentPassword')?.reset('');
    this.profileForm.get('newPassword')?.reset('');
    this.profileForm.get('confirmPassword')?.reset('');
    this.cancelEdit.emit();
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.profileForm.get(fieldName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  private patchFormWithProfile(profile: Profile): void {
    this.profileForm.patchValue({
      fullName: profile.fullName,
      email: profile.email,
      username: profile.username,
      phone: profile.phone,
      location: profile.location
    });
  }

  handleAvatarError(): void {
    this.avatarHasError = true;
  }

  get shouldShowAvatarImage(): boolean {
    return !!this.profile?.avatarUrl && !this.avatarHasError;
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

  private ensurePasswordsMatch(): boolean {
    const newPassword = this.profileForm.get('newPassword')?.value?.trim();
    const confirmPassword = this.profileForm.get('confirmPassword')?.value?.trim();

    if (!newPassword && !confirmPassword) {
      this.profileForm.get('confirmPassword')?.setErrors(null);
      return true;
    }

    if (newPassword !== confirmPassword) {
      this.profileForm.get('confirmPassword')?.setErrors({ mismatch: true });
      return false;
    }
    this.profileForm.get('confirmPassword')?.setErrors(null);
    return true;
  }
}
  form: FormGroup;
  hideActual = true;
  hideNew = true;
  hideConfirm = true;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private profileService: ProfileService,
    private dialog: MatDialog,
    private userService: UserService,

  ) {
    this.form = this.fb.group(
      {
        profileId: [null],
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        businessName: ['', Validators.required],
        businessAddress: [''],
        phone: [''],
        role: [''],
      },
      { validators: passwordMatchValidator() }
    );
  }

  ngOnInit(): void {
    const currentUser = this.userService.getCurrentUser();

    if (!currentUser || !currentUser.profile || !currentUser.profile.profileId) {
      console.error('No profileId found in currentUser');
      return;
    }

    const profileId = currentUser.profile.profileId;

    this.profileService.getProfileById(profileId).subscribe({
      next: (userProfile) => {
        const profile: Profile = {
          profileId: userProfile.profileId,
          name: userProfile.name,
          email: userProfile.email,
          businessName: '',
          businessAddress: '',
          phone: '',
          role: userProfile.role
        };
        this.form.patchValue(profile);
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.snackBar.open('Error al cargar el perfil', 'Cerrar', { duration: 3000 });
      }
    });
  }



  save(): void {

    if (this.form.hasError('passwordMismatch')) {
      this.snackBar.open('Las contraseñas no coinciden', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    if (this.form.valid) {
      const profile: Profile = this.form.value;
      this.profileService.editProfile(profile).subscribe(() => {
        this.snackBar.open('Perfil guardado correctamente', 'Cerrar', {
          duration: 3000
        });
        this.form.reset();
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  cancel(): void {
    this.form.reset();
  }

  openMap(): void {
    const address = this.form.get('businessAddress')?.value || '';
    this.dialog.open(MapDialogComponent, {
      data: address,
      width: '600px'
    });
  }
}

