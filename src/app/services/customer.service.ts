import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs';
import * as moment from 'moment';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../config/app.config';
import {AuthenticationService} from './authentication.service';

import {JSONObject} from '../models/JSONObject';
import {Customer} from '../models/customer';

@Injectable()
export class CustomerService {
  constructor(private http: HttpClient,
              private config: AppConfig,
              private authentication: AuthenticationService) {
  }

  create(customer: Customer): Observable<any> {
    return this.http.post<JSONObject>(this.config.apiUrl + '/customers.json', JSON.stringify(customer)).map((response) => {
      return response;
    });
  }

  update(customer: Customer, id: number): Observable<any> {
    return this.http.put<JSONObject>(this.config.apiUrl + '/customers/' + id + '.json', JSON.stringify(customer))
      .map((response) => {
        return response;
      });
  }

  addAddress(customer: Customer, id: number): Observable<any> {
    return this.http.post<JSONObject>(this.config.apiUrl + '/customers/' + id
      + '/addresses.json', JSON.stringify(customer)).map((response) => {
      return response;
    });
  }

  updateAddress(customer: Customer, id: number, idAddress: number): Observable<any> {
    return this.http.put<JSONObject>(this.config.apiUrl + '/customers/' + id
      + '/addresses/' + idAddress + '.json', JSON.stringify(customer))
      .map((response) => {
        return response;
      });
  }

  setDefaulAddress(idCustomer: number, idAddress: number): Observable<any> {
    return this.http.post<JSONObject>(this.config.apiUrl + '/customers/' + idCustomer +
      '/reorder.json', JSON.stringify({address_id: idAddress})).map((response) => {
      return response;
    });
  }

  deleteAddressById(customerId: number, addressId: number): Observable<any> {
    return this.http.delete<JSONObject>(this.config.apiUrl + '/customers/' + customerId + '/addresses/' + addressId +'.json')
      .map((respone) => {
        return respone;
      })
  }

  getAllCustomers(page: number, param: any = []): Observable<any> {
    let string = this.queryStringParams(param);
    return this.http.get<JSONObject>(this.config.apiUrl + '/customers.json?page=' + page + '&order=created_at_desc' + string)
      .map((response) => {
        return response;
      });
  }

  getAllTag(param: any = []): Observable<any> {
    let string = this.queryStringParams(param);
    return this.http.get<JSONObject>(this.config.apiUrl + '/tags/customers.json?' + string)
      .map((response) => {
        if (response.code == 200) {
          return response.tags;
        }
        console.log(response);
      });
  }

  getById(id: number): Observable<any> {
    return this.http.get<JSONObject>(this.config.apiUrl + '/customers/' + id + '.json')
      .map((respone) => {
        return respone;
      })
  }

  deleteById(id: number): Observable<any> {
    return this.http.delete<JSONObject>(this.config.apiUrl + '/customers/' + id + '.json')
      .map((respone) => {
        return respone;
      })
  }

  queryStringParams(param: any = []) {
    let string = '&';
    for (let key in param) {
      if (param.hasOwnProperty(key)) {
        string += param[key].param + '=' + param[key].value + '&';
      }
    }
    return string.substring(0, string.length - 1);
  }

  bulkPages(model: any) {
    return this.http.post<JSONObject>(this.config.apiUrl + '/customers/set.json', JSON.stringify(model))
      .map((respone) => {
        return respone;
      })
  }
}
