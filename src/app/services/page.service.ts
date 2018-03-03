import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs';
/*import moment = require('moment');*/
import {HttpClient} from '@angular/common/http';
import {AuthenticationService} from './authentication.service';

import {JSONObject} from '../models/JSONObject';

import {Page} from '../models/page';
import {ProductService} from "./product.service";

@Injectable()
export class PageService {
  constructor(private http: HttpClient,
              
              private productService: ProductService,
              private authentication: AuthenticationService) {
  }

  getAllPages(param: any = []): Observable<any> {
    let string = this.productService.queryStringParams(param);
    return this.http.get<JSONObject>(`/pages.json?order=created_at_desc${string}`)
      .map((response) => {
        return response;
      });
  }

  getById(id: number): Observable<any> {
    return this.http.get<JSONObject>('/pages/' + id + '.json')
      .map((respone) => {
        return respone;
      })
  }

  create(page: Page): Observable<any> {
    return this.http.post<JSONObject>('/pages.json', JSON.stringify(page))
      .map((response) => {
        return response;
      });
  }

  update(page: Page, pageId: number): Observable<any> {
    return this.http.put<JSONObject>('/pages/' + pageId + '.json', JSON.stringify({page}))
      .map((response) => {
        return response;
      });
  }

  deleteById(id: number): Observable<any> {
    return this.http.delete<JSONObject>('/pages/' + id + '.json')
      .map((respone) => {
        return respone;
      })
  }

  bulkPages(model: any) {
    return this.http.post<JSONObject>('/pages/set.json', JSON.stringify(model))
      .map((respone) => {
        return respone;
      })
  }

  searchPages(textSearch: string) {
    const queryString = '?q[title_cont]=' + textSearch;
    return this.http.get<JSONObject>('/pages.json' + queryString)
      .map((respone) => {
        return respone;
      })
  }
}
