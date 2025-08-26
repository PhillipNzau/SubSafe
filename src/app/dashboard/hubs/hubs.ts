import { Component, inject, OnInit, signal } from '@angular/core';
import { HubsService } from './services/hubs-service';
import { HubsResponseModel } from './models/hubs-model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { Modal } from '../shared/components/modal/modal';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HubTable } from './components/hub-table/hub-table';

@Component({
  selector: 'app-hubs',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, Modal, HubTable],
  templateUrl: './hubs.html',
  styleUrl: './hubs.css',
})
export class Hubs implements OnInit {
  fb = inject(FormBuilder);
  hubsService = inject(HubsService);
  toastService = inject(HotToastService);

  hubs = signal<HubsResponseModel[]>([]);
  selectedHub = signal<HubsResponseModel | null>(null);
  isAddHub = signal<boolean>(false);
  isEditHub = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);

  hubForm = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    type: ['', [Validators.required]],
    value: ['', [Validators.required]],
    notes: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.listHubs();
  }

  submitCreateHubs() {
    this.isSubmitting.set(true);

    const loadingToast = this.toastService.loading('Processing...');

    this.hubsService.createHub(this.hubForm.value).subscribe({
      next: (res) => {
        loadingToast.close();
        this.toastService.success(`Created resource successfully!`, {
          duration: 2000,
        });
        this.listHubs();
        // this.toggleModal('add');
        this.isAddHub.set(false);
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.toastService.error(
          `Something went wrong creating resource! ${err.error.error}!!`,
          {
            duration: 2000,
          }
        );
        this.isSubmitting.set(false);
      },
    });
  }

  submitEditHub() {
    this.isSubmitting.set(true);

    const loadingToast = this.toastService.loading('Processing...');

    this.hubsService
      .updateHub(this.hubForm.value, this.selectedHub()!.id)
      .subscribe({
        next: (res) => {
          loadingToast.close();
          this.toastService.success(`Updated resource successfully!`, {
            duration: 2000,
          });
          this.listHubs();
          this.isEditHub.set(false);
          this.hubForm.reset();
          this.isSubmitting.set(false);
        },
        error: (err) => {
          this.toastService.error(
            `Something went wrong updating resource! ${err.error.error}!!`,
            {
              duration: 2000,
            }
          );
          this.isSubmitting.set(false);
        },
      });
  }

  listHubs() {
    const loadingToast = this.toastService.loading('Processing...');

    this.hubsService.listHubs().subscribe({
      next: (res: any) => {
        loadingToast.close();
        this.toastService.success(`Fetched resources successfully!`, {
          duration: 2000,
        });

        this.hubs.set(res);
      },
      error: (err) => {
        loadingToast.close();
        this.toastService.error(
          `Something went wrong Fetching resources! ${err.error.error}!!`,
          {
            duration: 2000,
          }
        );
      },
    });
  }

  deleteHub(resourceId: string) {
    const loadingToast = this.toastService.loading('Processing...');
    this.isSubmitting.set(true);

    this.hubsService.deleteHub(resourceId).subscribe({
      next: (res: any) => {
        loadingToast.close();
        this.toastService.success(`Deleted resources successfully!`, {
          duration: 2000,
        });

        this.listHubs();
        this.isSubmitting.set(false);
        this.toggleDeleteModal();
      },
      error: (err) => {
        loadingToast.close();
        this.toastService.error(
          `Something went wrong Deleting resources! ${err.error.error}!!`,
          {
            duration: 2000,
          }
        );
        this.isSubmitting.set(false);
      },
    });
  }

  editHub(hub: HubsResponseModel) {
    this.selectedHub.set(hub);
    this.hubForm.patchValue({
      title: hub.title,
      type: hub.type,
      value: hub.value,
      notes: hub.notes,
    });

    this.toggleModal('edit');
  }

  toggleModal(type: string) {
    type === 'edit'
      ? this.isEditHub.set(!this.isEditHub())
      : this.isAddHub.set(!this.isAddHub());
    if (!this.isEditHub()) {
      this.hubForm.reset();
    }
  }

  isDeleteModal = signal<boolean>(false);
  toggleDeleteModal() {
    this.isDeleteModal.set(!this.isDeleteModal());
  }

  setDeleteHub(hub: HubsResponseModel) {
    this.selectedHub.set(hub);
    this.toggleDeleteModal();
  }

  // exportresources() {
  //   const loadingToast = this.toastService.loading('Processing...');

  //   this.hubsService.exportresources().subscribe({
  //     next: (blob: Blob) => {
  //       const url = window.URL.createObjectURL(
  //         new Blob([blob], {
  //           type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //         })
  //       );
  //       const a = document.createElement('a');
  //       a.href = url;
  //       a.download = 'resources.xlsx'; // ✅ CSV file name
  //       document.body.appendChild(a);
  //       a.click();

  //       // Cleanup
  //       a.remove();
  //       window.URL.revokeObjectURL(url);

  //       this.toastService.success(`Downloaded resources successfully!`, {
  //         duration: 2000,
  //       });
  //       loadingToast.close();
  //     },
  //     error: (err) => {
  //       loadingToast.close();
  //       this.toastService.error(
  //         `Something went wrong downloading resources! ${
  //           err.error?.error || ''
  //         }`,
  //         { duration: 2000 }
  //       );
  //     },
  //   });
  // }

  // onFileSelected(event: Event) {
  //   const file = (event.target as HTMLInputElement).files?.[0];
  //   if (file) {
  //     this.importresources(file);
  //   }
  // }

  // importresources(file: File) {
  //   const formData = new FormData();
  //   formData.append('file', file);

  //   this.hubsService.importresources(formData).subscribe({
  //     next: (res) => {
  //       this.listHubs();
  //     },
  //     error: (err) => {
  //       console.error('Import failed:', err);
  //     },
  //   });
  // }
}
