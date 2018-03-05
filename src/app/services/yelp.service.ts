import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs';
import * as moment from 'moment';
import {HttpClient} from '@angular/common/http';

import {JSONObject} from '../models/JSONObject';
import {API_URL} from '../config/global-const';

@Injectable()
export class YelpService {
    constructor(private http: HttpClient) {
    }

    autocomplete(text: string): Observable<any> {
        return this.http.get<JSONObject>(`${API_URL}/autocomplete?text=${text}`)
            .map((response) => response);
    }

    getDataBusinessSearch(queryObject: any): Observable<any> {
        let stringQuery = this.queryStringParams(queryObject);
        return this.http.get<JSONObject>(`${API_URL}/businesses/search?${stringQuery}`)
            .map((response) => response);
    }

    queryStringParams(param: any = []) {
        let string = '&';
        for (let key in param) {
            if (param.hasOwnProperty(key)) {
                string += key + '=' + encodeURI(param[key]) + '&';
            }
        }
        return string.substring(0, string.length - 1);
    }
}
