import { Component, inject, OnInit, signal } from '@angular/core';
import { SubscriptionTable } from './components/subscription-table/subscription-table';
import { SubscriptionsService } from './services/subscriptions-service';
import { SubscriptionsResponseModel } from './models/subscriptions-model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Modal } from '../../shared/components/modal/modal';

@Component({
  selector: 'app-subscriptions',
  imports: [
    SubscriptionTable,
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    Modal,
  ],
  templateUrl: './subscriptions.html',
  styleUrl: './subscriptions.css',
})
export class Subscriptions implements OnInit {
  fb = inject(FormBuilder);
  subscriptionsService = inject(SubscriptionsService);
  toastService = inject(HotToastService);

  subscriptions = signal<SubscriptionsResponseModel[]>([]);
  selectedSubscriptions = signal<SubscriptionsResponseModel | null>(null);
  isAddSubscription = signal<boolean>(false);
  isEditSubscription = signal<boolean>(false);
  passwordFieldType = signal<'password' | 'text'>('password');

  subscriptionForm = this.fb.nonNullable.group({
    service_name: ['', [Validators.required]],
    plan_name: ['', [Validators.required]],
    start_date: ['', [Validators.required]],
    renewal_date: ['', [Validators.required]],
    price: ['', [Validators.required]],
    currency: ['', [Validators.required]],
    status: ['', [Validators.required]],
    notes: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.listSubscriptions();
  }

  submitCreateSubscriptions() {
    const loadingToast = this.toastService.loading('Processing...');
    this.subscriptionsService
      .createSubscription(this.subscriptionForm.value)
      .subscribe({
        next: (res) => {
          loadingToast.close();
          this.toastService.success(`Created subscription successfully!`, {
            duration: 2000,
          });
          this.listSubscriptions();
          this.toggleModal('add');
        },
        error: (err) => {
          this.toastService.error(
            `Something went wrong creating subscription! ${err.error.message}!!`,
            {
              duration: 2000,
            }
          );
        },
      });
  }

  submitEditSubscription() {
    const loadingToast = this.toastService.loading('Processing...');
    this.subscriptionsService
      .updateSubscription(
        this.subscriptionForm.value,
        this.selectedSubscriptions()!.id
      )
      .subscribe({
        next: (res) => {
          loadingToast.close();
          this.toastService.success(`Updated subscription successfully!`, {
            duration: 2000,
          });
          this.listSubscriptions();
          this.toggleModal('edit');
        },
        error: (err) => {
          this.toastService.error(
            `Something went wrong updating subscription! ${err.error.message}!!`,
            {
              duration: 2000,
            }
          );
        },
      });
  }

  listSubscriptions() {
    const loadingToast = this.toastService.loading('Processing...');

    this.subscriptionsService.listSubscriptions().subscribe({
      next: (res: any) => {
        loadingToast.close();
        this.toastService.success(`Fetched subscriptions successfully!`, {
          duration: 2000,
        });

        this.subscriptions.set(res);
      },
      error: (err) => {
        loadingToast.close();
        this.toastService.error(
          `Something went wrong Fetching subscriptions! ${err.error.message}!!`,
          {
            duration: 2000,
          }
        );
      },
    });
  }

  deleteSubscription(subscriptionId: string) {
    const loadingToast = this.toastService.loading('Processing...');

    this.subscriptionsService.deleteSubscription(subscriptionId).subscribe({
      next: (res: any) => {
        loadingToast.close();
        this.toastService.success(`Deleted subscriptions successfully!`, {
          duration: 2000,
        });

        this.listSubscriptions();
      },
      error: (err) => {
        loadingToast.close();
        this.toastService.error(
          `Something went wrong Deleting subscriptions! ${err.error.message}!!`,
          {
            duration: 2000,
          }
        );
      },
    });
  }

  editSubscription(subscription: SubscriptionsResponseModel) {
    this.selectedSubscriptions.set(subscription);
    this.subscriptionForm.patchValue({
      service_name: subscription.service_name,
      plan_name: subscription.plan_name,
      start_date: subscription.start_date,
      renewal_date: subscription.renewal_date,
      price: subscription.price,
      currency: subscription.currency,
      status: subscription.status,
      notes: subscription.notes,
    });

    this.toggleModal('edit');
  }

  toggleModal(type: string) {
    type === 'edit'
      ? this.isEditSubscription.set(!this.isEditSubscription())
      : this.isAddSubscription.set(!this.isAddSubscription());
    if (!this.isEditSubscription()) {
      this.subscriptionForm.reset();
    }
  }

  togglePasswordVisibility() {
    const current = this.passwordFieldType();
    this.passwordFieldType.set(current === 'password' ? 'text' : 'password');
  }
}
