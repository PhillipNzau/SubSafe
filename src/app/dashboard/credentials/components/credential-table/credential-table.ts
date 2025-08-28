import {
  Component,
  computed,
  EventEmitter,
  inject,
  input,
  Output,
  signal,
} from '@angular/core';
import { CredentialsResponseModel } from '../../models/credentials';
import { SearchService } from '../../../shared/services/search-service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-credential-table',
  imports: [DatePipe],
  templateUrl: './credential-table.html',
  styleUrl: './credential-table.css',
})
export class CredentialTable {
  credentialsData = input<CredentialsResponseModel[]>([]);
  @Output() deleteCredential = new EventEmitter<any>();
  @Output() editCredential = new EventEmitter<any>();

  searchService = inject(SearchService);

  private searchQuery = signal('');

  filteredCredentials = computed(() => {
    const data = this.credentialsData() || [];
    const q = this.searchQuery().trim().toLowerCase();

    if (!q) return data;

    return data.filter((c) =>
      [c.site_name, c.username, c.category, c.login_url, c.notes].some(
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
    this.deleteCredential.emit(credential);
  }
  onEdit(credential: any) {
    this.editCredential.emit(credential);
  }

  showPopup = signal<boolean>(false);

  copyPassword(password: string) {
    navigator.clipboard.writeText(password).then(() => {
      this.showPopup.set(true);
      setTimeout(() => this.showPopup.set(false), 1500);
    });
  }
}
