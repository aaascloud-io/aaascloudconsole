import { Injectable } from "@angular/core";
import { UserInfo } from 'src/app/_common/_interface/UserInfo';
import { RouteIdIF } from 'src/app/_common/_interface/RouteIdIF';
import { ConstantsHandler } from '../_common/_constant/constants.handler';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class DataFatoryService {

  private userInfo: UserInfo;

  private routeIdIF: RouteIdIF;

  private routleSel: any;

  /** PageModelの保管 */
  private pageModels: any = {};

  constructor(private cookieService: CookieService) {
  }

  public setRouteIdIF(info: RouteIdIF): void {
    this.routeIdIF = JSON.parse(JSON.stringify(info));
  }

  public getRouteIdIF(): RouteIdIF {
    let temp = null;
    if (this.routeIdIF) {
      temp = JSON.parse(JSON.stringify(this.routeIdIF));
    } else {
      let userCookie: string = this.cookieService.get(ConstantsHandler.GLOBAL_TOKEN.id);
      if (userCookie != null && userCookie != '') {
        let user = JSON.parse(userCookie);
        temp = user;
      }
    }
    return temp;
  }

  public setUserInfo(info: UserInfo): void {
    this.userInfo = JSON.parse(JSON.stringify(info));
  }

  public getUserInfo(): UserInfo {
    let temp = null;
    if (this.userInfo) {
      temp = JSON.parse(JSON.stringify(this.userInfo));
    } else {
      let userCookie: string = this.cookieService.get(ConstantsHandler.GLOBAL_TOKEN.id);
      if (userCookie != null && userCookie != '') {
        let user = JSON.parse(userCookie);
        temp = user;
      }
    }
    return temp;
  }

  public clearRouteIdIF(): void {
    if (this.routeIdIF) {
      this.routeIdIF.login_id = null;
      this.routeIdIF.uid = null;
    }
  }

  public setLoginUser(info: any): void {
    this.userInfo = JSON.parse(JSON.stringify(info));
  }

  public getLoginUser(): UserInfo {
    let temp = null;
    if (this.userInfo) {
      temp = JSON.parse(JSON.stringify(this.userInfo));
    }

    return temp;
  }

  public clearLoginUser(): void {
    if (this.userInfo) {
      this.userInfo.login_id = null;
      this.userInfo.uid = null;
    }

  }
  public setPageFlg(routleSel: any): void {
    this.routleSel = routleSel;
  }

  public getPageFlg(): any {
    return this.routleSel;
  }

  public setPageModel(url: string, pageModel: any) {
    this.pageModels[url] = pageModel;
  }

  public getPageModel(url: string) {
    return this.pageModels[url];
  }

  public clearPageModel(url: string) {
    delete this.pageModels[url];
  }
}
