import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Authservice } from './shared/services/authservice';
import { passwordMatchValidator } from '../shared/services/password-validator';
import { HotToastService } from '@ngneat/hot-toast';
import { LoginUserModel } from './shared/models/users';
@Component({
  selector: 'app-auth',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {
  fb = inject(FormBuilder);
  route = inject(Router);
  authService = inject(Authservice);
  toastService = inject(HotToastService);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required], this.passwordValidator],
  });
  signUpForm = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required], this.passwordValidator],
      confirm_password: ['', [Validators.required], this.passwordValidator],
    },
    { validators: passwordMatchValidator() }
  );
  passwordFieldType: string = 'password';
  isSignup: boolean = false;

  // Password Validator to check if password has a blank
  passwordValidator(
    control: AbstractControl
  ): Promise<ValidationErrors | null> {
    const value = control.value;
    return new Promise((resolve) => {
      if (value && value.includes(' ')) {
        resolve({ containsSpace: true });
      } else {
        resolve(null);
      }
    });
  }
  togglePasswordVisibility() {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }
  toggleSignup() {
    this.isSignup = !this.isSignup;
  }

  // login user
  submitLoginForm() {
    const loadingToast = this.toastService.loading('Processing...');
    this.authService.loginUser(this.loginForm.value).subscribe({
      next: (res) => {
        this.route.navigate(['/credentials']);
        this.toastService.success(`Login success, Welcome!`, {
          duration: 2000,
        });
      },
      error: (err) => {
        this.toastService.error(
          `Something went wrong logging in! ${err.error.message}!!`,
          {
            duration: 2000,
          }
        );
      },
    });
  }

  // register user
  submitSignupForm() {
    this.authService.registerUser(this.signUpForm.value).subscribe({
      next: (res) => {
        this.toastService.success(`User registration success, Welcome!`, {
          duration: 2000,
        });
        this.route.navigate(['/credentials']);
      },
      error: (err) => {
        this.toastService.error(
          `Something went wrong registering! ${err.error.message}!`,
          {
            duration: 2000,
          }
        );
      },
    });
  }
}
