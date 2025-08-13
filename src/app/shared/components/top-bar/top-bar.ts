import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-bar',
  imports: [],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.css',
})
export class TopBar {
  router = inject(Router);
  handleLogout() {
    localStorage.clear();
    this.router.navigate(['/auth']).then(() => {});
  }
}
