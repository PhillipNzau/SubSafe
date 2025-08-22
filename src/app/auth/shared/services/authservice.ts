import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import {
  LoginUserModel,
  LoginUserResponseModel,
  RegisterUserModel,
} from '../models/users';
@Injectable({
  providedIn: 'root',
})
export class Authservice {
  private loggedIn = false;

  loginUserUrl = environment.loginUser;
  registerUserUrl = environment.registerUser;
  refreshTokenUrl = environment.refreshToken;

  router = inject(Router);
  http = inject(HttpClient);

  // login user
  loginUser(userData: LoginUserModel) {
    return this.http
      .post<LoginUserResponseModel>(this.loginUserUrl, userData)
      .pipe(
        map((res) => {
          if (res.status === 200) {
            localStorage.setItem('subSfUsr', JSON.stringify(res.user));
            localStorage.setItem('subSfTk', JSON.stringify(res.access_token));
            localStorage.setItem('subSfRTk', JSON.stringify(res.refresh_token));
            localStorage.setItem('cnLgSubSf', 'true');
            this.loggedIn = !!localStorage.getItem('cnLgSubSf');

            return res;
          }

          return res;
        })
      );
  }

  // signup user
  registerUser(userData: RegisterUserModel) {
    return this.http
      .post<LoginUserResponseModel>(this.registerUserUrl, userData)
      .pipe(
        map((res) => {
          if (res.status === 200) {
            localStorage.setItem('subSfUsr', JSON.stringify(res.user));
            localStorage.setItem('subSfTk', JSON.stringify(res.access_token));
            localStorage.setItem('subSfRTk', JSON.stringify(res.refresh_token));
            localStorage.setItem('cnLgSubSf', 'true');
            this.loggedIn = !!localStorage.getItem('cnLgSubSf');

            return res;
          }
          return res;
        })
      );
  }

  refreshToken(refresh: string) {
    const body = {
      refresh_token: refresh,
    };
    return this.http.post<any>(this.refreshTokenUrl, body).pipe(
      map((res) => {
        if (res.status === 200) {
          localStorage.setItem('subSfTk', JSON.stringify(res.access_token));
          localStorage.setItem('subSfRTk', JSON.stringify(res.refresh_token));
          localStorage.setItem('cnLgSubSf', 'true');
          this.loggedIn = !!localStorage.getItem('cnLgSubSf');

          return res;
        }
        return res;
      })
    );
  }

  // Returns true when user is loged in and email is verified
  get isLoggedIn() {
    this.loggedIn = !!localStorage.getItem('cnLgSubSf');

    if (!this.loggedIn) {
      return this.router.navigate(['/auth']).then(() => {});
    }
    return this.loggedIn;
  }
}
