import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment.development';
import { map } from 'rxjs';
import {
  CreateCredentialsModel,
  CredentialsResponseModel,
} from '../models/credentials';

@Injectable({
  providedIn: 'root',
})
export class CredentialsService {
  listCredentialsUrl = environment.listCredentials;
  listSingleCredentialUrl = environment.listSingleCredential;
  deleteCredentialUrl = environment.deleteCredential;
  createCredentialUrl = environment.createCredential;
  updateCredentialUrl = environment.updateCredential;
  exportCredentialsUrl = environment.exportCredentials;
  importCredentialsUrl = environment.importCredentials;

  router = inject(Router);
  http = inject(HttpClient);

  listCredentials() {
    return this.http.get(this.listCredentialsUrl).pipe(
      map((res) => {
        return res;
      })
    );
  }

  getSingleCredential(credentialId: string) {
    return this.http.get(this.listSingleCredentialUrl + credentialId).pipe(
      map((res) => {
        return res;
      })
    );
  }

  deleteCredential(credentialId: string) {
    return this.http.delete(this.deleteCredentialUrl + credentialId).pipe(
      map((res) => {
        return res;
      })
    );
  }

  createCredential(credentialData: CreateCredentialsModel) {
    return this.http
      .post<CredentialsResponseModel>(this.createCredentialUrl, credentialData)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  updateCredential(
    credentialData: CreateCredentialsModel,
    credentialId: string
  ) {
    return this.http
      .put<CredentialsResponseModel>(
        this.updateCredentialUrl + credentialId,
        credentialData
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  exportCredentials() {
    return this.http.get(this.exportCredentialsUrl, {
      responseType: 'blob', // important for files
    });
  }

  importCredentials(file: any) {
    return this.http.post(this.importCredentialsUrl, file).pipe(
      map((res) => {
        return res;
      })
    );
  }
}
