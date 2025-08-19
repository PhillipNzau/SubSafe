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

  router = inject(Router);

  onToggle() {
    const width = window.innerWidth;

    // Disable toggle on md+ screens (>= 768px)
    if (width >= 768) {
      return;
    }

    this.isOpen = !this.isOpen;
    this.toggleNav.emit(this.isOpen);
  }

  isRouteActive(routePath: string): boolean {
    return this.router.url.includes(routePath);
  }
}
