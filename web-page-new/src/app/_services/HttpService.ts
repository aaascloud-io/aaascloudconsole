import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpRequest} from '@angular/common/http';
import {BaseService} from './BaseService';
import {AuthSignService} from './AuthSignService';
import {DataFatoryService} from './DataFatoryService';
import {Router} from '@angular/router';
import {ConstantsHandler, ServerType} from '../_common/_constant/constants.handler';
import {CookieService} from 'ngx-cookie-service';
import {UrlHandler} from 'src/app/_common/_constant/url.handler';
import {Observable} from 'rxjs';
import {Logger} from 'src/app/_common/_utils/logger';
import {tap} from 'rxjs/operators';
import {AlertService} from '../_services/alert.service';
import {UserInfo} from 'src/app/_common/_interface/UserInfo';
import {codes} from 'src/app/_common/_utils/codes-utils';


@Injectable()
export class HttpService {

    static times = 0;
    validTimePaddingInMs: number;

    constructor(private dataFatoryService: DataFatoryService, private _http: HttpClient, private _authSignService: AuthSignService, private _router: Router, private baseService: BaseService, private alertService: AlertService, private cookieService: CookieService) {
    }

    // common
    post(path: string, data: any): Promise<any> {
        return this._http.post(this.baseService.getPath(path),
            data,
            this.baseService.getHeader()).toPromise();
    }

    put(path: string, data: any): Promise<any> {
        return this._http.put(this.baseService.getPath(path),
            data,
            this.baseService.getHeader()).toPromise();
    }

    delete(path: string, data: any): Promise<any> {
        return this._http.request(
            new HttpRequest("DELETE",
                this.baseService.getPath(path),
                data,
                this.baseService.getDefaultHeader())).toPromise();
    }

    usePost(path: string, data: any): Promise<any> {
        if (path !== '/login') {
            let item: UserInfo = this.getLoginUser();
            this.createData(data, item);
        }
        return this._http.post(this.baseService.getPath(path), JSON.stringify(data), this.baseService.getHeader())
            .toPromise()
            .then((result: any) => {
                if (result.resultCode === codes.RETCODE.ERROR_TOKEN) {
                    this.clearLogin()
                } else {
                    return JSON.parse(result.data);
                }
            })
            .catch((err) => {
                if (err.status === 401 && err.error.result === false) {
                    this.loginFail(err);
                }
                console.log('post error = ' + JSON.stringify(err));
            });
    }

    usePostII(path: string, data: any): Promise<any> {
        if (path !== '/login') {
            let item: UserInfo = this.getLoginUser();
            this.createData(data, item);
        }
        return this._http.post(this.baseService.getPath(path), JSON.stringify(data), this.baseService.getHeader())
            .toPromise()
            .then((result: any) => {
                if (result.resultCode === codes.RETCODE.ERROR_TOKEN) {
                    this.clearLogin()
                } else {
                    return result.data;
                }
            })
            .catch((err) => {
                if (err.status === 401 && err.error.result === false) {
                    this.loginFail(err);
                }
                console.log('post error = ' + JSON.stringify(err));
                return err.error;
            });
    }

    useGet(path: string): Promise<any> {
        return this._http.get(this.baseService.getPath(path), this.baseService.getHeader())
            .toPromise()
            .then((result: any) => {
                if (result.resultCode === codes.RETCODE.ERROR_TOKEN) {
                    this.clearLogin()
                } else {
                    return JSON.parse(result.data);
                }
            }).catch((err) => {
                if (err.status === 401 && err.error.result === false) {
                    this.loginFail(err);
                }
                console.log('get error = ' + JSON.stringify(err));
            })
    }

    useRpPut(path: string, data: any): Promise<any> {
        let item: UserInfo = this.getLoginUser();
        this.createData(data, item);

        return this._http.put(this.baseService.getPath(path), JSON.stringify(data), this.baseService.getHeader())
            .toPromise()
            .then((result: any) => {
                if (result.resultCode === codes.RETCODE.ERROR_TOKEN) {
                    this.clearLogin()
                } else {
                    return result;
                }
            })
            .catch((err) => {
                if (err.status === 401 && err.error.result === false) {
                    this.loginFail(err);
                }
                console.log('put error = ' + JSON.stringify(err));
            });
    }

