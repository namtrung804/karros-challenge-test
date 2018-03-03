import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs';
import * as moment from 'moment';
import {HttpClient} from '@angular/common/http';
import {AuthenticationService} from './authentication.service';

import {JSONObject} from '../models/JSONObject';
import {Menu} from '../models/menu';

@Injectable()
export class MenuService {
    constructor(private http: HttpClient,
                
                private authentication: AuthenticationService) {
    }

    create(menu: Menu): Observable<any> {
        return this.http.post<JSONObject>('/link_lists.json', JSON.stringify(menu)).map((response) => {
            return response;
        });
    }

    update(menu: Menu, id: number): Observable<any> {
        return this.http.put<JSONObject>('/link_lists/' + id + '.json', JSON.stringify(menu)).map((response) => {
            return response;
        });
    }

    getAllMenu(): Observable<any> {
        return this.http.get<JSONObject>('/link_lists.json')
            .map((response) => {
                return response;
            });
    }

    getById(id: number): Observable<any> {
        return this.http.get<JSONObject>('/link_lists/' + id + '.json')
            .map((respone) => {
                return respone;
            })
    }

    deleteById(id: number): Observable<any> {
        return this.http.delete<JSONObject>('/link_lists/' + id + '.json')
            .map((respone) => {
                return respone;
            })
    }

    reorderMenu(idMenu: number, menuItem: any): Observable<any> {
        return this.http.post<JSONObject>('/link_lists/' + idMenu + '/reorder.json',
            JSON.stringify(menuItem)).map((response) => {
            return response;
        });
    }
}
