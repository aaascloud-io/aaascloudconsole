import { Component, OnInit, Output } from '@angular/core';
import { HttpService } from 'src/app/_shareModule/service/HttpService';
import { AlertService } from 'ngx-alerts';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Pagination } from '../pagination/pagination';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-version',
  templateUrl: './version.component.html',
  styleUrls: ['./version.component.css'],
})
export class VersionComponent implements OnInit {
  // Wires up BlockUI instance
  @BlockUI() blockUI: NgBlockUI;

  pageModel = {
    // バージョンリスト
    vers: [],

    verNum: '',

    id: '',

    // 作成バージョンinfo
    addVerInfo: {
      ver_num: '',
      ver_des: ''
    },

    // 修正バージョンinfo
    editVerInfo: {
      ver_num: '',
      ver_des: ''
    },

    versionNumMap: {}
  }

  constructor(private httpService: HttpService, private alertService: AlertService) { }

  @Output()
  public pagination: Pagination = Pagination.defaultPagination;

  ngOnInit() {
    // this.blockUI.start('バージョン検索中です。少々お待ちください。');
    this.getListApi();
  }

  /**
   * バージョン登録メソッド
   */
  async registry() {
    let obj = this;
    obj.blockUI.start('バージョン登録中です。少々お待ちください。');
    // バージョン登録パラメータチェック
    if (await this.checkParam(obj)) {
      obj.blockUI.stop();
      return;
    }
    await obj.httpService.usePost('version/regVersion', {
      "vernum": this.pageModel.addVerInfo.ver_num,
      "verdes": this.pageModel.addVerInfo.ver_des
    }).then(item => {
      try {
        if (item.result) {
          this.getListApi();
          obj.blockUI.stop();
        } else {
          obj.blockUI.stop();
          obj.alertService.warning("バージョン登録失敗");
        }
      } catch (e) {
        console.log('version/regVersion httpService エラー　発生しました。');
      }
    })
  }

  /**
   * バージョン削除メソッド
   */
  async delVersion() {
    let obj = this;
    obj.blockUI.start('バージョン削除中です。少々お待ちください。');
    await obj.httpService.usePost('version/deleteVersion', {
      "vernum": this.pageModel.verNum
    }).then(item => {
      try {
        if (item.result) {
          this.getListApi();
          obj.blockUI.stop();
          obj.alertService.success(obj.pageModel.verNum + "バージョン削除成功");
        } else {
          obj.blockUI.stop();
          obj.alertService.warning(obj.pageModel.verNum + "バージョン削除失敗");
        }
      } catch (e) {
        console.log('version/deleteVersion httpService エラー　発生しました。');
      }
    })
  }

  async setUpdParam(id, verNum) {
    this.pageModel.id = '';
    this.pageModel.id = id;
    let obj = this;
    await obj.httpService.usePost('version/getVerInfo', { "vernum": verNum }).then(item => {
      try {
        if (item.result) {
          let jsonItem = typeof item == 'string' ? JSON.parse(item) : item;
          this.pageModel.editVerInfo.ver_num = jsonItem.versionInfo.vernum;
          this.pageModel.editVerInfo.ver_des = jsonItem.versionInfo.verdes;
        } else {
          obj.alertService.warning(verNum + "詳細検索失敗");
        }
      } catch (e) {
        console.log('version/getVerInfo httpService エラー　発生しました。');
      }
    })
  }
  async update() {
    let obj = this;
    obj.blockUI.start('バージョン更新中です。少々お待ちください。');
    if (obj.pageModel.editVerInfo.ver_num === '') {
      obj.blockUI.stop();
      obj.alertService.warning("バージョン番号を記入してください");
      return;
    }
    await obj.httpService.usePost('version/updateVersion', {
      "vernum": obj.pageModel.editVerInfo.ver_num,
      "verdes": obj.pageModel.editVerInfo.ver_des,
      "id": obj.pageModel.id
    }).then(item => {
      try {
        if (item.result) {
          obj.getListApi();
          obj.blockUI.stop();
          obj.alertService.success(this.pageModel.editVerInfo.ver_num + "バージョン更新成功");
        } else {
          obj.blockUI.stop();
          obj.alertService.warning(this.pageModel.editVerInfo.ver_num + "バージョン更新失敗");
        }
      } catch (e) {
        console.log('version/regVersion httpService エラー　発生しました。');
      }
    })

  }
  setUpdDelParam(verNum) {
    this.pageModel.verNum = '';
    this.pageModel.verNum = verNum;
  }
  /**
   * バージョン登録パラメータチェック
   */
  async checkParam(obj): Promise<boolean> {
    let flg = false;
    if (obj.pageModel.addVerInfo.ver_num === '') {
      obj.alertService.warning("バージョン番号を記入してください");
      flg = true;
    } else {
      await obj.httpService.usePost('version/checkVerByVernum', { "vernum": this.pageModel.addVerInfo.ver_num }).then(item => {
        try {
          if (item.result) {
            obj.alertService.warning("バージョン番号存在");
            flg = true;
          } else {
            flg = false;
          }
        } catch (e) {
          console.log('version/checkVerByVernum httpService エラー　発生しました。');
        }
      })
    }
    return flg;
  }

