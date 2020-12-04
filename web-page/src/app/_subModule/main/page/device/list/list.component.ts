import { Component, OnInit, Output, Injector, OnDestroy } from '@angular/core';
import { AlertService } from 'ngx-alerts';

import { Logger } from '@utils/logger';
import { bottom_flyIn } from '@common/_animations/bottom_flyIn';
import { DataFatoryService } from '@service/DataFatoryService';
import { UserService } from '@service/UserService';
import { DeviceService } from '@service/DeviceService';
import { AbstractComponent } from '@sub/abstract/abstract.component';
import { Pagination } from '@sub/main/page/pagination/pagination';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  animations: [bottom_flyIn]
})
export class ListComponent extends AbstractComponent implements OnInit, OnDestroy {

  /** １ページあたりの表示数 */
  public static SIZE_PER_PAGE: number = 10;
  
  /** 画面モデル */
  protected pageModel = {
    ///現在のページ
    current: 1,
    /*
    local: {
      uid: '',
      login_id: ''
    },
    */
    ///ユーザー
    users: [],
    ///検索条件に該当したデバイス
    matches: [],
    ///表示するデバイス(１ページ分)
    shows: [],

    //所属プロダクト画面表示用;
    ///products: [],

    //所属プロダクト選択Id;
    ///productId: '',

    //所属グループ画面表示用;
    ///groups: [],

    //所属グループ選択Id;
    ///groupId: '',

    // ユーザー属性(デフォルトは一般ユーザー)
    ///userFlg: false,

    ///selectedCheckBoxData: [],

    // 管理ユーザー時、ユーザー一覧
    ///superUserList: [],

    ///照会条件
    query: {
      imei: '',
      iccid: '',
      uid: ''
    },
    ///削除時のターゲット
    target: '',
  };

  /** Pagination部品 */
  @Output()
  protected pagination: Pagination = new Pagination(
    1,  ///ページ数
    this.pageModel.current, ///現在のページ
    0,  ///全データ数
    ListComponent.SIZE_PER_PAGE,  ///１ページのデータ数
    () => {}  ///ページ変更時に呼ばれるコールバック
  );

  /** 連続照会制御用タイムアウト */
  private queryTimeout: number;

  /** ローディングアイコン表示可否 */
  protected loading: boolean = false;

  constructor(
    protected injector: Injector,
    private alertService: AlertService,
    private dataFactoryService: DataFatoryService,
    private userService: UserService,
    private deviceService: DeviceService,
  ) {
    super(injector);
  }

  ngOnInit() {
    Logger.debug(this, `component initialized.`);

    var model = this.dataFactoryService.getPageModel('/main/page/device/list');
    if (model) this.pageModel = model;
    this.getUserList();
    this.getDeviceList();

    var obj = this;
    this.pagination.changePage = () => {
      Logger.detail(this, `page changed. [${obj.pageModel.current}→${obj.pagination.currentPage}]`);
      obj.pageModel.current = obj.pagination.currentPage;
      obj.refreshShows();
      obj.refreshPagenation();
    }
  }

  ngOnDestroy() {
    this.dataFactoryService.setPageModel('/main/page/device/list', this.pageModel);
  }

