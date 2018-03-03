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
import {AlertService} from '../services/alert.service';
import {AlertPopupService} from '../services/alert-popup.service';
import {HttpCacheService} from '../services/http-cache.service';
import {Token} from '../models/token';
import {environment} from '../../environments/environment';
import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/catch';
import {LocalStoreManagerService} from '../services/local-store-manager.service';
import {API_KEY_YELP, API_URL} from '../config/global-const';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private router: Router,
                private alertService: AlertService,
                private alertPopupService: AlertPopupService,
                private cache: HttpCacheService,
                private localStoreManagerService: LocalStoreManagerService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // declare header
        const header: any = {
            'Authorization': 'bearer ' + API_KEY_YELP,
        };
        let authReq = req.clone({setHeaders: header});
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
