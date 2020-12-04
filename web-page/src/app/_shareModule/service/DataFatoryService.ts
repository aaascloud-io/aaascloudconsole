import { Injectable } from "@angular/core";
import { loginUser } from 'src/app/_common/_interface/userInfo';

@Injectable()
export class DataFatoryService {

  private user: loginUser;

  private routleSel: any;

  /** PageModelの保管 */
  private pageModels: any = {};

  constructor() {
  }

  public setLoginUser(info: loginUser): void {
    this.user = JSON.parse(JSON.stringify(info));
  }

  public getLoginUser(): loginUser {
    let temp = null;
    if (this.user) {
      temp = JSON.parse(JSON.stringify(this.user));
    }

    return temp;
  }

  public clearLoginUser(): void {
    if (this.user) {
      this.user.login_id = null;
      this.user.uid = null;
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
