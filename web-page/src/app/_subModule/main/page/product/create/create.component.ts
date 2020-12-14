import { Component, OnInit } from '@angular/core';
import { bottom_flyIn } from "../../../../../_common/_animations/bottom_flyIn";
import { HttpService } from 'src/app/_shareModule/service/HttpService';
import { UserInfo, LoginInfo } from 'src/app/_common/_interface/userInfo';
import { ConstantsHandler } from 'src/app/_common/_constant/constants.handler';
import { CookieService } from 'ngx-cookie-service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { codes } from '@common/_utils/codes';
import { DataFatoryService } from 'src/app/_shareModule/service/DataFatoryService';


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
      model: '',
      version: '',
      simflag: 0,
      summary: '',
      makeruid: 0
    },
    insert_success: false,
    group: {
      productid: '',
      groupname: ''
    },
  }
  userInfo: UserInfo;
  loginInfo: LoginInfo;
  constructor(private httpService: HttpService,
    private cookieService: CookieService,
    private _flashMessagesService: FlashMessagesService,
    private dataFatoryService: DataFatoryService,
  ) { }

  ngOnInit() {
    // ユーザー情報を取得する
    // this.userInfo = JSON.parse(this.cookieService.get(ConstantsHandler.GLOBAL_TOKEN.id));
    this.loginInfo = this.dataFatoryService.getLoginUser();

    // 作成者取得
    // this.pageModel.product.makeruid = this.loginInfo.loginuserid;
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
      productname: product.productname,
      model: product.model,
      version: product.version,
      simflag: product.simflag,
      summary: product.summary,
      makeruid: 1,
      loginInfo: this.loginInfo
    }
    this.httpService.usePost('registerProduct', paramReq).then(item => {
      try {
        if (item.resultCode === codes.RETCODE.NORMAL) {
          this.pageModel.insert_success = true;
        } else {
          this.pageModel.insert_success = false;
        }
      } catch (e) {
        console.log('プロダクトを登録するAPI エラー　発生しました。');
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
