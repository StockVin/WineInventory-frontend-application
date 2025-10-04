import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-password-recover',
  templateUrl: './password-recover.component.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule

  ],
  styleUrls: ['./password-recover.component.css']
})
export class PasswordRecoverComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.goToConfirmation();
    }
  }

  get email() {
    return this.form.get('email');
  }


  goToConfirmation() {
    const email = this.form.value.email;
    console.log('Sending password recovery email to:', email);
    this.router.navigate(['/confirmation-code']);
  }
}