import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, CanActivateChild } from "@angular/router";
import { HttpService } from 'src/app/_shareModule/service/HttpService';

@Injectable()
export class AuthSignListenerChild implements CanActivateChild {
    constructor(
        private router: Router,
        private httpService: HttpService) { }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        var obj = this;
        if (!obj.httpService.verify()) {
            obj.router.navigate(["login"]);
        }
        return true;
    }
}