import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {Observable} from "rxjs";
import * as moment from 'moment';
import {HttpClient} from "@angular/common/http";

import {AuthenticationService} from "./authentication.service";
import {JSONObject} from "../models/JSONObject";
import {User} from "../models/user";
import {ProductService} from "./product.service";

@Injectable()
export class AccountService {
  constructor(private http: HttpClient,

              private authentication: AuthenticationService,
              private productService: ProductService) {
  }

  getAllData(param: any = []): Observable<any> {
    let string = this.productService.queryStringParams(param);
    return this.http.get<JSONObject>('/admin_users.json?order=created_at_desc' + string)
      .map((response) => {
        if (response.code == 200) {
          return response;
        }
        console.log(response);
      });
  }

  getDataByID(id: number): Observable<any> {
    return this.http.get<JSONObject>(`/admin_users/${id}.json`)
      .map((response) => {
        return response;
      });
  }

  create(data: Account): Observable<any> {
    return this.http.post<JSONObject>('/admin_users.json', JSON.stringify({admin_user: data})).map((response) => {
      return response;
    });
  }

  update(data: Account, id: number): Observable<any> {
    return this.http.put<JSONObject>(`/admin_users/${id}.json`, JSON.stringify({admin_user: data}))
      .map((response) => {
        return response;
      });
  }

  delete(id: number): Observable<any> {
    return this.http.delete<JSONObject>(`/admin_users/${id}.json`)
      .map((response) => {
        return response;
      });
  }

  changePassword(data: any): Observable<any> {
    return this.http.put<JSONObject>('/admin_users/change_password.json', JSON.stringify({admin_user: data}))
      .map((response) => {
        return response;
      });
  }

  uploadImage(data: any, ID: number): Observable<any> {
    return this.http.post<JSONObject>('/admin_users/' + ID + '/images.json', data)
      .map((response) => {
        return response;
      });
  }

  deleteImage(imageID: number, ID: number): Observable<any> {
    return this.http.delete<JSONObject>(`/admin_users/${ID}/images/` + imageID + '.json')
      .map((response) => {
        return response;
      });
  }
}
