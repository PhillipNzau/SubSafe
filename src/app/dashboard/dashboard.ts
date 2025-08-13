import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../shared/components/navbar/navbar';
import { TopBar } from '../shared/components/top-bar/top-bar';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, Navbar, TopBar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {}
