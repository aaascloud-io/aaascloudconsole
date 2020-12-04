import { HttpHeaders } from '@angular/common/http';
import { UrlHandler } from '../_constant/url.handler';
import {LocalStorageService} from '../_storage/localStorageService';

import {ConstantsHandler, ServerType} from '../_constant/constants.handler';


export class BaseService{
    constructor(){}

    public getHeader():object {
        return this.getJwtHeader();
    } 

    public getPath(path : string) : string {
        return UrlHandler.getApiUrl(path, ServerType.server);
    }

    public getDefaultHeader():object{
        return  {
            headers : new HttpHeaders().set('Content-Type','application/json;charset=utf-8')
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
        let jwt = LocalStorageService.getItem(item);
        if(jwt && jwt.token){
            let header = new HttpHeaders().set('Content-Type','application/json;charset=utf-8').append('userName',jwt.userName).append('Authorization','Bearer '+jwt.token);
            return {
                headers : header
            }
             
        }
        return this.getDefaultHeader();
    }
}