import {Component, ErrorHandler, Inject, Injectable} from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Http} from '@angular/http';
import {Router} from '@angular/router';
import * as Raven from 'raven-js';
import {AppConfig} from '../config/app.config';
import {AlertService} from '../services/alert.service';
import {AlertPopupService} from '../services/alert-popup.service';
import {HttpCacheService} from '../services/http-cache.service';
import {Token} from '../models/token';
import {environment} from '../../environments/environment';
import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/catch';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private config: AppConfig,
              private router: Router,
              private alertService: AlertService,
              private alertPopupService: AlertPopupService,
              private cache: HttpCacheService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const header: any = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    };
    const urlAPI = req.clone({url: req.url});
    if (urlAPI.url.indexOf(this.config.apiUrl) == -1) {
      header['Access-Control-Allow-Origin'] = '*';
    }
    if (urlAPI.url.indexOf('user_session.json') !== -1 && urlAPI.method == 'POST') {
      // is login
      header.Authorization = 'Basic ' + btoa(this.config.username + ':' + this.config.password);
    } else {
      let token: Token;
      token = JSON.parse(sessionStorage.getItem('accessToken'));
      if (token) {
        header.Authorization = 'bearer ' + token.access_token;
      }
    }
    if (urlAPI.url.indexOf('images.json') !== -1) {
      // upload image
      delete header['Content-Type'];
      header['Accept'] = 'application/json';
    }
    const authReq = req.clone({setHeaders: header});
    return next.handle(authReq).catch((res: any) => {
      let errorMessage = res.error.error;
      if (res.status === 401 || res.status === 403) {
        console.log(errorMessage);
        if (errorMessage.msg == 'Unauthorized') {
          return this.router.navigate(['/login']);
        }
      }
      return Observable.throw(errorMessage);

    });
  }


}
