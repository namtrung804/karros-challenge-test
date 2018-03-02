import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {Http} from "@angular/http";
import {TranslateService} from "@ngx-translate/core";
import {HttpRequest, HttpResponse} from "@angular/common/http";

abstract class HttpCache {
  /**
   * Returns a cached response, if any, or null if not present.
   */
  abstract get(req: HttpRequest<any>): HttpResponse<any> | null;

  /**
   * Adds or updates the response in the cache.
   */
  abstract put(req: HttpRequest<any>, resp: HttpResponse<any>): void;
}

@Injectable()
export class HttpCacheService implements HttpCache {
  dataCache: any;

  get(req: HttpRequest<any>): HttpResponse<any> | null {
    return this.dataCache;
  }

  put(req: HttpRequest<any>, resp: HttpResponse<any>): void {
      this.dataCache=resp;
  }
}
