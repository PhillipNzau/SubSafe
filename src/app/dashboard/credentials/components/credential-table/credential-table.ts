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
  @Output() deleteCredential = new EventEmitter<string>();
  @Output() editCredential = new EventEmitter<any>();

  onDelete(id: string) {
    this.deleteCredential.emit(id);
  }
  onEdit(credential: any) {
    this.editCredential.emit(credential);
  }
}
