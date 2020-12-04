import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot,CanActivateChild, Router, RouterStateSnapshot } from "@angular/router";
import {MenuHandler} from '../../_common/_constant/menu.handler';
import { SubjectService } from './SubjectService';

@Injectable()
export class MenuListener implements CanActivateChild {
    constructor(private subjectService:SubjectService){}

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) :boolean{
       // console.log(`MenuListener route.url = ${route.url} state.url = ${state.url}`);
        let array:string[] = state.url.split('/');
        array.shift();
        if(array.length>2 && route.url.length>0){
            let path:string = array[1]+'/'+array[2];
            let subPath:string = null;
            if(array.length>3){
                let arr:string[] = array[3].split('?');
                subPath = arr[0];
            }
            let menuId = {path:path,subPath:subPath,type:'menu'};
            //console.log(`menuId = ${JSON.stringify(menuId) }`);
            this.subjectService.sendMessage(menuId);

            
        }
        return true;
    }
}