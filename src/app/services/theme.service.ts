import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs';

import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../config/app.config';
import {AuthenticationService} from './authentication.service';

import {JSONObject} from '../models/JSONObject';

import {Page} from '../models/page';

@Injectable()
export class ThemeService {
    constructor(private http: HttpClient,
                private config: AppConfig,
                private authentication: AuthenticationService) {
    }

    getAllThemes(): Observable<any> {
        return this.http.get<JSONObject>(this.config.apiUrl + '/themes.json')
            .map((response) => {
                return response;
            });
    }

    getById(id: number): Observable<any> {
        return this.http.get<JSONObject>(this.config.apiUrl + '/pages/' + id + '.json')
            .map((respone) => {
                return respone;
            })
    }

    create(page: Page): Observable<any> {
        return this.http.post<JSONObject>(this.config.apiUrl + '/pages.json', JSON.stringify(page))
            .map((response) => {
                return response;
            });
    }

    update(page: Page, pageId: number): Observable<any> {
        return this.http.put<JSONObject>(this.config.apiUrl + '/pages/' + pageId + '.json', JSON.stringify({page}))
            .map((response) => {
                return response;
            });
    }

    deleteById(id: number): Observable<any> {
        return this.http.delete<JSONObject>(this.config.apiUrl + '/pages/' + id + '.json')
            .map((respone) => {
                return respone;
            })
    }

    bulkPages(model: any) {
        return this.http.post<JSONObject>(this.config.apiUrl + '/pages/set.json', JSON.stringify(model))
            .map((respone) => {
                return respone;
            })
    }
}