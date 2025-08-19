import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  @Output() toggleNav = new EventEmitter<any>();
  @Input({ required: true }) isOpen: any;

  onToggle() {
    this.isOpen = !this.isOpen;
    this.toggleNav.emit(this.isOpen);
  }
  router = inject(Router);
  isRouteActive(routePath: string): boolean {
    return this.router.url.includes(routePath);
  }
}
