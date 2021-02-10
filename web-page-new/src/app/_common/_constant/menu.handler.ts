
import { menuIF } from '../../_common/_interface/commonIF';
export class MenuHandler {
    static MENU:menuIF[] = [
        {
            title:'ダッシュボード',
            path:'page/dashboard',
            icon:'fa fa-tachometer fa-fw',
            active:false
        },
        {
            title:'プロダクト',
            path:'page/product',
            icon:'icon fa fa-paper-plane',
            active:false
        },{
            title:'デバイス',
            path:'page/device',
            icon:'icon fa fa-hdd-o',
            active:false
        },{
            title:'バージョン管理',
            path:'page/version',
            icon:'icon fa fa-file',
            active:false
        },{
            title:'ユーザー管理',
            path:'page/userManager',
            icon:'icon fa fa-user',
            active:false
        }
        // 'ダッシュボード',
        // 'デバイス',
        // 'ユーザー管理'
    ];

    static pageFilter: ['list', 'device', 'user', 'detail', 'notification-list', 'notification'];
    
}