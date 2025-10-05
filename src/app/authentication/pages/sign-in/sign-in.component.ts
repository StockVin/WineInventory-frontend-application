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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    TranslateModule
  ],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  loginForm: FormGroup;
  showRegister = false;
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const formData = this.loginForm.value;

      this.userService.login(formData.email, formData.password).subscribe({
        next: (isValid) => {
          this.isLoading = false;
          if (isValid) {
            console.log('Login exitoso');
            this.snackBar.open('Inicio de sesión exitoso', 'Cerrar', {
              duration: 3000
            });
            this.router.navigate(['/dashboard']);
          } else {
            console.log('Credenciales inválidas');
            this.snackBar.open('Credenciales inválidas. Verifica tu email y contraseña.', 'Cerrar', {
              duration: 3000
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error en el login:', error);
          this.snackBar.open('Error al iniciar sesión. Inténtalo de nuevo.', 'Cerrar', {
            duration: 3000
          });
        }
      });
    }
  }

  toggleForm() {
    this.router.navigate(['/sign-up']);
  }
}
