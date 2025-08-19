import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-bar',
  imports: [],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.css',
})
export class TopBar {
  @Output() toggleNav = new EventEmitter<any>();
  @Input({ required: true }) isOpen: any;

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
}
