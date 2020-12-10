import { Component, OnInit, Injector } from '@angular/core';
import * as XLSX from 'xlsx';

import { bottom_flyIn } from '@common/_animations/bottom_flyIn';
import { UserInfo } from '@common/_interface/userInfo';
import { Logger } from '@utils/logger';
import { DataFatoryService } from '@service/DataFatoryService';
import { UserService } from '@service/UserService';
import { DeviceService } from '@service/DeviceService';
import { AbstractComponent } from '@sub/abstract/abstract.component';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  animations: [bottom_flyIn]
})
export class CreateComponent extends AbstractComponent implements OnInit {

  constructor(
    protected injector: Injector,
    private dataFatoryService: DataFatoryService,
    private userService: UserService,
    private deviceService: DeviceService
  ) {
    super(injector);
  }

  ///@Output()
  ///public pagination: Pagination = Pagination.defaultPagination;

  /** 画面モデル */
  protected pageModel = {
    // バージョンリスト
    ///vers: [],
    ///myVar: '/main/page/version',

    ///myVarName: '「バージョン管理」',

    ///プルダウン用ユーザー一覧
    users: [],

    // リスト画面から、チェックデバイス存在用
    ///deviceList: [],

    // 用途リストmysqlから
    ///deviceUse: [],

    // モジュールリストmysqlから
    ///deviceModel: [],

    // デバイス情報画面とloginユーザーから
    device: {
      // version: '',
      imei: '',
      iccid: '',
      imsi: '',
      uid: '',
      securityMode: '0',
      SecurityModeType: '',
      psk: '',
      serverHost: '',
      serverPort: '',
      isBind: '0',
      BindFlag: '',
    },

    // 一括登録のデバイス定義リスト
    addList: [],

    // ユーザーリスト表示用
    ///使ってないっぽい
    ///userList: [],

    // 所属プロダクト画面表示用;
    ///products: [],

    // 所属group表示用
    ///groups: [],

    // 
    dataAll: [],
    ///getListFromExcel: '',

    ///pageNumber: 1,
    ///pageSize: 10,
    ///checkList: []

  }
  ///loginuser: loginUser



  ngOnInit() {
    Logger.debug(this, `component initialized.`);

    // this.dataFatoryService.setPageFlg('version');

    //リスト画面から、チェックデバイス存在用
    ///this.pageModel.deviceList = this.routeInfo.snapshot.queryParams["deviceList"];

    // ユーザー情報を取得する
    ///this.loginuser = JSON.parse(this.cookieService.get(ConstantsHandler.GLOBAL_TOKEN.id));
    ///this.loginuser = this.dataFatoryService.getLoginUser();

    // ユーザーリストを取得する
    // await this.getUserListApi(this.loginuser.role, this.loginuser.uid);

    // バージョン一覧を取得
    // await this.getVerList();

    ///ユーザー(所有者)一覧取得
    this.getUserList();
  }

  /**
   * ユーザー一覧照会
   * 
   */
  private async getUserList() {
    try {
      var res = await this.userService.getUsers({}).toPromise();
      this.pageModel.users = res.users;
    } catch (err) {
      super.handleError('照会失敗', err);
    }
    /*
    var obj = this;
    this.httpService.executeGet(ConstantsHandler.server + "/user/getIdName", "", function (res) {
      obj.pageModel.searchUserList = res["userIdNameMap"];
    });
    return obj;
    */
  }

  /**
   * 所属ユーザーradiochange
   */
  // usersChange($event, uid, role) {
  //   this.pageModel.addBuffer.uid = uid; //所属ユーザー
  //   // this.httpService.usePost('login/getProductsByUid', { "uid": this.loginuser.uid }).then(item => {
  //   this.httpService.usePost('product/getProductList', { "makeruid": uid, "role": role }).then(item => {
  //     try {
  //       let jsonItem = typeof item == 'string' ? JSON.parse(item) : item;
  //       this.pageModel.products = jsonItem.productList;// プロダクトリストを取得する
  //     } catch (e) {
  //       console.log('httpService エラー　発生しました。');
  //     }
  //   })
  // }

  // setUsername(uid: any) {
  //   // data process
  //   this.pageModel.addBuffer.username = uid;
  // }

