import {
  Component,
  computed,
  EventEmitter,
  inject,
  input,
  Output,
  signal,
} from '@angular/core';
import { HubsResponseModel } from '../../models/hubs-model';
import { SearchService } from '../../../shared/services/search-service';

@Component({
  selector: 'app-hub-table',
  imports: [],
  templateUrl: './hub-table.html',
  styleUrl: './hub-table.css',
})
export class HubTable {
  hubData = input<HubsResponseModel[]>([]);
  @Output() deleteResource = new EventEmitter<any>();
  @Output() editResource = new EventEmitter<any>();

  searchService = inject(SearchService);

  private searchQuery = signal('');

  filteredResource = computed(() => {
    const data = this.hubData() || [];
    const q = this.searchQuery().trim().toLowerCase();

    if (!q) return data;

    return data.filter((c) =>
      [c.title, c.type, c.value, c.notes].some((field) =>
        field?.toLowerCase().includes(q)
      )
    );
  });

  constructor() {
    // sync search service query → local signal
    this.searchService.searchQuery$.subscribe((query) =>
      this.searchQuery.set(query)
    );
  }

  onDelete(resource: any) {
    this.deleteResource.emit(resource);
  }
  onEdit(resource: any) {
    this.editResource.emit(resource);
  }
}
