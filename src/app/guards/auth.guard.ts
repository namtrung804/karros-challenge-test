/**
 * Created by Nam Trung on 3/16/2017.
 */

import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from "../services/authentication.service";

import {LocalStoreManagerService} from "../services/local-store-manager.service";

declare let ga: any;

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private localStoreManagerService: LocalStoreManagerService) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.localStoreManagerService.getData('accessToken')) {
      this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
      return false;
    }
    // logged in so return true
    return true;

  }
}
