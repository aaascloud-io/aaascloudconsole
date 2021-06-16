import {environment} from '../../../environments/environment';

export class HttpEnv {
    protocol: string;
    host: string;
    port: string;
    root: string;
}

export class ServerType {
    static loginServer = 1;
    static server = 2;
    static bsServer = 3;
}

export class ConstantsHandler {

    // サーバー
    static server = environment.accUrl.server;
    // BSサーバー
    static bsServer = environment.accUrl.bsServer;
    // キークロックサーバー
    static keycloakServer = environment.keycloak.server;
    // キーId
    static keycloak_client_id = environment.keycloak.clientId;

    static targetuserid = environment.targetUser.id;
    static targetuserCompanyid = environment.targetUser.companyId;

    static USER_TOKEN_INVALID = 'ユーザー安全認証トークンが無効になりました';
    static SUCCESS_INFO = 'SUCCESS';

    // static server = "https://demo.trackun.jp/iotPF";
    // static server = "https://demo.trackun.jp/v1.0";

    // static bsServer = "http://localhost:8081";

    // static keycloakServer = "https://auth.trackun.jp/auth/realms/trackun/"
    // static keycloakServer = "https://auth.trackun.jp/"
    // static keycloakServer = "http://localhost:8080/auth/realms/trackun/"


    static TOKEN = {
        cookieName: "ACCESS_TOKEN",
        access_token: "",
        access_token_fetch_time: 0,
        access_token_valid_time: 0,
        refresh_token: "",
        refresh_token_fetch_time: 0,
        refresh_token_valid_time: 0
    }

    static tokenStatus = {
        access_token_valid: 1,
        refresh_token_valid: 2,
        refresh_token_expired: 3
    }

    static GLOBAL_TOKEN = {
        id: 'PF_GLOBAL_TOKEN',
        errMsg: {
            userTokenInvalid: 'ユーザー安全認証トークンが無効になりました',
            userPasswordInvalid: 'ユーザー名とパスワードが間違います'
        },
        interval: 2 * 60 * 60 * 1000,
        timeZone: 9 * 60 * 60 * 1000
    };

    static getEnvCfg(): HttpEnv {
        return environment.httpEnv;
    }

}

