import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { ConstantsHandler } from '../_common/_constant/constants.handler';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router,private cookieService: CookieService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    // if (localStorage.getItem('currentUser')) {
    //   // Logged in so return true

    //   return true;
    // }

    if (this.cookieService.get(ConstantsHandler.GLOBAL_TOKEN.id)) {
      // Logged in so return true

      return true;
    }

    // Not logged in so redirect to login page with the return url
    this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
