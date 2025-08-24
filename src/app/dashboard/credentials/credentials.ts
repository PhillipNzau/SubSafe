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
  selectedCredentials = signal<CredentialsResponseModel | null>(null);
  isAddCredential = signal<boolean>(false);
  isEditCredential = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
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
    login_url: [
      '',
      [
        Validators.required,
        Validators.pattern(
          /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/
        ),
      ],
    ],
    notes: ['', [Validators.required]],
    category: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.listCredentials();
  }

  submitCreateCredentials() {
    this.isSubmitting.set(true);

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
          this.isAddCredential.set(false);
          this.isSubmitting.set(false);
        },
        error: (err) => {
          this.toastService.error(
            `Something went wrong creating credential! ${err.error.message}!!`,
            {
              duration: 2000,
            }
          );
          this.isSubmitting.set(false);
        },
      });
  }

  submitEditCredential() {
    this.isSubmitting.set(true);

    const loadingToast = this.toastService.loading('Processing...');
    this.credentialService
      .updateCredential(
        this.credentialForm.value,
        this.selectedCredentials()!.id
      )
      .subscribe({
        next: (res) => {
          loadingToast.close();
          this.toastService.success(`Updated credential successfully!`, {
            duration: 2000,
          });
          this.listCredentials();
          this.isEditCredential.set(false);
          this.credentialForm.reset();
          this.isSubmitting.set(false);
        },
        error: (err) => {
          this.toastService.error(
            `Something went wrong updating credential! ${err.error.message}!!`,
            {
              duration: 2000,
            }
          );
          this.isSubmitting.set(false);
        },
      });
  }

  listCredentials() {
    const loadingToast = this.toastService.loading('Processing...');

    this.credentialService.listCredentials().subscribe({
      next: (res: any) => {
        this.toastService.success(`Fetched credentials successfully!`, {
          duration: 2000,
        });

        this.credentials.set(res);
        loadingToast.close();
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
    this.isSubmitting.set(true);

    this.credentialService.deleteCredential(credentialId).subscribe({
      next: (res: any) => {
        this.isSubmitting.set(false);

        loadingToast.close();
        this.toastService.success(`Deleted credentials successfully!`, {
          duration: 2000,
        });

        this.listCredentials();
        this.toggleDeleteModal();
      },
      error: (err) => {
        loadingToast.close();
        this.toastService.error(
          `Something went wrong Deleting credentials! ${err.error.message}!!`,
          {
            duration: 2000,
          }
        );
        this.isSubmitting.set(false);
        this.toggleDeleteModal();
      },
    });
  }

  editCredential(credential: CredentialsResponseModel) {
    this.selectedCredentials.set(credential);
    this.credentialForm.patchValue({
      site_name: credential.site_name,
      username: credential.username,
      password: credential.password,
      login_url: credential.login_url,
      notes: credential.notes,
      category: credential.category,
    });
    this.toggleModal('edit');
  }

  toggleModal(type: string) {
    type === 'edit'
      ? this.isEditCredential.set(!this.isEditCredential())
      : this.isAddCredential.set(!this.isAddCredential());

    if (!this.isEditCredential()) {
      this.credentialForm.reset();
    }
  }

  togglePasswordVisibility() {
    const current = this.passwordFieldType();
    this.passwordFieldType.set(current === 'password' ? 'text' : 'password');
  }

  isDeleteModal = signal<boolean>(false);
  toggleDeleteModal() {
    this.isDeleteModal.set(!this.isDeleteModal());
  }

  setDeleteSubscription(credential: CredentialsResponseModel) {
    this.selectedCredentials.set(credential);
    this.toggleDeleteModal();
  }
}