    useRpPutII(path: string, data: any): Promise<any> {
        let item: UserInfo = this.getLoginUser();
        this.createData(data, item);

        return this._http.put(this.baseService.getPath(path), JSON.stringify(data), this.baseService.getHeader())
            .toPromise()
            .then((result: any) => {
                if (result.resultCode === codes.RETCODE.ERROR_TOKEN) {
                    this.clearLogin()
                } else {
                    return result;
                }
            })
            .catch((err) => {
                if (err.status === 401 && err.error.result === false) {
                    this.loginFail(err);
                }
                console.log('put error = ' + JSON.stringify(err));
                return err.error;
            });
    }

    useRpPost(path: string, datas: any): Promise<any> {
        let item: UserInfo = this.getLoginUser();
        this.createData(datas, item);

        return this._http.post(this.baseService.getPath(path), datas, this.baseService.getHeader())
            .toPromise()
            .then((result: any) => {
                if (result.resultCode === codes.RETCODE.ERROR_TOKEN) {
                    this.clearLogin()
                } else {
                    return result;
                }
            })
            .catch((err) => {
                if (err.status === 401 && err.error.result === false) {
                    this.loginFail(err);
                }
                console.log('post error = ' + JSON.stringify(err));
            });
    }

    useRpPostII(path: string, datas: any): Promise<any> {
        let item: UserInfo = this.getLoginUser();
        this.createData(datas, item);

        return this._http.post(this.baseService.getPath(path), datas, this.baseService.getHeader())
            .toPromise()
            .then((result: any) => {
                if (result.resultCode === codes.RETCODE.ERROR_TOKEN) {
                    this.clearLogin()
                } else {
                    return result;
                }
            })
            .catch((err) => {
                if (err.status === 401 && err.error.result === false) {
                    this.loginFail(err);
                }
                console.log('post error = ' + JSON.stringify(err));
                return err.error;
            });
    }

    useRpDelete(path: string, datas: any): Promise<any> {
        let item: UserInfo = this.getLoginUser();
        this.createData(datas, item);

        var options = this.baseService.getHeader();
        // const options = {
        //     headers:header ,
        //     body: JSON.stringify(data)

        //   }
        options["body"] = JSON.stringify(datas);
        return this._http.delete(this.baseService.getPath(path), options)
            .toPromise()
            .then((result: any) => {
                if (result.resultCode === codes.RETCODE.ERROR_TOKEN) {
                    this.clearLogin()
                } else {
                    return result;
                }
            })
            .catch((err) => {
                if (err.status === 401 && err.error.result === false) {
                    this.loginFail(err);
                }
                console.log('delete error = ' + JSON.stringify(err));
            });
    }

    useRpDeleteII(path: string, datas: any): Promise<any> {
        let item: UserInfo = this.getLoginUser();
        this.createData(datas, item);

        var options = this.baseService.getHeader();
        // const options = {
        //     headers:header ,
        //     body: JSON.stringify(data)

        //   }
        options["body"] = JSON.stringify(datas);
        return this._http.delete(this.baseService.getPath(path), options)
            .toPromise()
            .then((result: any) => {
                if (result.resultCode === codes.RETCODE.ERROR_TOKEN) {
                    this.clearLogin()
                } else {
                    return result;
                }
            })
            .catch((err) => {
                if (err.status === 401 && err.error.result === false) {
                    this.loginFail(err);
                }
                console.log('delete error = ' + JSON.stringify(err));
                return err.error;
            });
    }

    useVerify(path: string, data: any): Promise<any> {
        let item: UserInfo = this.getLoginUser();
        this.createData(data, item);

        return this._http.post(this.baseService.getPath(path), JSON.stringify(data), this.baseService.getHeader())
            .toPromise()
            .then((result: any) => {
                return JSON.parse(result.data);
            }).catch((err) => {
                if (err.status === 401 && err.error.result === false) {
                    this.loginFail(err);

                }
                console.log('get error = ' + JSON.stringify(err));
            })
    }

    private loginFail(err: any): void {
        this.cookieService.delete(ConstantsHandler.GLOBAL_TOKEN.id);
        this.dataFatoryService.clearLoginUser();
        this._router.navigate([''], {
            queryParams: {
                message: ConstantsHandler.GLOBAL_TOKEN.errMsg.userTokenInvalid,
                userName: err.error.userName
            }
        });
    }


    UseGetForRealPath(path: string, data): Promise<any> {
        return this._http.get(path, data)
            .toPromise()
            .then((result: any) => {
                return result;
            }).catch((err) => {
                throw err;
            });
    }

