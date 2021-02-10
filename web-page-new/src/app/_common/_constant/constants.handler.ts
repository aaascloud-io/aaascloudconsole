
export class ConstantsHandler {

    // static server = "https://demo.trackun.jp/iotPF";
    static server = "https://demo.trackun.jp/v1.0";
    static bsServer = "https://demo.trackun.jp/bs";
    // static bsServer = "http://localhost:8081";
    // static keycloakServer = "https://auth.trackun.jp/auth/realms/trackun/"
    // static keycloakServer = "https://auth.trackun.jp/"
    static keycloakServer = "https://auth.aaascloud.io/auth/realms/trackun/"
    // static keycloakServer = "http://localhost:8080/auth/realms/trackun/"
    static keycloak_client_id = "trackun";

    static TOKEN = {
        cookieName : "ACCESS_TOKEN",
        access_token : "",
        access_token_fetch_time : 0,
        access_token_valid_time : 0,
        refresh_token : "",
        refresh_token_fetch_time : 0,
        refresh_token_valid_time : 0
    }

    static tokenStatus = {
        access_token_valid : 1,
        refresh_token_valid : 2,
        refresh_token_expired : 3
    }

    static GLOBAL_TOKEN = {
        id: 'PF_GLOBAL_TOKEN',
        errMsg: {
            userTokenInvalid: 'ユーザー安全認証トークンが無効になりました',
            userPasswordInvalid: 'ユーザー名とパスワードが間違います'
        },
        interval:2*60*60*1000,
        timeZone:9*60*60*1000
    };

    static USER_TOKEN_INVALID = 'ユーザー安全認証トークンが無効になりました';

    // static environment = 'development179'; // products
    // static environment = 'development33'; //
    static environment = 'Devdevelopment'; //

    static environmentCfg = {
        development: {
            protocal: 'http',
            host: '47.245.13.208',
            port: '8080',
            root: 'pfweb.api',
        },
        development179: {
            protocal: 'http',
            host: '47.91.30.179',
            port: '8080',
            root: 'pfweb.api',
        },
        development33: {
            protocal: 'https',
            host: 'demo.trackun.jp',
            port: '443',
            root: 'pfweb.api',
        },
        // development33: {
        //     protocal: 'http',
        //     host: '47.74.9.33',
        //     port: '8088',
        //     root: 'pfweb.api',
        // },
        Devdevelopment: {
            protocal: 'http',
            host: 'localhost',
            port: '8080',
            root: 'pfweb.api',
        }
    };

    static getEnvCfg(): Object {

        return this.environmentCfg[this.environment];
    }

}

export class ServerType {
    static loginServer = 1;
    static server = 2;
    static bsServer = 3;
}