  async getListApi() {
    var url = "http://iotcloud-server.abupdate.com/statistics/deviceVersion/list";
    var param = {
      "pageNumber": 1,
      "pageSize": 10,
      "productId": 1568811799
    }
    var header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': "eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJZVUhPUEVAaS1mb2N1cy5jby5qcCIsInVzZXJJZCI6IjE2NjciLCJuYW1lIjoiWVVIT1BFQGktZm9jdXMuY28uanAiLCJleHAiOjE1ODE2NzkwNjB9.veG3ptzoQglF0HmZGU9_Tj2TiRgJb2roRTT1HCvNK4pNeSZgEj94JNLOYDkbJmPPKLI1fqNHpHCQsME72pDDknsURtHDP1XHQtFUm6RbullmMYcNIGOGEowFREPbFhtiblfyE8FuzYKzivzJnZt2oZ-w6JLgLdBXYXHai7d5ZIo"
      })
    };
    var versionNumMap = {};
    await this.httpService.post(url, param, header).then(item => {
      try {
        if (item.code == 200) {
          item.rows.forEach(element => {
            versionNumMap[element.version] = element.versionNum;
          });
          this.blockUI.stop();
        } else {
          this.blockUI.stop();
          this.alertService.warning("バージョン一覧を取得する失敗");
        }
      } catch (e) {
        console.log('version/getVersions httpService エラー　発生しました。');
      }
    });
    this.pageModel.versionNumMap = versionNumMap;
    url = "http://iotcloud-server.abupdate.com/upgrade/product/version/data/list";
    param = {
      "pageNumber": this.pagination.currentPage,
      "pageSize": this.pagination.pageItems,
      "productId": 1568811799
    }
    header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': "eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJZVUhPUEVAaS1mb2N1cy5jby5qcCIsInVzZXJJZCI6IjE2NjciLCJuYW1lIjoiWVVIT1BFQGktZm9jdXMuY28uanAiLCJleHAiOjE1ODE2NzkwNjB9.veG3ptzoQglF0HmZGU9_Tj2TiRgJb2roRTT1HCvNK4pNeSZgEj94JNLOYDkbJmPPKLI1fqNHpHCQsME72pDDknsURtHDP1XHQtFUm6RbullmMYcNIGOGEowFREPbFhtiblfyE8FuzYKzivzJnZt2oZ-w6JLgLdBXYXHai7d5ZIo"
      })
    };
    await this.httpService.post(url, param, header).then(item => {
      try {
        if (item.code == 200) {
          this.initList(item.total, item.rows);
          this.pagination.changePage = (() => {
            this.initList(item.total, item.rows);
          });
          this.blockUI.stop();
        } else {
          this.blockUI.stop();
          this.alertService.warning("バージョン一覧を取得する失敗");
        }
      } catch (e) {
        console.log('version/getVersions httpService エラー　発生しました。');
      }
    })
  }
  private initList(total: any, rows: any): void {
    this.pageModel.vers = [];
    let page = this.pagination.currentPage - 1;
    this.pagination.totalItems = total;
    let head = page * this.pagination.pageItems;
    let end = head + this.pagination.pageItems - 1;
    this.pageModel.vers = rows.slice(head, end);
  }

}
