import { Component, OnInit } from '@angular/core';
import { bottom_flyIn } from 'src/app/_common/_animations/bottom_flyIn';
import { HttpService } from 'src/app/_shareModule/service/HttpService';
import { DataFatoryService } from 'src/app/_shareModule/service/DataFatoryService';
import { ActivatedRoute } from "@angular/router";
import { LoginInfo } from 'src/app/_common/_interface/userInfo';

@Component({
  selector: 'app-modify',
  templateUrl: './modify.component.html',
  styleUrls: ['./modify.component.css'],
  animations: [bottom_flyIn]
})
export class ModifyComponent implements OnInit {

  loginInfo: LoginInfo
  private pageModel = {
    password: '',
    company: '',
    address: '',
    mail: '',
    tel: '',
    prodects: [],//所属プロダクト画面表示用;
    prodectIds: [],//所属プロダクト画面選択用;
    group_success: false,//group表示フラグ
    groups: [],//所属group表示用
    groupIds: [],//所属group画面選択用;
    update_success: false,//登録成功表示フラグ
    update_danger: false,//登録失敗表示フラグ
  }

  constructor(private httpService: HttpService, private routeInfo: ActivatedRoute, private dataFatoryService: DataFatoryService) { }

  ngOnInit() {
    // ユーザー情報を取得する
    this.loginInfo = this.dataFatoryService.getLoginUser();
    // uid⇒リスト中に選択されたのユーザー(ユーザー詳細検索)
    this.httpService.usePost('login/getUserInfo', { "uid": this.routeInfo.snapshot.queryParams["uid"] }).then(item => {
      try {
        let jsonItem = typeof item == 'string' ? JSON.parse(item) : item;
        this.pageModel.company = jsonItem.userInfo.company;
        this.pageModel.address = jsonItem.userInfo.address;
        this.pageModel.mail = jsonItem.userInfo.mail;
        this.pageModel.tel = jsonItem.userInfo.tel;

        // プロダクト検索
        this.httpService.usePost('login/getProductsByUid', { "loginuserid": this.loginInfo.loginuserid }).then(itemP => {
          try {
            let jsonItemP = typeof itemP == 'string' ? JSON.parse(itemP) : itemP;

            //  初期自動チェックボックスを選択グループ検索用
            let productid = [];

            // 作成者uid通りまとめてプロダクト
            jsonItemP.products.forEach((elementAll) => {

              // 詳細ユーザリストuid通り所属プロダクトid
              JSON.parse(jsonItem.userInfo.productid).forEach((elementid) => {
                if (Number(elementAll.productid) === elementid) {
                  // チェックボックスを選択
                  elementAll.checked = true;
                  productid.push(elementid);
                }
              });

              // チェックボックスを編集した画面表示
              this.pageModel.prodects.push(elementAll)
            });
            // グループ検索
            this.httpService.usePost('login/getGroupsByUidAndPid', { "uid": this.loginInfo.loginuserid, "productid": productid[0] }).then(itemG => {
              try {
                let jsonItemG = typeof itemG == 'string' ? JSON.parse(itemG) : itemG;

                // 作成者uid通りまとめてグループ
                jsonItemG.groups.forEach((elementAll) => {

                  // 詳細ユーザリストuid通り所属プロダクトid
                  JSON.parse(jsonItem.userInfo.groupid).forEach((elementid) => {
                    if (Number(elementAll.groupid) === elementid) {
                      // チェックボックスを選択
                      elementAll.checked = true;
                    }
                  });
                  // チェックボックスを編集した画面表示
                  this.pageModel.groups.push(elementAll)
                });
              } catch (e) {
                console.log('httpService エラー　発生しました。');
              }
            })
          } catch (e) {
            console.log('httpService エラー　発生しました。');
          }
        })
      } catch (e) {
        console.log('httpService エラー　発生しました。');
      }
    })
  }

  update() {
    let reqParam = {

      uid: this.routeInfo.snapshot.queryParams["uid"],//uid⇒リスト中に選択されたのユーザー

      password: this.pageModel.password,

      company: this.pageModel.company,

      address: this.pageModel.address,

      mail: this.pageModel.mail,

      tel: this.pageModel.tel,

      productid: this.pageModel.prodectIds,

      groupid: this.pageModel.groupIds,

    }
    // (ユーザー更新)
    this.httpService.usePost('login/updateUser', reqParam).then(item => {
      try {
        this.pageModel.update_success = false;
        this.pageModel.update_danger = false;
        let jsonItem = typeof item == 'string' ? JSON.parse(item) : item;
        if (jsonItem.result) {
          this.pageModel.update_success = true;

        } else {
          this.pageModel.update_danger = true;
        }
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
    this.httpService.usePost('login/getGroupsByUidAndPid', { "loginuserid": this.loginInfo.loginuserid, "productid": productid }).then(item => {
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


}