    //UsePostForRealPath
    UsePostForRealPath(path: string, data: any): Promise<any> {
        return this._http.post(path, JSON.stringify(data), this.baseService.getHeader())
            .toPromise()
            .then((result: any) => {
                return result;
            })
            .catch((err) => {
                throw err;
            });
    }

    //put? data type
    UsePutForRealPath(path: string, data: any): Promise<any> {
        return this._http.put(path, JSON.stringify(data), this.baseService.getHeader())
            .toPromise()
            .then((result: any) => {
                return result;
            })
            .catch((err) => {
                throw err;
            });
    }

    //delete? data type
    UseDeleteForRealPath(path: string, data: any): Promise<any> {
        var options = this.baseService.getHeader();
        // const options = {
        //     headers:header ,
        //     body: JSON.stringify(data)

        //   }
        options["body"] = JSON.stringify(data);
        return this._http.delete(path, options)
            //  (data this.baseService.getHeader()))
            .toPromise()
            .then((result: any) => {
                return result;
            })
            .catch((err) => {
                throw err;
            });
    }


    verify(): boolean {
        // verify befroe page route
        // check token
        //todo特権
        // if (this.tokenVerify()) {
        //     // token valid, check user
        //     if (this.dataFatoryService.getLoginUser() != null) {
        //         // user valid
        //         return true;
        //     } else {
        //         // this.alertService.danger("ユーザー情報取得失敗です。管理員までご確認をお願いします。");
        //         this.clearLogin();
        //     }
        // }
        // token valid, check user
        if (this.cookieService.get(ConstantsHandler.GLOBAL_TOKEN.id) != null) {
            // user valid
            return true;
        } else {
            // this.alertService.danger("ユーザー情報取得失敗です。管理員までご確認をお願いします。");
            this.clearLogin();
        }
        return false;
    }

    getLoginUser(): UserInfo {
        //todo
        // if (this.tokenVerify()) {

        // }

        // token valid, check user
        if (this.dataFatoryService.getUserInfo() != null) {
            // user valid
            let routeif: UserInfo = this.dataFatoryService.getUserInfo();
            return routeif;
        } else {
            // this.alertService.danger("ユーザー情報取得失敗です。管理員までご確認をお願いします。");
            this.clearLogin();
        }
        return null;
    }

    tokenVerify(): boolean {
        var tokenStatus = this.checkIfLogin();
        if (tokenStatus == ConstantsHandler.tokenStatus.refresh_token_expired) {
            // expired
            // route to login
            this._router.navigate([""]);
            return false;
        }
        if (tokenStatus == ConstantsHandler.tokenStatus.refresh_token_valid) {
            // use refresh token to fetch token
            this.refreshToken();
        }
        return true;
    }

    executeGet(path: string, data: any, callback: Function): Promise<any> {
        var obj = this;

        if (this.tokenVerify()) {
            if (data != null) {
                var queryString = "?";
                for (let key in data) {
                    queryString += key + "=" + data[key] + "&";
                }
                path += queryString;
            }
            //http.get token from getHeader
            return this._http.get(path, this.baseService.getHeader())
                .toPromise()
                .then(function (res) {
                    callback(res);
                }).catch(function (err) {
                    if (err.status == 403) {
                        alert("この操作の権限がございません。管理員へ確認してください。");
                    } else if (err.status == 401) {
                        alert("ユーザー登録情報無効です。再登録してください。");
                        obj.clearLogin();
                        obj._router.navigate(['']);
                    }
                    throw err;
                });
        }
    }

    postToPFServer(path: string, data: any, callback: Function): Promise<any> {
        var obj = this;
        if (this.tokenVerify()) {
            return this.doPost(path, data, ServerType.server).then(function (res) {
                callback(res);
            }).catch(function (err) {
                if (err.status == 403) {
                    // obj.alertService.danger("この操作の権限がございません。管理員へ確認してください。");
                } else if (err.status == 401) {
                    // obj.alertService.danger("ユーザー登録情報無効です。再登録してください。");
                    obj.clearLogin();
                    obj._router.navigate(['']);
                }
                throw err;
            });
        }
    }

    postToBsServer(path: string, data: any, successCallback: Function, errorCallback: Function): Promise<any> {
        var obj = this;
        if (this.tokenVerify()) {
            return this.doPost(path, data, ServerType.bsServer).then(function (res) {
                if (successCallback != null) {
                    successCallback(res);
                }
            }).catch(function (err) {
                if (err.status == 403) {
                    // obj.alertService.danger("この操作の権限がございません。管理員へ確認してください。");
                } else if (err.status == 401) {
                    // obj.alertService.danger("ユーザー登録情報無効です。再登録してください。");
                    obj._router.navigate(['']);
                }
                if (errorCallback != null) {
                    errorCallback(err);
                } else {
                    throw err;
                }
            });
        }
    }

