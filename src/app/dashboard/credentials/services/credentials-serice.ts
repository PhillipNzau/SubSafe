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
  private loggedIn = false;

  listCredentialsUrl = environment.listCredentials;
  listSingleCredentialUrl = environment.listSingleCredential;
  deleteCredentialUrl = environment.deleteCredential;
  createCredentialUrl = environment.createCredential;
  updateCredentialUrl = environment.updateCredential;

  router = inject(Router);
  http = inject(HttpClient);

  listCredentials() {
    return this.http.get(this.listCredentialsUrl).pipe(
      map((res) => {
        console.log('====================================');
        console.log(res);
        console.log('====================================');
      })
    );
  }

  getSingleCredential(credentialId: string) {
    return this.http.get(this.listSingleCredentialUrl + credentialId).pipe(
      map((res) => {
        console.log('====================================');
        console.log(res);
        console.log('====================================');
      })
    );
  }

  deleteCredential(credentialId: string) {
    return this.http.delete(this.deleteCredentialUrl + credentialId).pipe(
      map((res) => {
        console.log('====================================');
        console.log(res);
        console.log('====================================');
      })
    );
  }

  createCredential(credentialData: CreateCredentialsModel) {
    return this.http
      .post<CredentialsResponseModel>(this.createCredentialUrl, credentialData)
      .pipe(
        map((res) => {
          console.log('====================================');
          console.log(res);
          console.log('====================================');
        })
      );
  }

  updateCredential(
    credentialData: CreateCredentialsModel,
    credentialId: string
  ) {
    return this.http
      .post<CredentialsResponseModel>(
        this.updateCredentialUrl + credentialId,
        credentialData
      )
      .pipe(
        map((res) => {
          console.log('====================================');
          console.log(res);
          console.log('====================================');
        })
      );
  }
}
