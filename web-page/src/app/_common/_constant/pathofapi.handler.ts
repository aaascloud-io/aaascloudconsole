

export class PathofpfWeb {

}

export class PathofDevice {
    // 事前定義デバイス登録-----------------------------------------------------------------------------------------------
    // static PATH_DEVICE_ADD:string  = "http://47.74.9.33:8081/deviceDef/add";//TODO サーバー環境
    // static PATH_DEVICE_ADD:string  = "http://localhost:8081/deviceDef/add";//TODO ロッカル環境
    static PATH_DEVICE_ADD:string  = "https://demo.trackun.jp/bs/deviceDef/add";
    // --------------------------------------------------------------------------------------------------------
    
    // 事前定義デバイス詳細検索-----------------------------------------------------------------------------------------------
    // static PATH_DEVICE_DETAIL:string  ="http://47.74.9.33:8081/deviceDef/detail/"; //TODOサーバー環境
    // static PATH_DEVICE_DETAIL:string = "http://localhost:8081/deviceDef/detail/"; //ロッカル環境
    static PATH_DEVICE_DETAIL:string = "https://demo.trackun.jp/bs/deviceDef/detail/";
    // --------------------------------------------------------------------------------------------------------
    
    // 事前定義デバイス詳細検索-----------------------------------------------------------------------------------------------
    // static PATH_DEVICE_iccid_CHECK:string  ="http://47.74.9.33:8081/deviceDef/checkDeviceByiccid/"; //TODOサーバー環境
    // static PATH_DEVICE_iccid_CHECK:string = "http://localhost:8081/deviceDef/checkDeviceByiccid/"; //ロッカル環境
    static PATH_DEVICE_iccid_CHECK:string = "https://demo.trackun.jp/bs/deviceDef/checkDeviceByiccid/";
    // --------------------------------------------------------------------------------------------------------
    
    // 事前定義デバイス詳細更新-----------------------------------------------------------------------------------------------
    // static PATH_DEVICE_UPDATE:string   ="http://47.74.9.33:8081/deviceDef/update/"; //TODOサーバー環境
    // static PATH_DEVICE_UPDATE:string  = "http://localhost:8081/deviceDef/update/"; //ロッカル環境
    static PATH_DEVICE_UPDATE:string  = "https://demo.trackun.jp/bs/deviceDef/update/";
    // --------------------------------------------------------------------------------------------------------

    // 事前定義デバイス削除-----------------------------------------------------------------------------------------------
    // static PATH_DEVICE_DELETE:string  ="http://47.74.9.33:8081/deviceDef/remove/"; //TODOサーバー環境
    // static PATH_DEVICE_DELETE:string  = "http://localhost:8081/deviceDef/remove/"; //ロッカル環境
    static PATH_DEVICE_DELETE:string  = "https://demo.trackun.jp/bs/deviceDef/remove/";
    // --------------------------------------------------------------------------------------------------------

    // 事前定義デバイスリスト-----------------------------------------------------------------------------------------------
    // static PATH_DEVICE_LIST:string  ="http://47.74.9.33:8081/deviceDef/list/"; //TODOサーバー環境
    // static PATH_DEVICE_LIST:string = "http://localhost:8081/deviceDef/list/"; //ロッカル環境
    static PATH_DEVICE_LIST:string = "https://demo.trackun.jp/bs/deviceDef/list/"; //ロッカル環境
    // --------------------------------------------------------------------------------------------------------

    // 事前定義デバイスリストby productId or groupId-----------------------------------------------------------------------------------------------
    // static PATH_DEVICE_LIST_PG:string  ="http://47.74.9.33:8081/deviceDef/listPG/"; //TODOサーバー環境
    // static PATH_DEVICE_LIST_PG:string = "http://localhost:8081/deviceDef/listPG/"; //ロッカル環境
    static PATH_DEVICE_LIST_PG:string = "https://demo.trackun.jp/bs/deviceDef/listPG/"; //ロッカル環境
    // --------------------------------------------------------------------------------------------------------

    // デバイスband後デバイスstatusリスト-----------------------------------------------------------------------------------------------
    // static PATH_DEVICE_BAND_STATUS_LIST:string ="http://47.74.9.33:8080/devices"; //TODOサーバー環境
    // static PATH_DEVICE_BAND_STATUS_LIST:string = "http://localhost:8082/devices"; //ロッカル環境 
    static PATH_DEVICE_BAND_STATUS_LIST:string = "https://demo.trackun.jp/iotPF/devices";
    // --------------------------------------------------------------------------------------------------------

}


