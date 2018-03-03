import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {Observable} from "rxjs";
import * as moment from 'moment';
import {HttpClient} from "@angular/common/http";

import {AuthenticationService} from "./authentication.service";
import {JSONObject} from "../models/JSONObject";
import {User} from "../models/user";
import {Product} from "../models/product";
import {ProductService} from "./product.service";

@Injectable()
export class OrderService {
  constructor(private http: HttpClient,
              private productService: ProductService,
              private authentication: AuthenticationService) {
  }

  create(data: any): Observable<any> {
    return this.http.post<JSONObject>('/products.json', JSON.stringify({product: data})).map((response) => {
      return response;
    });
  }

  update(data: any, id: number): Observable<any> {
    return this.http.put<JSONObject>('/orders/' + id + '.json', JSON.stringify({order: data}))
      .map((response) => {
        return response;
      });
  }

  getAllOrders(page: number, param: any): Observable<any> {
    let string = this.productService.queryStringParams(param);
    return this.http.get<JSONObject>('/orders.json?page=' + page + '&order=created_at_desc' + string)
      .map((response) => {
        if (response.code == 200) {
          return response;
        }
        console.log(response);
      });
  }

  getOrderByID(id: number): Observable<Product> {
    return this.http.get<JSONObject>('/orders/' + id + '.json')
      .map((response) => {
        if (response.code == 200) {
          return response.order;
        }
        console.log(response);
      });
  }

  getAllTag(param: any = []): Observable<any> {
    let string = this.productService.queryStringParams(param);
    return this.http.get<JSONObject>('/tags/orders.json?' + string)
      .map((response) => {
        if (response.code == 200) {
          return response.tags;
        }
        console.log(response);
      });
  }

  archiveOrder(status: string = 'open', id: number): Observable<any> {
    return this.http.post<JSONObject>(`/orders/${id}/${status}.json`, JSON.stringify({}))
      .map((response) => {
        return response;
      });
  }

  bulkAction(data: any): Observable<any> {
    return this.http.put<JSONObject>('/orders/set.json', JSON.stringify(data))
      .map((response) => {
        return response;
      });
  }

  cancelOrder(data: any, id: number): Observable<any> {
    return this.http.post<JSONObject>(`/orders/${id}/cancel.json`, JSON.stringify(data))
      .map((response) => {
        return response;
      });
  }

  createFulfillment(data: any, id: number): Observable<any> {
    return this.http.post<JSONObject>(`/orders/${id}/fulfillments.json`, JSON.stringify({fulfillment: data}))
      .map((response) => {
        return response;
      });
  }

  updateFulfillment(data: any, id: number, fulfillmentID: number): Observable<any> {
    return this.http.put<JSONObject>(`/orders/${id}/fulfillments/${fulfillmentID}.json`, JSON.stringify({fulfillment: data}))
      .map((response) => {
        return response;
      });
  }

  cancelFulfillment(id: number, fulfillmentID: number): Observable<any> {
    return this.http.post<JSONObject>(`/orders/${id}/fulfillments/${fulfillmentID}/cancel.json`, JSON.stringify({}))
      .map((response) => {
        return response;
      });
  }
}
