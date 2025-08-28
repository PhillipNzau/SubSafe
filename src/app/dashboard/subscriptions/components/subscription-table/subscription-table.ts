import {
  Component,
  computed,
  EventEmitter,
  inject,
  input,
  Output,
  signal,
} from '@angular/core';
import { SubscriptionsResponseModel } from '../../models/subscriptions-model';
import { SearchService } from '../../../shared/services/search-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subscription-table',
  imports: [CommonModule],
  templateUrl: './subscription-table.html',
  styleUrl: './subscription-table.css',
})
export class SubscriptionTable {
  subscriptionsData = input<SubscriptionsResponseModel[]>([]);
  @Output() deleteSubscription = new EventEmitter<any>();
  @Output() editSubscription = new EventEmitter<any>();

  searchService = inject(SearchService);

  private searchQuery = signal('');

  filteredSubscriptions = computed(() => {
    const data = this.subscriptionsData() || [];
    const q = this.searchQuery().trim().toLowerCase();

    if (!q) return data;

    return data.filter((c) =>
      [c.service_name, c.plan_name, c.status, c.notes, c.currency].some(
        (field) => field?.toLowerCase().includes(q)
      )
    );
  });

  constructor() {
    // sync search service query → local signal
    this.searchService.searchQuery$.subscribe((query) =>
      this.searchQuery.set(query)
    );
  }

  onDelete(credential: any) {
    this.deleteSubscription.emit(credential);
  }
  onEdit(credential: any) {
    this.editSubscription.emit(credential);
  }
}
