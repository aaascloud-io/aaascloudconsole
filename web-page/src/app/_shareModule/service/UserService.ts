import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Logger } from '@utils/logger';
import { ConstantsHandler } from '@common/_constant/constants.handler';
import { BaseService } from '@service/BaseService';
import { HttpService } from '@service/HttpService';


@Injectable({
  providedIn: 'root'
})
export class UserService {


  public constructor(
    private http: HttpClient,
    private base: BaseService,
    private httpService: HttpService
  ) {
  }

  /**
   * ユーザー一覧取得
   * 
   */
  public getUsers(data: {}): Observable<any> {
    if (!this.httpService.tokenVerify()) {
      ///throw new Error('Not authorized.');
      throw new HttpErrorResponse({ status: 401, statusText: 'Not authorized.' });
    }
    var url = ConstantsHandler.server + '/user/list';
    var query = '';
    if (data){
      for (let key in data) {
        if (query) query += '&';
        query += key + '=' + data[key];
      }
    }
    if (query) url += '?' + query;

    Logger.detail(this, `start to get users. query:[${query}]`);
    return this.http.get<any>(url, this.base.getHeader()).pipe(
      tap(
        result => {
          Logger.info(this, `got users successfully. length:[${result.users.length}]`);
        },
        error => {
          Logger.error(this, `failed to get users. ` +
            `status:[${error.status}] text:[${error.statusText}]`, error);
        }
      )
    );
  }

  /**
   * ユーザー情報取得
   * 
   */
  public getMyInfo(): Observable<any> {
    if (!this.httpService.tokenVerify()) {
      throw new HttpErrorResponse({ status: 401, statusText: 'Not authorized.' });
    }
    var url = ConstantsHandler.server + '/user/info';
    Logger.detail(this, `start to get my info.`);
    return this.http.get<any>(url, this.base.getHeader()).pipe(
      tap(
        result => {
          Logger.info(this, `got my info successfully.`);
        },
        error => {
          Logger.error(this, `failed to get my info. ` +
            `status:[${error.status}] text:[${error.statusText}]`, error);
        }
      )
    );
  }

  /**
   * 権限チェック
   * 
   */
  public authorized(): Observable<any> {
    if (!this.httpService.tokenVerify()) {
      throw new HttpErrorResponse({ status: 401, statusText: 'Not authorized.' });
    }
    var url = ConstantsHandler.server + '/user/authorized';
    Logger.detail(this, `start to check authorized.`);
    return this.http.get<any>(url, this.base.getHeader()).pipe(
      tap(
        result => {
          Logger.info(this, `checked authorized successfully.`);
        },
        error => {
          Logger.error(this, `failed to check authorized. ` +
            `status:[${error.status}] text:[${error.statusText}]`, error);
        }
      )
    );
  }

  public deleteUser(uid: string) : Observable<any> {
    if (!this.httpService.tokenVerify()) {
      throw new HttpErrorResponse({ status: 401, statusText: 'Not authorized.' });
    }
    var url = ConstantsHandler.server + '/user/delete';
    ///var body = JSON.stringify({ uid: uid });
    var body = { uid: uid };
    Logger.detail(this, `start to delete user. uid:[${uid}]`);
    return this.http.post(url, body, this.base.getHeader()).pipe(
      tap(
        result => {
          Logger.info(this, `delete user successfully.`);
        },
        error => {
          Logger.error(this, `failed to delete user. ` +
            `status:[${error.status}] text:[${error.statusText}]`, error);
        }
      )
    );
  }
}
