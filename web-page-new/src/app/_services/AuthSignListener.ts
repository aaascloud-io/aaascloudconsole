import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { MenuHandler } from 'src/app/_common/_constant/menu.handler';
import { UrlHandler } from 'src/app/_common/_constant/url.handler';
import { DataFatoryService } from './DataFatoryService';
import { AlertService } from 'ngx-alerts';
@Injectable()
export class AuthSignListener implements CanActivate {
    
    constructor(
        private router: Router, 
        private userSevice: DataFatoryService,
        private alertService: AlertService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        this.routeToPage(this);
        return true;
    }

    private routeToPage(obj: this) {
        UrlHandler.routeParam.fromParent = true;
        if (UrlHandler.routeParam.childPageNow == null) {
            obj.router.navigate(["/main/page/dashboard"]);
        }else {
            var containPage = false;
            MenuHandler.pageFilter.forEach(page => {
                if (UrlHandler.routeParam.childPageNow.includes(page)) {
                    containPage = true;
                }
            });
            if (containPage) {
                var path = UrlHandler.routeParam.childPageNow;
                // if(this.permisionChecker.check(this.userSevice.getLoginUser(), path)){
                //     obj.router.navigate([path], { queryParams: UrlHandler.routeParam.pageParams });
                // }else{
                //     obj.alertService.danger("この操作の権限がありません。管理員まで確認してください。");
                // }
            }else {
                obj.router.navigate(["/main/page/dashboard"]);
            }
        }
    }

}