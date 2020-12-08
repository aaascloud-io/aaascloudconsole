import { Component, OnInit } from '@angular/core';
import { bottom_flyIn } from "src/app/_common/_animations/bottom_flyIn";
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

  userInfo: UserInfo
  private pageModel = {
    loginid: '',
    loginid_alert_success: false,
    loginid_alert_warning: false,
    loginid_alert_danger: false,
    password: '',
    password_alert_danger: false,
    passwordConfirm: '',
    passwordConfirm_alert_success: false,
    passwordConfirm_alert_warning: false,
    passwordConfirm_alert_danger: false,
    company: '',
    address: '',
    mail: '',
    tel: '',
    prodects: [],//所属プロダクト画面表示用;
    prodectIds: [],//所属プロダクト画面選択用;
    group_success: false,//group表示フラグ
    groups: [],//所属group表示用
    groupIds: [],//所属group画面選択用;
    registered_success: false,//登録成功表示フラグ
    registered_danger: false,//登録失敗表示フラグ
  }


  constructor(
    private httpService: HttpService,
    private cookieService: CookieService,
    private _flashMessagesService: FlashMessagesService) { }

  ngOnInit() {
    // ユーザー情報を取得する
    // this.userInfo = this.dataFatoryService.getuserInfo();
    this.userInfo = JSON.parse(this.cookieService.get(ConstantsHandler.GLOBAL_TOKEN.id));
    this.httpService.usePost('login/getProductsByUid', { "userid": this.userInfo.userid }).then(item => {
      try {
        let jsonItem = typeof item == 'string' ? JSON.parse(item) : item;
        this.pageModel.prodects = jsonItem.products;
      } catch (e) {
        console.log('httpService エラー　発生しました。');
      }
    })
  }


  /**
   * 所属プロダクトradiochange
   * @param プロダクトID
   */
  prodectsChange(e, productid: any) {
    if (e.target.checked) {
      this.pageModel.prodectIds.push(productid);
    } else {
      let index = this.pageModel.prodectIds.indexOf(productid, 0);
      if (index > -1) {
        this.pageModel.prodectIds.splice(index, 1);
      }
    }
    this.httpService.usePost('login/getGroupsByUidAndPid', { "uid": this.userInfo.userid, "productid": productid }).then(item => {
      try {
        let jsonItem = typeof item == 'string' ? JSON.parse(item) : item;
        this.pageModel.groups = jsonItem.groups;
        if (this.pageModel.groups.length > 0) {
          this.pageModel.group_success = true;
        } else {

          this.pageModel.group_success = false;
        }
      } catch (e) {
        console.log('httpService エラー　発生しました。');
      }
    })
  }


  /**
   * 所属プグループradiochange
   * @param グループトID
   */
  groupsChange(e, groupid: any) {

    if (e.target.checked) {
      this.pageModel.groupIds.push(groupid);
    } else {
      let index = this.pageModel.groupIds.indexOf(groupid, 0);
      if (index > -1) {
        this.pageModel.groupIds.splice(index, 1);
      }
    }
  }

  /**
   * ログインIDチェック
   */
  blurLonginid() {
    if (this.pageModel.loginid == '') {
      this.pageModel.loginid_alert_success = false;
      this.pageModel.loginid_alert_warning = true;
      this.pageModel.loginid_alert_danger = false;
    } else {
      // this.httpService.usePost('login/checkUserByLoginid', { "role": this.userInfo.role, "uid": this.userInfo.uid, "loginid": this.pageModel.loginid }).then(item => {
      //   try {
      //     let jsonItem = typeof item == 'string' ? JSON.parse(item) : item;
      //     let count: Number = jsonItem.count;
      //     if (count > 0) {
      //       this.pageModel.loginid_alert_success = false;
      //       this.pageModel.loginid_alert_warning = false;
      //       this.pageModel.loginid_alert_danger = true;
      //     } else {
      //       this.pageModel.loginid_alert_success = true;
      //       this.pageModel.loginid_alert_warning = false;
      //       this.pageModel.loginid_alert_danger = false;
      //     }
      //   } catch (e) {
      //     console.log('httpService エラー　発生しました。');
      //   }
      // })
    }
  }


  /**
   * ユーザー登録
   */
  registered() {
    // parameter check
    if (!this.checkParameters()) {
      return;
    }
    let reqParam = {

      loginid: this.pageModel.loginid,

      password: this.pageModel.password,

      company: this.pageModel.company,

      address: this.pageModel.address,

      mail: this.pageModel.mail,

      tel: this.pageModel.tel,

      // role: this.userInfo.role.toString(),

      createdid: this.userInfo.userid,  // 作成者⇒登録ユーザー

      productid: this.pageModel.prodectIds,

      groupid: this.pageModel.groupIds,

    }
    this.httpService.usePost('login/registeredUser', reqParam).then(item => {
      try {
        let jsonItem = typeof item == 'string' ? JSON.parse(item) : item;
        this.cleanRegFlg();
        if (jsonItem.result) {
          this.pageModel.registered_success = true;
        } else {
          this.pageModel.registered_danger = true;
        }
      } catch (e) {
        console.log('httpService エラー　発生しました。');
      }
    })
  }

  /**
   * パスワードnullチェック
   */
  blurPassword() {
    if (this.pageModel.password == '') {
      this.pageModel.password_alert_danger = true;
    } else {
      this.pageModel.password_alert_danger = false;
    }
  }


  /**
   * パスワード確認チェック
   */
  blurPasswordConfirm() {
    if (this.pageModel.passwordConfirm == '') {
      this.pageModel.passwordConfirm_alert_success = false;
      this.pageModel.passwordConfirm_alert_warning = false;
      this.pageModel.passwordConfirm_alert_danger = true;
    } else {
      if (this.pageModel.passwordConfirm != this.pageModel.password) {
        this.pageModel.passwordConfirm_alert_success = false;
        this.pageModel.passwordConfirm_alert_warning = true;
        this.pageModel.passwordConfirm_alert_danger = false;
      } else {
        this.pageModel.passwordConfirm_alert_success = true;
        this.pageModel.passwordConfirm_alert_warning = false;
        this.pageModel.passwordConfirm_alert_danger = false;
      }
    }
  }

  private cleanRegFlg() {
    this.pageModel.registered_success = false;
    this.pageModel.registered_danger = false;
  }




  private checkParameters(): Boolean {


    if (this.pageModel.loginid == '') {
      this._flashMessagesService.show("ログインIDは必須項目です。操作失敗しました。", { cssClass: 'alert-danger', timeout: 10000 });
      return false;

    } else {
      var obj = this;
      // this.httpService.usePost('login/checkUserByLoginid', { "role": this.userInfo.role, "uid": this.userInfo.uid, "loginid": this.pageModel.loginid }).then(item => {
      //   try {
      //     let jsonItem = typeof item == 'string' ? JSON.parse(item) : item;
      //     let count: Number = jsonItem.count;
      //     if (count > 0) {
      //       obj._flashMessagesService.show("ログインIDは存在する。操作失敗しました。", { cssClass: 'alert-danger', timeout: 10000 });
      //       return false;
      //     }
      //   } catch (e) {
      //     console.log('httpService エラー　発生しました。');
      //   }
      // })
    }
    if (this.pageModel.password === "") {
      this._flashMessagesService.show("パスワードは必須項目です。操作失敗しました。", { cssClass: 'alert-danger', timeout: 10000 });
      return false;
    }
    if (this.pageModel.passwordConfirm === "") {
      this._flashMessagesService.show("パスワード確認は必須項目です。操作失敗しました。", { cssClass: 'alert-danger', timeout: 10000 });
      return false;
    }
    return true;
  }
}
