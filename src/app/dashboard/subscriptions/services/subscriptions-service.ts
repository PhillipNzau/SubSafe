import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { map } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  CreateSubscriptionsModel,
  SubscriptionsResponseModel,
} from '../models/subscriptions-model';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionsService {
  listSubscriptionsUrl = environment.listSubscriptions;
  listSingleSubscriptionUrl = environment.listSingleSubscription;
  deleteSubscriptionUrl = environment.deleteSubscription;
  createSubscriptionUrl = environment.createSubscription;
  updateSubscriptionUrl = environment.updateSubscription;
  importSubscriptionsUrl = environment.importSubscriptions;
  exportSubscriptionsUrl = environment.exportSubscriptions;

  router = inject(Router);
  http = inject(HttpClient);

  listSubscriptions() {
    return this.http.get(this.listSubscriptionsUrl).pipe(
      map((res) => {
        return res;
      })
    );
  }

  getSingleSubscription(subscriptionId: string) {
    return this.http.get(this.listSingleSubscriptionUrl + subscriptionId).pipe(
      map((res) => {
        return res;
      })
    );
  }

  deleteSubscription(subscriptionId: string) {
    return this.http.delete(this.deleteSubscriptionUrl + subscriptionId).pipe(
      map((res) => {
        return res;
      })
    );
  }

  createSubscription(subscriptionData: any) {
    return this.http
      .post<SubscriptionsResponseModel>(
        this.createSubscriptionUrl,
        subscriptionData
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  updateSubscription(subscriptionData: any, subscriptionId: string) {
    return this.http
      .put<SubscriptionsResponseModel>(
        this.updateSubscriptionUrl + subscriptionId,
        subscriptionData
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  exportSubscriptions() {
    return this.http.get(this.exportSubscriptionsUrl, {
      responseType: 'blob', // important for files
    });
  }

  importSubscriptions(file: any) {
    return this.http.post(this.importSubscriptionsUrl, file).pipe(
      map((res) => {
        return res;
      })
    );
  }
}
