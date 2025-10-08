import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatSelectModule,
    MatSnackBarModule,
    TranslateModule
  ],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  signupForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  
  roles = [
    { value: 'Distributor', viewValue: 'Distributor' },
    { value: 'Productor', viewValue: 'Productor' },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      role: ['user', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const formData = this.signupForm.value;

      this.userService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      }).subscribe({
        next: (response) => {
          console.log('Usuario registrado exitosamente:', response);
          this.snackBar.open('Usuario registrado exitosamente', 'Cerrar', {
            duration: 3000
          });
          this.router.navigate(['/sign-in']);
        },
        error: (error) => {
          console.error('Error en el registro:', error);
          if (error && error.status === 409) {
            this.signupForm.get('email')?.setErrors({ emailTaken: true });
            this.snackBar.open('El correo ya está registrado. Usa otro correo o inicia sesión.', 'Cerrar', {
              duration: 3500
            });
            return;
          }
          this.snackBar.open('Error al registrar usuario. Inténtalo de nuevo.', 'Cerrar', {
            duration: 3000
          });
        }
      });
    }
  }

  toggleForm() {
    this.router.navigate(['/sign-in']);
  }
}
