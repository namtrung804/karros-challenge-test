import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {Observable} from "rxjs";
import * as moment from 'moment';
import {HttpClient} from "@angular/common/http";

import {AuthenticationService} from "./authentication.service";
import {JSONObject} from "../models/JSONObject";
import {User} from "../models/user";

@Injectable()
export class UserService {
  constructor(private http: HttpClient,
              
              private authentication: AuthenticationService) {
  }

  getUserByPhoneNumber(phone: number): Observable<any> {
    return this.http.post<JSONObject>('/users/api/users/register', JSON.stringify({
      msisdn: phone
    })).map((response) => {
      return response;
    });
  }

  create(user: User): Observable<any> {
    return this.http.post<JSONObject>('/users/api/users/register', JSON.stringify(user)).map((response) => {
      return response;
    });
  }

  update(user: User): Observable<any> {
    return this.http.post<JSONObject>('/users/api/users/updateProfile', JSON.stringify(user))
      .map((response) => {
        return response;
      });
  }

  updateSecretQuestion(data: any): Observable<any> {
    return this.http.post<JSONObject>('/users/api/users/updateSecretQuestion', JSON.stringify(data))
      .map((response) => {
        return response;
      });
  }


  forgotPassword(user: User): Observable<any> {
    return this.http.post<JSONObject>('/users/api/users/resetPassword', JSON.stringify(user))
      .map((response) => {
        return response;
      });
  }

  changePassword(data: any): Observable<any> {
    return this.http.post<JSONObject>('/users/api/users/changePassword', JSON.stringify(data))
      .map((response) => {
        return response;
      });
  }

  getBlance(accountType: number): Observable<any> {
    const url = accountType == 0 ? '/profile/balance' : '/profile/usage';
    return this.http.get<JSONObject>(url)
      .map((response) => {
        return response;
      });
  }


  getPromo(token: string): Observable<any> {
    return this.http.get<JSONObject>('/profile/promo')
      .map((response) => {
        return response.data;
      });

  }




}
