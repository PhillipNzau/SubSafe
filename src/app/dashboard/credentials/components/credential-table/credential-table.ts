import { Component, Input } from '@angular/core';
import { CredentialsResponseModel } from '../../models/credentials';

@Component({
  selector: 'app-credential-table',
  imports: [],
  templateUrl: './credential-table.html',
  styleUrl: './credential-table.css',
})
export class CredentialTable {
  @Input({ required: true }) credentialsData: CredentialsResponseModel[] = [];
}
