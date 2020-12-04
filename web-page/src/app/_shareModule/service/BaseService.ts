import { HttpHeaders } from '@angular/common/http';
import { UrlHandler } from '../../_common/_constant/url.handler';
import { CookieService } from 'ngx-cookie-service';
import {ConstantsHandler} from '../../_common/_constant/constants.handler';
import { Injectable } from '@angular/core';

@Injectable()
export class BaseService{
    
    constructor(private cookieService:CookieService){}

    getOptions(): object {
        var options = this.getJwtHeader();
        return options;
    }

    public getHeader():object {
        return this.getJwtHeader();
    } 

    public getPath(path : string) : string {
        return UrlHandler.getApiUrlRocalTest(path);
    }

    public getDefaultHeader():object{
        return  {
            headers : new HttpHeaders().set('Content-Type','application/json;charset=utf-8')
                .set("Authorization", "Bearer " + ConstantsHandler.TOKEN.access_token),
            withCredential: true
        } 
    }

    public getWeatherHeader():object{
        return  {
            headers : new HttpHeaders().set('Content-Type','application/json;charset=utf-8').set('Access-Control-Allow-Origin','*').set('Access-Control-Allow-Headers', 'X-Requested-With, accept, origin, content-type').set('Access-Control-Allow-Methods','GET')
        } 
    }

    private getJwtHeader():object{
        let item = {
            id : ConstantsHandler.GLOBAL_TOKEN.id
        }
        let userCookie:string =  this.cookieService.get(ConstantsHandler.GLOBAL_TOKEN.id);
        if(userCookie != null && userCookie != ''){
            let user = JSON.parse(userCookie);
            if(user.uid){
                let header = new HttpHeaders().set('Content-Type','application/json;charset=utf-8').append('Authorization', "Bearer " + ConstantsHandler.TOKEN.access_token);
                return {
                    headers : header
                }
                 
            }
        }
        return this.getDefaultHeader();
    }
}