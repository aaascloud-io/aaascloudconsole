import { ConstantsHandler, ServerType } from './constants.handler';

export class UrlHandler {
  static routeParam: any;
    //アプリの絶対パスを取る
  static getApiUrlRocalTest(uri : string) : string{
    let path:any = ConstantsHandler.getEnvCfg();
    // サーバー
    let url : string = path.protocal + '://' +  path.host  + ':' + path.port + '/' +  path.root + '/' +  uri;
    // rocal
    // let url : string = path.protocal + '://' +  path.host  + ':' + path.port + '/' +  uri;

      return url;
  }

  static getApiUrl(uri : string, serverType: number) : string{
    if(!uri.startsWith("/")){
      uri = "/" + uri;
    }
    if(serverType == ServerType.loginServer){
      return ConstantsHandler.keycloakServer + uri;
    }else if(serverType == ServerType.bsServer){
      return ConstantsHandler.bsServer + uri;
    }else{
      return ConstantsHandler.server + uri;
    }
  }

    /**
   * プロトコル取得
   */
  static getProtocol() {
    let protocol = window.location.href;
    const idx = protocol.indexOf('://');
    if (0 <= idx) {
      protocol = protocol.substr(0, idx);
    }
    return protocol;
  }

  /**
   * サーバーホスト名取得
   */
  static getServerHostName() {
    let hostName = window.location.href;
    let idx = hostName.indexOf('://');
    if (0 <= idx) {
      hostName = hostName.substr(idx + 3);
    }
    idx = hostName.indexOf('/');
    if (0 <= idx) {
      hostName = hostName.substr(0, idx);
    }
    idx = hostName.indexOf(':');
    if (0 <= idx) {
      hostName = hostName.substr(0, idx);
    }
    return hostName;
  }

   /**
   * サーバーポート番号取得
   */
  static getServerPortNo() {
    let portNo = window.location.href;
    let idx = portNo.indexOf('://');
    if (0 <= idx) {
      portNo = portNo.substr(idx + 3);
    }
    idx = portNo.indexOf('/');
    if (0 <= idx) {
      portNo = portNo.substr(0, idx);
    }
    idx = portNo.indexOf(':');
    if (0 <= idx) {
      portNo = portNo.substr(idx + 1);
    }
    return portNo;
  }
}