  /**
   * ユーザー一覧照会
   * 
   */
  private async getUserList() {
    try {
      this.pageModel.users = [];
      this.pageModel.users.push({ id: '', username: '' });
      var res = await this.userService.getUsers({}).toPromise();
      Array.prototype.push.apply(this.pageModel.users, res.users);
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
   * 照会条件変更(画面より)
   * 
   */
  protected onQueryChange() {
    ///連打制御
    this.queryTimeout = this.timeout.setTimeout(this.queryTimeout, () => {
      ///検索条件が変わったらページは1に戻す。
      this.pageModel.current = 1;
      ///照会実施
      this.getDeviceList();
      this.queryTimeout = null;
    }, 1000);
  }

  /**
   * デバイス照会(画面からも)
   * 
   */
  protected async getDeviceList() {
    this.loading = true;
    ///imei・iccidは曖昧検索したいので、一旦全て取得して、ローカルで選択する。
    var query = {
      pageSize: 99999,
      pageNumber: 1,
      uid: this.pageModel.query.uid
    };
    try {
      var res = await this.deviceService.getDeviceDefinitions(query).toPromise();
      this.refreshMatches(res.list);
      ///this.pageModel.current = 1;
      this.refreshShows();
      this.refreshPagenation();
    } catch (err) {
      super.handleError('照会失敗', err);
    }
    this.loading = false;
  }

  /**
   * 該当するデバイスの選択
   * 
   * @param all 
   */
  private refreshMatches(all: [any]) {
    this.pageModel.matches = [];
    var i = 0;
    for (var item of all) {
      var flg = true;
      if (this.pageModel.query.imei) {
        if (item.imei.indexOf(this.pageModel.query.imei) < 0) {
          flg = false;
        }
      }
      if (this.pageModel.query.iccid) {
        if (item.iccid.indexOf(this.pageModel.query.iccid) < 0) {
          flg = false;
        }
      }
      if (flg) {
        item.no = ++i;
        ///this.setStyle(item);
        this.pageModel.matches.push(item);
      }
    }
    Logger.detail(this, `matches refreshed. length:[${this.pageModel.matches.length}]`);
  }

  /**
   * 表示分(1ページ)の選択
   * 
   */
  private refreshShows() {
    this.pageModel.shows = [];
    var start = (this.pageModel.current - 1) * ListComponent.SIZE_PER_PAGE;
    var end = this.pageModel.current * ListComponent.SIZE_PER_PAGE;
    for (var i = start; i < end && i < this.pageModel.matches.length; i++) {
      this.pageModel.shows.push(this.pageModel.matches[i]);
    }
    Logger.detail(this, `shows refreshed. length:[${this.pageModel.shows.length}]`);
  }

  /**
   * Pagination更新
   * 
   */
  private refreshPagenation() {
    this.pagination.totalItems = this.pageModel.matches.length;
    this.pagination.pageLength = Math.ceil(this.pagination.totalItems / this.pagination.pageItems);
    this.pagination.currentPage = this.pageModel.current;
    Logger.detail(this, `pagenation refreshed. data:[${this.pagination.totalItems}] ` + 
      `pages:[${this.pagination.pageLength}] current:[${this.pageModel.current}]`);
  }

  /*
  private getDeviceDefinitionList() {
    var obj = this;
    this.httpService.executeGet(ConstantsHandler.server + "/deviceDefinition/adminList",
      { pageSize: this.pageModel.pageSize, pageNumber: this.pageModel.pageNumber }, function (res) {
        obj.pageModel.deviceList = res["list"];
        obj.pagination.currentPage = res["pageNumber"];
        obj.pagination.totalItems = res["total"];
        obj.pagination.pageLength = obj.pagination.totalItems / obj.pagination.pageItems;
        if (obj.pagination.totalItems % obj.pagination.pageItems > 0) {
          obj.pagination.pageLength += 1;
        }
      });
    return obj;
  }
  */

  /*
  private secondForm = {
    searchImei: "",
    searchIccid: "",
    searchId: ""
  };
  */

  /*
  private submit() {
    var obj = this;
    this.httpService.executeGet(ConstantsHandler.server + "/deviceDefinition/adminList",
      {
        pageSize: this.pageModel.pageSize, pageNumber: this.pageModel.pageNumber,
        imei: this.secondForm.searchImei, iccid: this.secondForm.searchIccid, uid: this.secondForm.searchId
      }, function (res) {
        obj.pageModel.deviceList = res["list"];
        console.log(obj.pageModel.deviceList.length)
        obj.pagination.currentPage = res["pageNumber"];
        obj.pagination.totalItems = res["total"];
        obj.pagination.pageLength = obj.pagination.totalItems / obj.pagination.pageItems;
        if (obj.pagination.totalItems % obj.pagination.pageItems > 0) {
          obj.pagination.pageLength += 1;
        }
      });
    return obj;
  }
  */

  /*
  private clearSearch() {
    var obj = this;
    this.httpService.executeGet(ConstantsHandler.server + "/deviceDefinition/adminList",
      { pageSize: this.pageModel.pageSize, pageNumber: this.pageModel.pageNumber }, function (res) {
        obj.pageModel.deviceList = res["list"];
        obj.pagination.currentPage = res["pageNumber"];
        obj.pagination.totalItems = res["total"];
        obj.pagination.pageLength = obj.pagination.totalItems / obj.pagination.pageItems;
        if (obj.pagination.totalItems % obj.pagination.pageItems > 0) {
          obj.pagination.pageLength += 1;
        }
      });
    return obj;
  }
  */

  /**
   * 管理ユーザーの場合、検索
   */
  // async getSuperDeviceStatusList(userList: any) {
  //   let devicelist: any = [];
  //   this.pageModel.deviceList = [];
  //   let def = {
  //     productid: '',
  //     productname: 'プロダクトを選択'
  //   }
  //   let devListOverFlg = false;

  //   for (let i = 0; i < userList.length; i++) {
  //     // 管理ユーザーの場合、ユーザー下全部予定義デバイス検索
  //     let url = PathofDevice.PATH_DEVICE_LIST + userList[i].uid;
  //     await this.httpService.UsePostForRealPath(url, {}).then(res => {
  //       for (let index = 0; index < res.length; index++) {
  //         const element = res[index];
  //         devicelist.push(element);
  //         if (index == res.length - 1) {
  //           devListOverFlg = true;
  //         }
  //       }
  //       if (devListOverFlg) {
  //         this.initList(devicelist);
  //         this.pagination.changePage = (() => {
  //           this.initList(devicelist);
  //         });
  //       }
  //     })
  //     // // 管理ユーザーの場合、ユーザー下全部Statusデバイス検索
  //     // await this.httpService.UsePostForRealPath(PathofDevice.PATH_DEVICE_BAND_STATUS_LIST, { uid: userList[i].uid }).then(resSur => {
  //     //   for (let sur in resSur) {
  //     //     this.pageModel.deviceListStatus[sur] = resSur[sur]
  //     //   }
  //     // })
  //     // 管理ユーザーの場合、ユーザー下全部プロダクトリスト検索
  //     await this.httpService.usePost('login/getProductsByUid', { "uid": userList[i].uid }).then(item => {
  //       let jsonItem = typeof item == 'string' ? JSON.parse(item) : item;
  //       if (jsonItem.products.length > 0) {
  //         if (!this.pageModel.products.includes(def)) {
  //           this.pageModel.products.push(def);
  //         }
  //       }
  //       jsonItem.products.forEach(element => {
  //         this.pageModel.products.push(element);
  //       });
  //     })

  //   }
  //   console.log("ユーザー下全部予定義デバイス", devicelist)
  //   console.log("ユーザー下全部プロダクトリスト", this.pageModel.products)
  // }

  /**
   * モーダル前の削除対象のセット(未使用)
   * 
   * @param item 削除対象
   */
  protected setTarget(item: any) {
    this.pageModel.target = item.imei;
  }

  private onSuccess(obj: any, event: string) {
    this.alertService.danger("操作成功");
    if (event == "success") {
      this.getDeviceList();
    } else if (event == "config") {
      obj.pageModel.configBuffer = {
        imei: "",
        report: 180
      };
    }
  }

  private onError(obj: this, error: any) {
    this.alertService.danger("操作失敗:" + error.errorMessage);
  }

  /*
  delete() {
    var obj = this;
    this.httpService.UseDeleteForRealPath(
      ConstantsHandler.server + "/deviceDefinition/adminBatchDelete",
      { deleteTargets: [this.pageModel.deleteImei] }
    ).then(function (res) {
      obj.onSuccess(obj, "success");
    }).catch(function (error) {
      if (error.status == 200) {
        obj.onSuccess(obj, "success");
      } else {
        obj.onError(obj, error);
      }
    });
  }
  */

  /*
  getParamByCheckBox(check: boolean, value: string) {
    this.pageModel.deleteImei = value
    if (check == true) {
      this.pageModel.selectedCheckBoxData.push(this.pageModel.deleteImei)
    } else {
      var index = this.pageModel.selectedCheckBoxData.indexOf(this.pageModel.deleteImei);
      this.pageModel.selectedCheckBoxData.splice(index, 1);
    }
  }
  */

  /**
   * 一括削除(画面より)
   * 
   */
  protected async delete() {
    var targets = [];
    for (var item of this.pageModel.shows) {
      if (item.removing) {
        targets.push(item.imei);
      }
    }
    if (0 < targets.length) {
      try {
        console.log(targets);
        ///TODO
        ///var res = this.deviceService.deleteDevices(targets).toPromise();
        this.alert.success('操作成功');
      } catch (err) {
        ///console.log(err);
        ///this.alert.danger(`操作失敗： ${err.status} ${err.statusText}`);
        this.handleError('操作失敗', err);
      }
    } else {
      this.alert.warning('選択データ無し');
    }
  }

  /*
  private initList(res: any): void {
    let page = this.pagination.currentPage - 1;
    this.pagination.totalItems = res.length;
    let head = page * this.pagination.pageItems;
    let end = head + this.pagination.pageItems - 1;
    this.pageModel.deviceList = res.slice(head, end);
  }
  */

  // プロダクト変更事件
  /*
  productsChange(event: any) {
    // 一般ユーザーの場合
    if (!this.pageModel.userFlg) {

      // デバイスリストを検索by　groupId
      let url = PathofDevice.PATH_DEVICE_LIST_PG + this.pageModel.local.uid + '/' + this.pageModel.productId;
      this.httpService.UsePostForRealPath(url, {}).then(res => {

        this.initList(res);

        this.pagination.changePage = (() => {
          this.initList(res);
        });

        // グループを検索して
        this.httpService.usePost('login/getGroupsByUidAndPid', { "uid": this.pageModel.local.uid, "productid": this.pageModel.productId }).then(item => {
          this.pageModel.groups = [];
          try {
            let jsonItem = typeof item == 'string' ? JSON.parse(item) : item;
            if (jsonItem.groups.length > 0) {
              let def = {
                groupid: '',
                groupidname: 'グループを選択'
              }
              this.pageModel.groups.push(def);
            }
            jsonItem.groups.forEach(element => {
              this.pageModel.groups.push(element);
            });
          } catch (e) {
            console.log('httpService グループを検索 エラー　発生しました。');
          }
        })
      }).catch(function (res) {
        console.log(res.error);
      });
      // 管理ユーザーの場合
    } else {
      this.productsChangeSuper();
    }
  }
  */

  // プロダクト変更事件
  /*
  async productsChangeSuper() {
    let devicelist: any = [];
    let devListOverFlg = false;
    let def = {
      groupid: '',
      groupidname: 'グループを選択'
    }
    let PreviousPid = '';
    for (let i = 0; i < this.pageModel.superUserList.length; i++) {
      // デバイスリストを検索by　productId
      let url = PathofDevice.PATH_DEVICE_LIST_PG + this.pageModel.superUserList[i].uid + '/' + this.pageModel.productId;
      await this.httpService.UsePostForRealPath(url, {}).then(res => {
        for (let index = 0; index < res.length; index++) {
          const element = res[index];
          devicelist.push(element);
          if (index == res.length - 1) {
            devListOverFlg = true;
          }
        }
        if (devListOverFlg) {
          this.initList(devicelist);
          this.pagination.changePage = (() => {
            this.initList(devicelist);
          });
        }
      })
      // グループを検索して
      await this.httpService.usePost('login/getGroupsByUidAndPid', { "uid": this.pageModel.superUserList[i].uid, "productid": this.pageModel.productId }).then(item => {
        console.log('uid', this.pageModel.superUserList[i].uid);
        console.log('productid', this.pageModel.productId);

        if (PreviousPid === "" || PreviousPid !== this.pageModel.productId) {
          this.pageModel.groups = [];
        }
        PreviousPid = this.pageModel.productId;
        try {
          let jsonItem = typeof item == 'string' ? JSON.parse(item) : item;
          if (jsonItem.groups.length > 0) {
            if (!this.pageModel.groups.includes(def)) {
              this.pageModel.groups.push(def);
            }
            jsonItem.groups.forEach(element => {
              let ddd = {
                groupid: element.groupid,
                groupidname: element.groupidname
              }
              if (!this.pageModel.groups.includes(ddd)) {
                this.pageModel.groups.push(ddd);
              }
            });
          }
        } catch (e) {
          console.log('httpService グループを検索 エラー　発生しました。');
        }
      })
    }
  }
  */

  // グループ変更事件
  /*
  groupsChange(event: any) {
    // 一般ユーザーの場合
    if (!this.pageModel.userFlg) {
      // デバイスリストを検索by　groupId
      let url = PathofDevice.PATH_DEVICE_LIST_PG + this.pageModel.local.uid + '/' + this.pageModel.productId + '/' + this.pageModel.groupId;
      this.httpService.UsePostForRealPath(url, {}).then(res => {

        this.initList(res);

        this.pagination.changePage = (() => {
          this.initList(res);
        });
      }).catch(function (res) {
        console.log(res.error);
      });
      // 管理ユーザーの場合
    } else {
      this.groupsChangeSuper();
    }
  }
  */

  /**
   * 管理ユーザーの場合、グループ変更事件
   */
  /*
  async groupsChangeSuper() {
    let devicelist: any = [];
    let devListOverFlg = false;
    for (let i = 0; i < this.pageModel.superUserList.length; i++) {
      let url = PathofDevice.PATH_DEVICE_LIST_PG + this.pageModel.superUserList[i].uid + '/' + this.pageModel.productId + '/' + this.pageModel.groupId;
      await this.httpService.UsePostForRealPath(url, {}).then(res => {
        for (let index = 0; index < res.length; index++) {
          const element = res[index];
          devicelist.push(element);
          if (index == res.length - 1) {
            devListOverFlg = true;
          }
        }
        if (devListOverFlg) {
          this.initList(devicelist);
          this.pagination.changePage = (() => {
            this.initList(devicelist);
          });
        }
      })
    }
  }
  */
}
