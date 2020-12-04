import { Injector } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from 'ngx-alerts';

import { Logger } from '@utils/logger';
import { TimeoutService } from '@service/timeoutService';


export class AbstractComponent {

  /** 画面遷移 */
  protected location: Location = null;
  protected router: Router = null;
  protected route: ActivatedRoute = null;

  /** 汎用サービス */
  protected timeout: TimeoutService = null;
  protected alert: AlertService = null;

  protected constructor(
    protected injector: Injector
  ) {
    Logger.debug(this, `component constructed.`);

    this.location = injector.get(Location);
    this.router = injector.get(Router);
    this.route = injector.get(ActivatedRoute);
    this.timeout = injector.get(TimeoutService);
    this.alert = injector.get(AlertService);
  }

  /*
  public authorized(): boolean {
    return this.shared.authorized();
  }
  */

  /**
   * ホームへリダイレクト
   * 
   */
  /*
  public redirect() {
    var url = '/';
    Logger.debug(this, `redirect. to:[${url}]`);
    this.router.navigate([url]);
  }
  */

  /**
   * 戻る(画面より)
   * 
   */
  public back() {
    this.location.back();
  }

  protected handleError(title: string, err: any) {
    Logger.error(this, `handleError called. title:[${title}]`, err);
    if (err) {
      if (err.status !== null && err.status !== undefined) {
        switch (err.status) {
          case 0:
            this.alert.danger(`${title}： ${err.status} ${err.statusText}`);
            break;
          case 401:
            this.alert.danger(`${title}： ${err.status} 認証に失敗しました。`);
            this.router.navigate(['login']);
            break;
          case 403:
            this.alert.danger(`${title}： ${err.status} 権限がありません。`);
            break;
          default:
            this.alert.danger(`${title}： ${err.status} ${err.statusText}`);
            break;
        }
      } else if (err.message) {
        this.alert.danger(`${title}： ${err.message}`);
      } else {
        this.alert.danger(`${title}`);
      }
    } else {
      this.alert.danger(`${title}`);
    }
  }
}
