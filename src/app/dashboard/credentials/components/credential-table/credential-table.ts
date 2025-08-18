import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CredentialsResponseModel } from '../../models/credentials';

@Component({
  selector: 'app-credential-table',
  imports: [],
  templateUrl: './credential-table.html',
  styleUrl: './credential-table.css',
})
export class CredentialTable {
  @Input({ required: true }) credentialsData: CredentialsResponseModel[] = [];
  @Output() deleteCredential = new EventEmitter<any>();
  @Output() editCredential = new EventEmitter<any>();

  onDelete(credential: any) {
    this.deleteCredential.emit(credential);
  }
  onEdit(credential: any) {
    this.editCredential.emit(credential);
  }
}