    checkIfLogin(): number {
        var obj = this;
        var constants = ConstantsHandler.TOKEN;
        // fetch from cookie when full refresh
        if (ConstantsHandler.TOKEN.access_token == "") {
            var string = obj.cookieService.get(ConstantsHandler.TOKEN.cookieName);
            if (string != "undefined" && string != "") {
                constants = JSON.parse(string);
                ConstantsHandler.TOKEN = constants;
                var userInfoString = obj.cookieService.get(ConstantsHandler.GLOBAL_TOKEN.id);
                if (userInfoString != "undefined" && userInfoString != "") {
                    obj.dataFatoryService.setLoginUser(JSON.parse(userInfoString));
                }
            }
        }
        // if no token info
        if (constants.access_token_fetch_time == 0 || constants.refresh_token_fetch_time == 0) {
            return ConstantsHandler.tokenStatus.refresh_token_expired;
        }

        // if access token expired
        if ((constants.access_token_fetch_time + constants.access_token_valid_time + this.validTimePaddingInMs
            <= Date.parse(new Date().toString()))) {
            // if refresh token expired
            if (constants.refresh_token_fetch_time != 0 &&
                (constants.refresh_token_fetch_time + constants.refresh_token_valid_time + this.validTimePaddingInMs
                    <= Date.parse(new Date().toString()))) {
                return ConstantsHandler.tokenStatus.refresh_token_expired;
            } else {
                return ConstantsHandler.tokenStatus.refresh_token_valid;
            }
        }

        return ConstantsHandler.tokenStatus.access_token_valid;
    }

    refreshToken(): Promise<any> {
        var formData = "grant_type=refresh_token&client_id=" + ConstantsHandler.keycloak_client_id + "&refresh_token=" + ConstantsHandler.TOKEN.refresh_token;
        return this.fetchFromKeycloak(formData);
    }

    accessToken(username: string, password: string): Promise<any> {
        var formData = "grant_type=password&client_id=" + ConstantsHandler.keycloak_client_id + "&username=" + username + "&password=" + password + "&client_secret=385935b8-85e3-41df-94b9-6365c5a39056";
        return this.fetchFromKeycloak(formData);
    }

    logout(): void {
        this.clearLogin();
        if (this.tokenVerify()) {
            this.postToPFServer("/user/logout", {}, function () {
            });
        }
        this._router.navigate([""]);
    }

    private fetchFromKeycloak(formData: string) {
        var obj = this;
        var uri = ConstantsHandler.keycloakServer + "protocol/openid-connect/token";
        return this._http.post(uri, formData, {
            headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8')
        }).toPromise()
            .then(function (res) {
                // save token
                ConstantsHandler.TOKEN.access_token = res["access_token"];
                ConstantsHandler.TOKEN.access_token_fetch_time = Date.parse(new Date().toString());
                ConstantsHandler.TOKEN.access_token_valid_time = res["expires_in"] * 1000;
                ConstantsHandler.TOKEN.refresh_token = res["refresh_token"];
                ConstantsHandler.TOKEN.refresh_token_fetch_time = ConstantsHandler.TOKEN.access_token_fetch_time;
                ConstantsHandler.TOKEN.refresh_token_valid_time = res["refresh_expires_in"] * 1000;

                var timeout = new Date(new Date().getTime() + ConstantsHandler.GLOBAL_TOKEN.interval);
                // save to cookies
                obj.cookieService.set(ConstantsHandler.TOKEN.cookieName, JSON.stringify(ConstantsHandler.TOKEN), timeout);
                return res;
            }).catch((err) => {
                if (err.status == 401) {
                    // obj.alertService.danger("ユーザー名又はパスワードの値は不正確です")
                } else if (err.status == 400) {
                    // obj.alertService.danger("アカウントの設定が未完成です")
                }
                throw err;
            });
    }

    private getString(string: any) {
        if (string == null) {
            return "";
        }
        return string;
    }

