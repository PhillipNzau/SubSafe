import { Component } from '@angular/core';
import { CredentialTable } from './components/credential-table/credential-table';

@Component({
  selector: 'app-credentials',
  imports: [CredentialTable],
  templateUrl: './credentials.html',
  styleUrl: './credentials.css',
})
export class Credentials {}
