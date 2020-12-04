
import { Component, OnInit, Injector } from '@angular/core';

import { bottom_flyIn } from '@common/_animations/bottom_flyIn';
import { DateUtils} from '@utils/date-utils';
import { UserService } from '@service/UserService';
import { DeviceService } from '@service/DeviceService';
import { AbstractComponent } from '@sub/abstract/abstract.component';


@Component({
  selector: 'app-modify',
  templateUrl: './modify.component.html',
  styleUrls: ['./modify.component.css'],
  animations: [bottom_flyIn]
})
export class ModifyComponent extends AbstractComponent implements OnInit {

  /** 画面モデル */
  protected pageModel = {
    ///デバイス
    device: {
      exists: false,
      imei: '',
      iccid: '',
      imsi: '',
      uid: '',
      devicename: '',
      firmwareVersion: '',
      newestVersionConfirmTime: '',
      v_newestVersionConfirmTime: ''
    },
    ///ユーザーリスト
    users: [],
  }

  constructor(
    protected injector: Injector,
    private userService: UserService,
    private deviceService: DeviceService
  ) {
    super(injector);
  }

  ngOnInit() {
    this.pageModel.device.imei = this.route.snapshot.queryParams['imei'];
    this.pageModel.device.uid = this.route.snapshot.queryParams['uid'];
    this.pageModel.device.iccid = this.route.snapshot.queryParams['iccid'];
    ///修正対象のデバイス情報取得
    this.getDevice();
    ///ユーザー(所有者)一覧取得
    this.getUsers();
  }

  /**
   * ユーザー(所有者)一覧取得
   * 
   */
  private async getUsers() {
    try {
      var res = await this.userService.getUsers({}).toPromise();
      this.pageModel.users = res.users;
    } catch (err) {
      this.handleError('照会失敗', err);
    }

    /*
    var obj = this;
    this.httpService.executeGet(ConstantsHandler.server + "/user/getIdName", "",
      function (res) {
        obj.pageModel.userList = res["userIdNameMap"];
        for (var item in obj.pageModel.userList) {
          if (item == obj.pageModel.device.uid) {
            obj.pageModel.nameValue = obj.pageModel.userList[item];
            console.log(obj.pageModel.nameValue);
          }
        }

      });
    return obj;
    */
  }

  /**
   * デバイス情報取得
   * 
   */
  private async getDevice() {
    var query = {
      pageSize: 1,
      pageNumber: 1,
      imei: this.pageModel.device.imei,
      uid: this.pageModel.device.uid
    };
    try {
      var res = await this.deviceService.getDeviceBindings(query).toPromise();
      if (res.list && 0 < res.list.length) { 
        this.pageModel.device = res.list[0];
        if (this.pageModel.device.newestVersionConfirmTime) {
          this.pageModel.device.v_newestVersionConfirmTime = DateUtils.format2(
            this.pageModel.device.newestVersionConfirmTime, 
            'yyyy-MM-dd HH:mm:ss'
          );
        }
        this.pageModel.device.exists = true;
        ///TODO 今だけ
        console.log(this.pageModel.device);
      } else {
        this.alert.warning('バインド情報が見つかりません。修正は新規になります。');
      }
    } catch (err) {
      this.handleError('照会失敗', err);
    }

    /*
    var obj = this;
    this.httpService.executeGet(ConstantsHandler.server + "/deviceBinding/adminList",
      {
        pageSize: 1,
        pageNumber: 1,
        imei: this.pageModel.device.imei,
        uid: this.pageModel.device.uid
      }, function (res) {
        var device = res["list"][0];
        if (device != null) {
          obj.pageModel.device = device;
          obj.exists = true;
        } else {
          obj.alertService.warning("このデバイスにはバンディング情報が見つかりません。修正は新規になります。")
        }
        obj.getUserName();
      });
    */
  }

  /**
   * 保存(画面より)
   * 
   */
  protected createOrUpdate() {
    if (!this.pageModel.device.devicename) {
      this.pageModel.device.devicename = this.pageModel.device.imei;
      ///this.alertService.info("デバイス名は記入していないため、自動生成します（デバイスIDと同じ値になります）");
    }
    if (this.pageModel.device.exists) {
      this.update();
    } else {
      this.create();
    }
  }

  /**
   * デバイス情報作成
   * 
   * ※このパターンあるのか？
   */
  private async create() {
    var data = {
      list: [this.pageModel.device]
    };
    try {
      await this.deviceService.createDeviceBindings(data).toPromise();
      this.alert.info('操作成功');
      ///this.router.navigate(['../list']);
    } catch (err) {
      this.handleError('操作失敗', err);
    }

    /*
    var obj = this;
    let url = ConstantsHandler.server + "/deviceBinding/adminBatchBind";
    this.httpService.UsePutForRealPath(url, {
      list: [this.pageModel.device]
    }).then(function (res) {
      obj.alertService.info("更新成功");
    }).catch(function (res) {
      obj.alertService.danger("操作失敗");
    });
    */
  }

  /**
   * デバイス情報更新
   * 
   */
  private async update() {
    var data = {
      imei: this.pageModel.device.imei,
      devicename: this.pageModel.device.devicename
    };
    try {
      await this.deviceService.updateDeviceBindings(data).toPromise();
      this.alert.info('操作成功');
      ///this.router.navigate(['../list']);
    } catch (err) {
      this.handleError('操作失敗', err);
    }

    /*
    var obj = this;
    let url = ConstantsHandler.server + "/deviceBinding/adminModify";
    await this.httpService.UsePostForRealPath(url, {
      imei: this.pageModel.device.imei,
      devicename: this.pageModel.device.devicename
    }).then(function (res) {
      obj.alertService.info("更新成功");
    }).catch(function (res) {
      obj.alertService.danger("操作失敗");
    });
    */
  }
}