  /**
   * デバイス登録(画面より)
   * 
   */
  protected async registry() {
    ///入力チェック
    var flg = this.checkParameters(this.pageModel.device);
    if (flg) {
      try {
        ///登録実施
        var res = await this.deviceService.addDevice(this.pageModel.device).toPromise();
        if (res.successCount === 1) {
          this.alert.success('操作成功');
        } else {
          this.handleError('操作失敗', null);
        }
      } catch (err) {
        this.handleError('操作失敗', err);
      }
    }

    /*
    var obj = this;
    this.httpService.UsePutForRealPath(
      ConstantsHandler.server + "/deviceDefinition/adminBatchAdd",
      { "list": this.pageModel.addList }
    ).then(function (res) {
      obj.onSuccess(obj, "registry");
    }).catch(function (error) {
      if (error.status == 200) {
        obj.onSuccess(obj, "registry");
      } else {
        obj.onError(obj, error);
      }
    });
    */
  }

  private checkParameters(device: any) {
    var result = true;
    if (!device.imei) {
      ///this.alertService.danger("デバイスIDは必須項目です。操作失敗しました");
      this.alert.warning('IMEIは必須項目です。');
      ///return false;
      result = false;
    }
    if (!device.iccid) {
      ///this.alertService.danger("通信iccidは必須項目です。操作失敗しました。");
      this.alert.warning('ICCIDは必須項目です。');
      ///return false;
      result = false;
    }
    if (!device.uid) {
      this.alert.warning('所有者は必須項目です。');
      result = false;
    }
    /*
    if (this.checkImei(this.pageModel.addBuffer.imei)) {
      this.alertService.danger("デバイスは既に存在です。操作失敗しました。");
      return false;
    }
    */

    // チェック成功のデバイスをaddListに追加
    ///this.pageModel.addList.push(this.pageModel.addBuffer);

    ///return true;
    return result;
  }

  // if length > 0=>NG,or OK, Check One
  /*
  private checkImei(data: any) {
    var obj = this;
    this.httpService.executeGet(ConstantsHandler.server + "/deviceDefinition/adminList",
      { pageSize: this.pageModel.pageSize, pageNumber: this.pageModel.pageNumber, imei: data }, function (res) {
        obj.pageModel.deviceList = res["list"];
      });
    if (obj.pageModel.deviceList.length > 0) {
      return true;
    }
    return false;
  }
  */

  /*
  private onSuccess(obj: any, event: string) {
    obj.alertService.danger("操作成功");
    if (event == "registry") {
      obj.pageModel.addBuffer.imei = "";
      obj.pageModel.addBuffer.devicename = "";
      obj.pageModel.addBuffer.iccid = "";
      obj.pageModel.addBuffer.imsi = "";
      obj.pageModel.addBuffer.uid = "";
      obj.pageModel.addBuffer.securityMode = "";
      // obj.pageModel.addBuffer.SecurityModeType = "";
      obj.pageModel.addBuffer.psk = "";
      obj.pageModel.addBuffer.serverHost = "";
      obj.pageModel.addBuffer.serverPort = "";
      obj.pageModel.addBuffer.isBind = "";
      //obj.pageModel.addBuffer.BindFlag = "";
      obj.pageModel.addList = [];
    } else if (event == "config") {
      obj.pageModel.configBuffer = {
        imei: "",
        report: 180
      };
    }
  }
  private onError(obj: this, error: any) {
    obj.alertService.danger("操作失敗:" + error.error.errorMessage);
  }
  */
  
  /**
   * 所属プロダクトradiochange
   * @param プロダクトID
   */
  // productsChange(e, productid: any) {
  //   this.pageModel.addBuffer.productid = productid;
  //   this.httpService.usePost('login/getGroupsByUidAndPid', { "uid": this.loginuser.uid, "productid": productid }).then(item => {
  //     try {
  //       let jsonItem = typeof item == 'string' ? JSON.parse(item) : item;
  //       this.pageModel.groups = jsonItem.groups;
  //     } catch (e) {
  //       console.log('httpService エラー　発生しました。');
  //     }
  //   })
  // }


  /**
   * 所属プグループradiochange
   * @param グループトID
   */
  // groupsChange($e, groupid: any) {
  //   this.pageModel.addBuffer.groupid = groupid;
  //   console.log($e.target.checked)
  // }

