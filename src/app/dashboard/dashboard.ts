import { Component, HostListener, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../shared/components/navbar/navbar';
import { TopBar } from '../shared/components/top-bar/top-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterOutlet, Navbar, TopBar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  status = signal<boolean>(false);

  // Run once when component loads
  ngOnInit() {
    this.updateStatus(window.innerWidth);
  }

  // Listen to window resize
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const width = (event.target as Window).innerWidth;
    this.updateStatus(width);
  }

  private updateStatus(width: number) {
    if (width >= 768) {
      // Tailwind `md` = 768px
      this.status.set(true);
    } else {
      this.status.set(false);
    }
  }

  toggleNav(status: any) {
    this.status.set(status);
  }
}
