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
export class DeviceService {


  public constructor(
    private http: HttpClient,
    private base: BaseService,
    private httpService: HttpService
  ) {
  }

  /**
   * デバイス定義一覧取得
   * 
   */
  public getDeviceDefinitions(data: {}): Observable<any> {
    if (!this.httpService.tokenVerify()) {
      ///throw new Error('Not authorized.');
      throw new HttpErrorResponse({ status: 401, statusText: 'Not authorized.' });
    }
    var url = ConstantsHandler.server + '/deviceDefinition/adminList';
    var query = '';
    if (data){
      for (let key in data){
        if (query) query += '&';
        query += key + '=' + data[key];
      }
    }
    if (query) url += '?' + query;

    Logger.detail(this, `start to get device definitions. query:[${query}]`);
    return this.http.get<any>(url, this.base.getHeader()).pipe(
      tap(
        result => {
          Logger.info(this, `got device definitions successfully. ` + 
            `total:[${result.total}] length:[${result.list.length}]`);
        },
        error => {
          Logger.error(this, `failed to get device definitions. ` +
            `status:[${error.status}] text:[${error.statusText}]`, error);
        }
      )
    );
  }

  /**
   * デバイス定義登録
   * 
   */
  public addDevices(devices: any[]): Observable<any> {
    if (!this.httpService.tokenVerify()) {
      throw new HttpErrorResponse({ status: 401, statusText: 'Not authorized.' });
    }
    var url = ConstantsHandler.server + '/deviceDefinition/adminBatchAdd';
    var body = JSON.stringify({ 'list': devices });
    Logger.detail(this, `start to create device definitions. size:[${devices.length}]`);
    return this.http.put<any>(url, body, this.base.getHeader()).pipe(
      tap(
        result => {
          Logger.info(this, `created successfully.`);
        },
        error => {
          Logger.error(this, `failed to create device definitions. ` +
            `status:[${error.status}] text:[${error.statusText}]`, error);
        }
      )
    );
  }

  /**
   * デバイス定義登録
   * 
   */
  public addDevice(device: any): Observable<any> {
    if (!this.httpService.tokenVerify()) {
      throw new HttpErrorResponse({ status: 401, statusText: 'Not authorized.' });
    }
    var url = ConstantsHandler.server + '/deviceDefinition/adminBatchAdd';
    var body = JSON.stringify({ 'list': [device] });
    Logger.detail(this, `start to create device definition.`);
    return this.http.put<any>(url, body, this.base.getHeader()).pipe(
      tap(
        result => {
          Logger.info(this, `created successfully.`);
        },
        error => {
          Logger.error(this, `failed to create device definition. ` +
            `status:[${error.status}] text:[${error.statusText}]`, error);
        }
      )
    );
  }

  /**
   * デバイス定義削除
   * 
   */
  public deleteDevice(imei: string): Observable<any> {
    if (!this.httpService.tokenVerify()) {
      ///throw new Error('Not authorized.');
      throw new HttpErrorResponse({ status: 401, statusText: 'Not authorized.' });
    }
    var url = ConstantsHandler.server + '/deviceDefinition/adminBatchDelete';
    var options = this.base.getHeader();
    options['body'] = JSON.stringify({deleteTargets: [imei]});
    Logger.detail(this, `start to delete a device definition. param:[${options['body']}]`);
    return this.http.delete<any>(url, options).pipe(
      tap(
        result => {
          Logger.info(this, `deleted successfully.`);
          console.log(result);
        },
        error => {
          Logger.error(this, `failed to delete a device definition. ` +
            `status:[${error.status}] text:[${error.statusText}]`, error);
        }
      )
    );
  }

  /**
   * デバイス定義削除
   * 
   */
  public deleteDevices(imeis: string[]): Observable<any> {
    if (!this.httpService.tokenVerify()) {
      ///throw new Error('Not authorized.');
      throw new HttpErrorResponse({ status: 401, statusText: 'Not authorized.' });
    }
    var url = ConstantsHandler.server + '/deviceDefinition/adminBatchDelete';
    var options = this.base.getHeader();
    options['body'] = JSON.stringify({deleteTargets: imeis});
    Logger.detail(this, `start to delete device definitions. param:[${options['body']}]`);
    return this.http.delete<any>(url, options).pipe(
      tap(
        result => {
          Logger.info(this, `deleted successfully.`);
          console.log(result);
        },
        error => {
          Logger.error(this, `failed to delete device definitions. ` +
            `status:[${error.status}] text:[${error.statusText}]`, error);
        }
      )
    );
  }

  /**
   * デバイスバインディング一覧取得
   * 
   */
  public getDeviceBindings(data: {}): Observable<any> {
    if (!this.httpService.tokenVerify()) {
      ///throw new Error('Not authorized.');
      throw new HttpErrorResponse({ status: 401, statusText: 'Not authorized.' });
    }
    var url = ConstantsHandler.server + '/deviceBinding/adminList';
    var query = '';
    if (data){
      for (let key in data){
        if (query) query += '&';
        query += key + '=' + data[key];
      }
    }
    if (query) url += '?' + query;

    Logger.detail(this, `start to get device bindings. query:[${query}]`);
    return this.http.get<any>(url, this.base.getHeader()).pipe(
      tap(
        result => {
          Logger.info(this, `got device bindings successfully. ` + 
            `total:[${result.total}] length:[${result.list.length}]`);
        },
        error => {
          Logger.error(this, `failed to get device bindings. ` +
            `status:[${error.status}] text:[${error.statusText}]`, error);
        }
      )
    );
  }
  
  /**
   * デバイスバインディング登録
   * 
   */
  public createDeviceBindings(data: {}): Observable<any> {
    if (!this.httpService.tokenVerify()) {
      ///throw new Error('Not authorized.');
      throw new HttpErrorResponse({ status: 401, statusText: 'Not authorized.' });
    }
    var url = ConstantsHandler.server + '/deviceBinding/adminBatchBind';
    Logger.detail(this, `start to create device bindings.`);
    return this.http.put<any>(url, JSON.stringify(data), this.base.getHeader()).pipe(
      tap(
        result => {
          Logger.info(this, `created successfully.`);
        },
        error => {
          Logger.error(this, `failed to create device bindings. ` +
            `status:[${error.status}] text:[${error.statusText}]`, error);
        }
      )
    );
  }

  /**
   * デバイスバインディング更新
   * 
   * @param data 
   */
  public updateDeviceBindings(data: {}): Observable<any> {
    if (!this.httpService.tokenVerify()) {
      ///throw new Error('Not authorized.');
      throw new HttpErrorResponse({ status: 401, statusText: 'Not authorized.' });
    }
    var url = ConstantsHandler.server + '/deviceBinding/adminModify';
    Logger.detail(this, `start to update device bindings.`);
    return this.http.post<any>(url, JSON.stringify(data), this.base.getHeader()).pipe(
      tap(
        result => {
          Logger.info(this, `updated successfully.`);
        },
        error => {
          Logger.error(this, `failed to update device bindings. ` +
            `status:[${error.status}] text:[${error.statusText}]`, error);
        }
      )
    );
  }
}
