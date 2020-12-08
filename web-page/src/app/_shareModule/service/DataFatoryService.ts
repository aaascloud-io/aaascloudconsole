import { Injectable } from "@angular/core";
import { UserInfo } from 'src/app/_common/_interface/userInfo';

@Injectable()
export class DataFatoryService {

  private user: UserInfo;

  private routleSel: any;

  /** PageModelの保管 */
  private pageModels: any = {};

  constructor() {
  }

  public setLoginUser(info: UserInfo): void {
    this.user = JSON.parse(JSON.stringify(info));
  }

  public getLoginUser(): UserInfo {
    let temp = null;
    if (this.user) {
      temp = JSON.parse(JSON.stringify(this.user));
    }

    return temp;
  }

  public clearLoginUser(): void {
    if (this.user) {
      this.user.loginid = null;
      this.user.userid = null;
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
