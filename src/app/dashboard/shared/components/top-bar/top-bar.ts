import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '../../services/search-service';

@Component({
  selector: 'app-top-bar',
  imports: [],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.css',
})
export class TopBar {
  @Output() toggleNav = new EventEmitter<any>();
  @Input({ required: true }) isOpen: any;

  searchService = inject(SearchService);

  onToggle() {
    this.isOpen = !this.isOpen;
    this.toggleNav.emit(this.isOpen);
  }
  router = inject(Router);

  usr = JSON.parse(localStorage.getItem('subSfUsr') || '');
  userDetails = signal<any>(this.usr);
  handleLogout() {
    localStorage.clear();
    this.router.navigate(['/auth']).then(() => {});
  }

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.searchService.setSearch(query);
  }
}
