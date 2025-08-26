import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

import { HubsResponseModel } from '../models/hubs-model';

@Injectable({
  providedIn: 'root',
})
export class HubsService {
  listHubsUrl = environment.listHubs;
  listSingleHubUrl = environment.listSingleHub;
  deleteHubUrl = environment.deleteHub;
  createHubUrl = environment.createHub;
  updateHubUrl = environment.updateHub;

  router = inject(Router);
  http = inject(HttpClient);

  listHubs() {
    return this.http.get(this.listHubsUrl).pipe(
      map((res) => {
        return res;
      })
    );
  }

  getSingleHub(hubId: string) {
    return this.http.get(this.listSingleHubUrl + hubId).pipe(
      map((res) => {
        return res;
      })
    );
  }

  deleteHub(hubId: string) {
    return this.http.delete(this.deleteHubUrl + hubId).pipe(
      map((res) => {
        return res;
      })
    );
  }

  createHub(hubData: any) {
    return this.http.post<HubsResponseModel>(this.createHubUrl, hubData).pipe(
      map((res) => {
        return res;
      })
    );
  }

  updateHub(hubData: any, hubId: string) {
    return this.http
      .put<HubsResponseModel>(this.updateHubUrl + hubId, hubData)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  // exportSubscriptions() {
  //   return this.http.get(this.exportHubsUrl, {
  //     responseType: 'blob', // important for files
  //   });
  // }

  // importSubscriptions(file: any) {
  //   return this.http.post(this.importHubsUrl, file).pipe(
  //     map((res) => {
  //       return res;
  //     })
  //   );
  // }
}
