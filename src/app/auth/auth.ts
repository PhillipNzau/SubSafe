import { CommonModule } from '@angular/common';
import { Component, inject, signal, Signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
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
    password: ['', [Validators.required, this.passwordValidator]],
  });

  signUpForm = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.passwordValidator]],
      confirm_password: ['', [Validators.required, this.passwordValidator]],
    },
    {
      validators: this.passwordMatchValidator(),
    }
  );

  passwordFieldType = signal<string>('password');
  isSignup = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value;

    if (!value) return null;

    const errors: ValidationErrors = {};

    if (value.length < 8) {
      errors['minLength'] = 'Password must be at least 8 characters long';
    }

    if (!/[A-Z]/.test(value)) {
      errors['uppercase'] =
        'Password must contain at least one uppercase letter';
    }

    if (!/[!@#$%^&*(),.?":{}|<>_\[\]\\\/~`+=;-]/.test(value)) {
      errors['specialChar'] =
        'Password must contain at least one special character';
    }

    if (/\s/.test(value)) {
      errors['containsSpace'] = 'Password must not contain spaces';
    }

    if (/[<>'"\\&]/.test(value)) {
      errors['dangerousChars'] = 'Password contains unsafe characters';
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }

  passwordMatchValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get('password')?.value;
      const confirmPassword = formGroup.get('confirm_password')?.value;

      if (!password || !confirmPassword) return null;

      return password === confirmPassword ? null : { passwordMismatch: true };
    };
  }

  getPasswordErrors(controlName: string): string[] {
    const control = (
      (this.isSignup() ? this.signUpForm : this.loginForm) as FormGroup
    ).get(controlName);

    const errors = control?.errors;
    if (!errors) return [];

    const messages: string[] = [];

    if (errors['minLength'])
      messages.push('Password must be at least 8 characters.');
    if (errors['uppercase'])
      messages.push('Must include at least one uppercase letter.');
    if (errors['specialChar'])
      messages.push('Must include at least one special character.');
    if (errors['containsSpace'])
      messages.push('Password cannot contain spaces.');
    if (errors['dangerousChars'])
      messages.push('Password contains unsafe characters.');

    return messages;
  }

  togglePasswordVisibility() {
    const current = this.passwordFieldType();

    this.passwordFieldType.set(current === 'password' ? 'text' : 'password');
  }
  toggleSignup() {
    this.isSignup.set(!this.isSignup());
  }

  // login user
  submitLoginForm() {
    const loadingToast = this.toastService.loading('Processing...');
    this.isSubmitting.set(true);

    this.authService.loginUser(this.loginForm.value).subscribe({
      next: (res) => {
        this.route.navigate(['/credentials']);
        this.toastService.success(`Login success, Welcome!`, {
          duration: 2000,
        });
        loadingToast.close();
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.toastService.error(
          `Something went wrong logging in! ${err.error.message}!!`,
          {
            duration: 2000,
          }
        );
        loadingToast.close();
        this.isSubmitting.set(false);
      },
    });
  }

  // register user
  submitSignupForm() {
    const loadingToast = this.toastService.loading('Processing...');
    this.isSubmitting.set(true);
    this.authService.registerUser(this.signUpForm.value).subscribe({
      next: (res) => {
        this.toastService.success(`User registration success, Welcome!`, {
          duration: 2000,
        });
        this.route.navigate(['/credentials']);
        loadingToast.close();
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.toastService.error(
          `Something went wrong registering! ${err.error.message}!`,
          {
            duration: 2000,
          }
        );
        loadingToast.close();
        this.isSubmitting.set(false);
      },
    });
  }
}