  /**
   * 登録ユーザー所属ユーザー一覧を取得
   */
  /*
  async getUserListApi(role: any, createdid: any) {
    this.pagination.currentPage = 1;
    await this.httpService.usePost('login/getUserList', { "role": role, "createdid": createdid }).then(item => {
      try {
        if (item.result) {
          let jsonItem = typeof item == 'string' ? JSON.parse(item) : item;
          this.initList(jsonItem.userList);

          this.pagination.changePage = (() => {
            this.initList(jsonItem.userList);
          });
        } else {
          console.log('httpService エラー　発生しました。');
        }
      } catch (e) {
        console.log('httpService エラー　発生しました。');
      }
    })
  }
  */

  /**
   * バージョン一覧を取得
   */
  /*
  async getVerList() {
    this.pagination.currentPage = 1;
    await this.httpService.usePost('version/getVersions', {}).then(item => {
      try {
        if (item.result) {
          let jsonItem = typeof item == 'string' ? JSON.parse(item) : item;
          this.pageModel.vers = jsonItem.versions
        } else {
          console.log('httpService エラー　発生しました。');
        }
      } catch (e) {
        console.log('httpService エラー　発生しました。');
      }
    })
  }
  */

  /*
  private initList(res: any): void {
    this.pageModel.userList = [];
    let page = this.pagination.currentPage - 1;
    this.pagination.totalItems = res.length;
    let head = page * this.pagination.pageItems;
    let end = head + this.pagination.pageItems - 1;
    res.slice(head, end).forEach(element => {
      if (element.role === "0") {
        element.roleName = 'スーパーユーザー';
        // } else if (element.role === this.loginuser.role) {
        //   element.roleName = '管理ユーザー';
      } else {
        element.roleName = '一般ユーザー';
      }
      this.pageModel.userList.push(element);
    });
  }
  */

  /**
   * 一括登録用サンプルのダウンロード(画面より)
   * 
   */
  protected downloadSampleFiles() {
    let link = document.createElement("a");
    link.download = "deviceInsert.xlsx";
    link.href = "assets/deviceInsert.xlsx";
    link.click();
  }

  /**
   * 一括登録用ファイルのロード(画面より)
   * 
   * @param event 
   */
  protected async changeTarget(event) {
    var obj = this;
    var file = event.target.files[0];
    Logger.info(this, `got target file. name:[${file.name}]`);
    if (file) {
      var reader = new FileReader();
      reader.onload = (event) => {
        const data = reader.result;
        var workBook = XLSX.read(data, { type: 'binary' });
        var jsonData = workBook.SheetNames.reduce((initial, name) => {
          const sheet = workBook.Sheets[name];
          initial[name] = XLSX.utils.sheet_to_json(sheet);
          return initial;
        }, {});
        this.pageModel.dataAll = jsonData['rawData'];
        Logger.info(this, `loaded. size:[${this.pageModel.dataAll.length}]`);
      }
      reader.onerror = (event) => {
        obj.alert.danger("ファイル読み込み失敗しました");
      }
      ///読み込み実施
      reader.readAsBinaryString(file);
    }
  }

  /**
   * 一度ロードしたファイルのクリア(画面より)
   * 
   * @param event 
   */
  protected clearTarget(event) {
    event.target.value = '';
  }

  /**
   * デバイス登録(一括) (画面より)
   * 
   */
  protected async registryAll() {
    var flg = true;
    ///入力チェック
    for (var device of this.pageModel.dataAll) {
      var tmp = this.checkParameters(device);
      if (!tmp) {
        flg = false;
      }
    }
    if (this.pageModel.dataAll.length === 0) {
      this.alert.warning('データが登録されていません。');
      flg = false;
    }
    if (flg) {
      try {
        ///登録実施
        var res = await this.deviceService.addDevices(this.pageModel.dataAll).toPromise();
        if (res.failCount === 0) {
          this.alert.success('操作成功');
        } else {
          this.handleError('一部操作失敗', new Error(`imeis:[${res.failImeis}]`));
        }
      } catch (err) {
        this.handleError('操作失敗', err);
      }
    }
  }
}
