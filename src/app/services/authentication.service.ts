﻿import {Injectable} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import {Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AppConfig} from "../config/app.config";
import {JSONObject} from "../models/JSONObject";
import {Token} from "../models/token";
import {Msisdn} from "../models/msisdn";
import {Account} from "../models/account";

@Injectable()
export class AuthenticationService {
  tokenObservable: Observable<string>;
  currentUserObservable: Observable<string> = null;

  constructor(private http: HttpClient,
              private config: AppConfig,
              private router: Router) {
  }

  login(params: any): Observable<any> {
    return this.http.post<JSONObject>(this.config.apiUrl + '/user_session.json', JSON.stringify(params))
      .map((response) => {
        if (response.code == 200) {
          this.setSessionAccessToken(response.token);
          this.setSessionUserLogin(response.user);
        }
        return response;
      });

  }

  checkPassword(params: any): Observable<any> {
    return this.http.post<JSONObject>(this.config.apiUrl + '/user_session.json', JSON.stringify(params))
      .map((response) => {
        return response;
      });

  }

  resetPassword(params: any): Observable<any> {
    return this.http.post<JSONObject>(this.config.apiUrl + '/password_resets.json', JSON.stringify(params))
      .map((response) => {
        return response;
      });

  }

  logout(): Observable<any> {
    return this.http.delete<JSONObject>(this.config.apiUrl + '/user_session.json')
      .map((response) => {
        this.deleteSession();
        return response.data;
      });
  }

  setSessionAccessToken(token: any) {
    let data = new Token();
    data.access_token = token;
    sessionStorage.setItem('accessToken', JSON.stringify(data));
  }

  setSessionUserLogin(user: Account) {
    user.full_name = `${user.first_name} ${user.last_name}`;
    sessionStorage.setItem('adminUser', JSON.stringify(user));
  }

  deleteSession() {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('adminUser');
  }
}