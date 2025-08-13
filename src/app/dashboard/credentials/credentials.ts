import { Component, inject, OnInit, signal } from '@angular/core';
import { CredentialTable } from './components/credential-table/credential-table';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CredentialsService } from './services/credentials-serice';
import { HotToastService } from '@ngneat/hot-toast';
import { CredentialsResponseModel } from './models/credentials';
import { Modal } from '../../shared/components/modal/modal';

@Component({
  selector: 'app-credentials',
  imports: [
    CredentialTable,
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    Modal,
  ],
  templateUrl: './credentials.html',
  styleUrl: './credentials.css',
})
export class Credentials implements OnInit {
  fb = inject(FormBuilder);
  credentialService = inject(CredentialsService);
  toastService = inject(HotToastService);

  credentials = signal<CredentialsResponseModel[]>([]);
  isAddCredential = signal<boolean>(false);
  passwordFieldType = signal<'password' | 'text'>('password');
  categories = signal([
    { id: '1', name: 'Streaming Service' },
    { id: '2', name: 'Social Media' },
    { id: '3', name: 'Finance' },
  ]);

  credentialForm = this.fb.nonNullable.group({
    site_name: ['', [Validators.required]],
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
    login_url: ['', [Validators.required]],
    notes: ['', [Validators.required]],
    category: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.listCredentials();
  }

  submitCreateCredentials() {
    const loadingToast = this.toastService.loading('Processing...');
    this.credentialService
      .createCredential(this.credentialForm.value)
      .subscribe({
        next: (res) => {
          loadingToast.close();
          this.toastService.success(`Created credential successfully!`, {
            duration: 2000,
          });
          this.listCredentials();
          this.toggleAddModal();
        },
        error: (err) => {
          this.toastService.error(
            `Something went wrong creating credential! ${err.error.message}!!`,
            {
              duration: 2000,
            }
          );
        },
      });
  }

  listCredentials() {
    const loadingToast = this.toastService.loading('Processing...');

    this.credentialService.listCredentials().subscribe({
      next: (res: any) => {
        loadingToast.close();
        this.toastService.success(`Fetched credentials successfully!`, {
          duration: 2000,
        });

        this.credentials.set(res);
      },
      error: (err) => {
        loadingToast.close();
        this.toastService.error(
          `Something went wrong Fetching credentials! ${err.error.message}!!`,
          {
            duration: 2000,
          }
        );
      },
    });
  }

  deleteCredential(credentialId: string) {
    const loadingToast = this.toastService.loading('Processing...');

    this.credentialService.deleteCredential(credentialId).subscribe({
      next: (res: any) => {
        loadingToast.close();
        this.toastService.success(`Deleted credentials successfully!`, {
          duration: 2000,
        });

        this.listCredentials();
      },
      error: (err) => {
        loadingToast.close();
        this.toastService.error(
          `Something went wrong Deleting credentials! ${err.error.message}!!`,
          {
            duration: 2000,
          }
        );
      },
    });
  }

  toggleAddModal() {
    this.isAddCredential.set(!this.isAddCredential());
  }

  togglePasswordVisibility() {
    const current = this.passwordFieldType();
    this.passwordFieldType.set(current === 'password' ? 'text' : 'password');
  }
}
