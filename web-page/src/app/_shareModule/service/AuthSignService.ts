import {LocalStorageService} from '../../_common/_storage/localStorageService';
import {ConstantsHandler} from '../../_common/_constant/constants.handler';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthSignService {
    constructor() {}
    onLogin( data: any ): void {
        LocalStorageService.setItem({
            id : ConstantsHandler.GLOBAL_TOKEN.id,
            value : data.jwt
        });
        console.log(`トークン設置しました`);
    }

    onLogOut(data): void {
        LocalStorageService.delItem({
            id : ConstantsHandler.GLOBAL_TOKEN.id
        });
        console.log(`${data.userName} 様　ログアウトしました`);
    }
}
