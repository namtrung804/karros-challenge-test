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
import {Collection} from "../models/collection";

@Injectable()
export class CollectionService {
  constructor(private http: HttpClient,

              private productService: ProductService,
              private authentication: AuthenticationService) {
  }

  create(data: any): Observable<any> {
    return this.http.post<JSONObject>('/collections.json', JSON.stringify({collection: data})).map((response) => {
      return response;
    });
  }

  update(data: any, id: number): Observable<any> {
    return this.http.put<JSONObject>('/collections/' + id + '.json', JSON.stringify(data))
      .map((response) => {
        return response;
      });
  }

  delete(id: number): Observable<any> {
    return this.http.delete<JSONObject>('/collections/' + id + '.json')
      .map((response) => {
        return response;
      });
  }

  getAllCollections(page: number, param: any = []): Observable<any> {
    let string = this.productService.queryStringParams(param);
    return this.http.get<JSONObject>('/collections.json?page=' + page + '&order=created_at_desc' + string)
      .map((response) => {
        if (response.code == 200) {
          return response;
        }
        console.log(response);
      });
  }

  getAllCustomCollections(param: any = []): Observable<Collection[]> {
    let string = this.productService.queryStringParams(param);
    return this.http.get<JSONObject>('/custom_collections.json' + string)
      .map((response) => {
        if (response.code == 200) {
          return response.collections;
        }
        console.log(response);
      });
  }

  getCollectionByID(id: number): Observable<any> {
    return this.http.get<JSONObject>('/collections/' + id + '.json')
      .map((response) => {
        return response;
      });
  }

  collectionProductsSort(id: number, data: any): Observable<any> {
    return this.http.put<JSONObject>('/collections/' + id + '.json', JSON.stringify({collection: data}))
      .map((response) => {
        if (response.code == 200) {
          return response;
        }
        console.log(response);
      });
  }

  uploadImage(data: any, ID: number): Observable<any> {
    return this.http.post<JSONObject>('/collections/' + ID + '/images.json', data)
      .map((response) => {
        return response;
      });
  }

  deleteImage(imageID: number, ID: number): Observable<any> {
    return this.http.delete<JSONObject>(`/collections/${ID}/images/` + imageID + '.json')
      .map((response) => {
        return response;
      });
  }

  bulkAction(data: any): Observable<any> {
    return this.http.put<JSONObject>('/collections/set.json', JSON.stringify(data))
      .map((response) => {
        return response;
      });
  }

  addProductToCollection(data: any): Observable<any> {
    return this.http.post<JSONObject>('/collects.json', JSON.stringify({collect: data}))
      .map((response) => {
        return response;
      });
  }

  removeProductToCollection(ids: string): Observable<any> {
    // ids = 222-224
    return this.http.delete<JSONObject>(`/collects/${ids}.json`)
      .map((response) => {
        return response;
      });
  }
}
