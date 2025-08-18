import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SubscriptionsResponseModel } from '../../models/subscriptions-model';

@Component({
  selector: 'app-subscription-table',
  imports: [],
  templateUrl: './subscription-table.html',
  styleUrl: './subscription-table.css',
})
export class SubscriptionTable {
  @Input({ required: true }) subscriptionsData: SubscriptionsResponseModel[] =
    [];
  @Output() deleteSubscription = new EventEmitter<any>();
  @Output() editSubscription = new EventEmitter<any>();

  onDelete(credential: any) {
    this.deleteSubscription.emit(credential);
  }
  onEdit(credential: any) {
    this.editSubscription.emit(credential);
  }
}