    // processUserInfo(res: any): void{
    //     if(res){
    //         // save user info
    //         var userInfo = res["userInfo"];
    //         let temp = {
    //             uid: userInfo.id,
    //             login_id: userInfo.username,
    //             uname: this.getString(userInfo.firstName) + " " +  this.getString(userInfo.lastName),
    //             block: false,
    //             permissions: res["permissions"],
    //         }
    //         if(userInfo["attributes"]){
    //             if(userInfo["attributes"].block){
    //                 temp.block = true;
    //             }
    //             if(userInfo["attributes"].uid instanceof Array){
    //                 temp.uid = userInfo["attributes"].uid[0];
    //             }
    //         }
    //         this.dataFatoryService.setLoginUser(temp);

    //         var timeout = new Date(new Date().getTime() + ConstantsHandler.GLOBAL_TOKEN.interval);
    //         //save in cookie
    //         this.cookieService.set(ConstantsHandler.GLOBAL_TOKEN.id, JSON.stringify(temp), timeout);
    //         // save valid period in cookie
    //         this.cookieService.set(ConstantsHandler.TOKEN.cookieName, JSON.stringify(ConstantsHandler.TOKEN), timeout);
    //         return res;
    //     }else{
    //         // TODO
    //         // this.alertService.danger("ユーザー情報取得できませんでした")
    //     }
    // }

    processUserInfo(res: any): void {
        if (res) {
            // save user info
            let temp = {
                uid: res.userid,
                login_id: res.username,
                company: res.companyid,
                role: res.role,
                upperuserid: res.upperuserid,
                fullname: res.fullname,
                access_token: ConstantsHandler.TOKEN.access_token

            }
            this.dataFatoryService.setUserInfo(temp);


            var timeout = new Date(new Date().getTime() + ConstantsHandler.GLOBAL_TOKEN.interval);
            //save in cookie
            this.cookieService.set(ConstantsHandler.GLOBAL_TOKEN.id, JSON.stringify(temp), timeout);
            // save valid period in cookie
            this.cookieService.set(ConstantsHandler.TOKEN.cookieName, JSON.stringify(ConstantsHandler.TOKEN), timeout);
            return res;
        } else {
            this.alertService.error("ユーザー情報取得できませんでした");
        }
    }

    getUserInfo(callback: Function): Promise<any> {
        var obj = this;
        return this.executeGet(ConstantsHandler.server + "/user/info", null, function (res) {
            obj.processUserInfo(res);
            if (callback != null) {
                callback(res);
            }
        });
    }

    private clearLogin(): void {
        ConstantsHandler.TOKEN = {
            cookieName: "ACCESS_TOKEN",
            access_token: "",
            access_token_fetch_time: 0,
            access_token_valid_time: 0,
            refresh_token: "",
            refresh_token_fetch_time: 0,
            refresh_token_valid_time: 0
        }
        this.cookieService.delete(ConstantsHandler.GLOBAL_TOKEN.id);
        this.cookieService.delete(ConstantsHandler.TOKEN.cookieName);
        this.dataFatoryService.clearLoginUser();
        this._router.navigate(['']);
    }

    private doPost(path: string, data: any, serverType): Promise<any> {
        return this._http.post(UrlHandler.getApiUrl(path, serverType), JSON.stringify(data), this.baseService.getHeader())
            .toPromise()
            .then((result: any) => {
                return result;
            })
            .catch((err) => {
                throw err;
            });
    }

    adminPost(path: string, data: any): Promise<any> {
        return this._http.post(this.baseService.getPath(path), JSON.stringify(data), this.baseService.getHeader())
            .toPromise()
            .then((result: any) => {
                return JSON.parse(result.data);
            })
            .catch((err) => {
                if (err.status === 401 && err.error.result === false) {
                    this.loginFail(err);
                }
                console.log('post error = ' + JSON.stringify(err));
            });
    }

    adminPostII(path: string, data: any): Promise<any> {
        return this._http.post(this.baseService.getPath(path), JSON.stringify(data), this.baseService.getHeader())
            .toPromise()
            .then((result: any) => {
                return result.data;
            })
            .catch((err) => {
                if (err.status === 401 && err.error.result === false) {
                    this.loginFail(err);
                }
                console.log('post error = ' + JSON.stringify(err));
                return err.error;
            });
    }

    private createData(data: any, item: UserInfo): any {
        data.loginInfo = {
            "loginuserid": item.uid,
            "loginusername": item.login_id,
            "loginrole": item.role,
            "logincompanyid": item.company,
            "access_token": item.access_token
        }
        data.targetUserInfo = {
            "targetuserid": item.uid,
            "targetuserCompanyid": item.company,
        }
        return data;
    }

}

