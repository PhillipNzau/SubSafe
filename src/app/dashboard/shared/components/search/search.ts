import { Component, inject } from '@angular/core';
import { SearchService } from '../../services/search-service';

@Component({
  selector: 'app-search',
  imports: [],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  searchService = inject(SearchService);

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.searchService.setSearch(query);
  }
}
