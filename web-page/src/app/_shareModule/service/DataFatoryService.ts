import { Injectable } from "@angular/core";
import { LoginInfo } from 'src/app/_common/_interface/userInfo';

@Injectable()
export class DataFatoryService {

  private loginInfo: LoginInfo;

  private routleSel: any;

  /** PageModelの保管 */
  private pageModels: any = {};

  constructor() {
  }

  public setLoginUser(info: any): void {
    this.loginInfo = info
  }

  public getLoginUser(): any {
    let temp = null;
    if (this.loginInfo) {
      temp = this.loginInfo;
    }

    return temp;
  }

  public clearLoginUser(): void {
    if (this.loginInfo) {
      this.loginInfo.loginid = null;
      this.loginInfo.loginuserid = null;
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
