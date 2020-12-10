import { Component, OnInit } from '@angular/core';
import { bottom_flyIn } from "../../../../../_common/_animations/bottom_flyIn";
import { HttpService } from 'src/app/_shareModule/service/HttpService';
import { UserInfo } from 'src/app/_common/_interface/userInfo';
import { ConstantsHandler } from 'src/app/_common/_constant/constants.handler';
import { CookieService } from 'ngx-cookie-service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  animations: [bottom_flyIn]
})
export class CreateComponent implements OnInit {
  pageModel = {
    product: {
      productname: '',
      industrytype: '',
      application: '',
      location: '',
      summary: '',
      makeruid: 0
    },
    insert_success: false,
    group: {
      productid: '',
      groupname: ''
    },
    group_insert_success: false,
  }
  userInfo: UserInfo;
  constructor(private httpService: HttpService, private cookieService: CookieService, private _flashMessagesService: FlashMessagesService) { }

  ngOnInit() {
    // ユーザー情報を取得する
    this.userInfo = JSON.parse(this.cookieService.get(ConstantsHandler.GLOBAL_TOKEN.id));

    // 作成者取得
    this.pageModel.product.makeruid = this.userInfo.userid
  }


  /**
  * プロダクトを登録する
  */
  insert() {
    // parameter check
    if (!this.checkParameters()) {
      return;
    }
    this.getInsertProductApi(this.pageModel.product);
  }
  /**
  * プロダクトを登録するAPI
  */
  private getInsertProductApi(product: any): void {
    let paramReq = {
      productname: product.productname,//プロダクト名
      industrytype: product.industrytype,//産業種類
      application: product.application,// 用途
      location: product.location,//所在地
      summary: product.summary,//概要
      makeruid: this.userInfo.userid//作成者
    }
    this.httpService.usePost('product/insertProduct', paramReq).then(item => {
      try {
        if (item.result) {
          this.pageModel.insert_success = true;
          this.pageModel.group.productid = item.insertProductid// グループ登録用プロダクトid
        } else {
          this.pageModel.insert_success = false;
        }
      } catch (e) {
        console.log('プロダクトを登録するAPI エラー　発生しました。');
      }
    })
  }
  /**
  * グループを登録するAPI
  */
  insertGroup(): void {
    // parameter check
    if (!this.checkGroupParameters()) {
      return;
    }
    let paramReq = {
      productid: this.pageModel.group.productid,//プロダクトid
      makeruid: this.userInfo.userid,//作成者
      groupidname: this.pageModel.group.groupname,// グループ名
    }
    this.httpService.usePost('product/insertGroup', paramReq).then(item => {
      try {
        if (item.result) {
          this.pageModel.group_insert_success = true;
        } else {
          this.pageModel.group_insert_success = false;
        }
      } catch (e) {
        console.log('グループを登録するAPI エラー　発生しました。');
      }
    })
  }
  private checkParameters(): Boolean {
    if (this.pageModel.product.productname == '') {
      this._flashMessagesService.show("プロダクト名は必須項目です。操作失敗しました。", { cssClass: 'alert-danger', timeout: 10000 });
      return false;
    }
    return true;
  }
  private checkGroupParameters(): Boolean {
    if (this.pageModel.group.groupname == '') {
      this._flashMessagesService.show("グループ名は必須項目です。操作失敗しました。", { cssClass: 'alert-danger', timeout: 10000 });
      return false;
    }
    return true;
  }

}
