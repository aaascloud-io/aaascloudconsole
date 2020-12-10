import { Component, OnInit, Output } from '@angular/core';
import { bottom_flyIn } from 'src/app/_common/_animations/bottom_flyIn';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/_shareModule/service/HttpService';
import { UserInfo } from 'src/app/_common/_interface/userInfo';
import { ConstantsHandler } from 'src/app/_common/_constant/constants.handler';
import { CookieService } from 'ngx-cookie-service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Pagination } from '../../pagination/pagination';

@Component({
  selector: 'app-modify',
  templateUrl: './modify.component.html',
  styleUrls: ['./modify.component.css'],
  animations: [bottom_flyIn]
})
export class ModifyComponent implements OnInit {
  pageModel = {
    update_success: false,
    product: {
      productid: '',
      groupid: '',
      productname: '',
      industrytype: '',
      application: '',
      location: '',
      summary: '',
      makeruid: ''
    },
    groups: [],//groups表示用
    group: {//groups入力用
      productid: '',//追加用
      groupid: '',//更新や削除用
      groupname: ''
    },
  }
  userInfo: UserInfo;


  constructor(private routerinfo: ActivatedRoute, private httpService: HttpService, private cookieService: CookieService, private _flashMessagesService: FlashMessagesService) { }


  @Output()
  public pagination: Pagination = Pagination.defaultPagination;
  ngOnInit() {
    this.pagination.currentPage = 1;
    // ユーザー情報を取得する
    // this.loginuser = this.dataFatoryService.getLoginUser();
    this.userInfo = JSON.parse(this.cookieService.get(ConstantsHandler.GLOBAL_TOKEN.id));

    // グループ追加用
    this.pageModel.group.productid = this.routerinfo.snapshot.queryParams["productid"];

    // プロダクト更新用
    this.pageModel.product.productid = this.routerinfo.snapshot.queryParams["productid"];

    // プロダクトIDをリスト画面から取得された
    this.getProductInfoApi(this.routerinfo.snapshot.queryParams["productid"])
  }

  /**
  * プロダクト更新
  */
  updateProduct() {
    // parameter check
    if (!this.checkParameters()) {
      return;
    }
    let paramReq = {
      productid: this.pageModel.product.productid,//プロダクトid
      productname: this.pageModel.product.productname,// プロダクト名
      industrytype: this.pageModel.product.industrytype,//産業種類
      application: this.pageModel.product.application,// 用途
      location: this.pageModel.product.location,//所在地
      summary: this.pageModel.product.summary,// 概要
    }
    this.httpService.usePost('product/updateProduct', paramReq).then(item => {
      try {
        if (item.result) {
          this.pageModel.update_success = true;
        }
      } catch (e) {
        console.log('グループ更新APIエラー　発生しました。');
      }
    })
  }


  /**
  * プロダクト詳細を検索API
  */
  private getProductInfoApi(productid: any): void {
    this.httpService.usePost('product/getProductInfo', { "productid": productid }).then(item => {
      try {
        if (item.result) {
          let jsonItem = typeof item == 'string' ? JSON.parse(item) : item;
          this.pageModel.product = jsonItem.productInfo;
          // グループリストを検索API
          this.selectGroupByProductId(productid);
        } else {
          console.log('プロダクト詳細を検索API エラー　発生しました。');
        }
      } catch (e) {
        console.log('プロダクト詳細を検索API エラー　発生しました。');
      }
    })
  }



  /**
  * グループ追加
  */
  addGroup() {
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
          // 追加後再検索
          this.selectGroupByProductId(this.pageModel.group.productid);
        }
      } catch (e) {
        console.log('グループを登録するAPI エラー　発生しました。');
      }
    })
  }

  /**
  * グループ更新前グループid通り詳細検索
  */
  selectGroupByGroupId(groupid: any) {

    // 選択されたグループidを設定する
    this.pageModel.group.groupid = groupid;

    // グループid通りグループ詳細検索API
    this.selectGroupInfoByGroupId(groupid);

  }

  /**
  * グループ削除前選択されたグループidを設定する
  */
  deleteGroupSetId(groupid: any) {

    // 選択されたグループidを設定する
    this.pageModel.group.groupid = groupid;
  }


  /**
  * グループ更新
  */
  updateGroup() {
    // parameter check
    if (!this.checkGroupParameters()) {
      return;
    }
    let paramReq = {
      groupid: this.pageModel.group.groupid,//プロダクトid
      groupidname: this.pageModel.group.groupname,// グループ名
    }
    this.httpService.usePost('product/updateGroup', paramReq).then(item => {
      try {
        if (item.result) {
          //更新後再検索
          this.selectGroupByProductId(this.pageModel.group.productid);
        }
      } catch (e) {
        console.log('グループを登録するAPI エラー　発生しました。');
      }
    })
  }
  /**
  * グループ削除
  */
  deleteGroup() {
    let paramReq = {
      groupid: this.pageModel.group.groupid//プロダクトid
    }
    this.httpService.usePost('product/deleteGroup', paramReq).then(item => {
      try {
        if (item.result) {
          //更新後再検索
          this.selectGroupByProductId(this.pageModel.group.productid);
        }
      } catch (e) {
        console.log('グループを登録するAPI エラー　発生しました。');
      }
    })
  }



  /**
  * プロダクトid通りグループリスト検索API
  */
  private selectGroupByProductId(productid: any) {
    // this.httpService.usePost('product/getGroupList', { "role":this.loginuser.role,"productid": productid }).then(itemG => {
    //   try {
    //     if (itemG.result) {
    //       let jsonItemG = typeof itemG == 'string' ? JSON.parse(itemG) : itemG;
    //       // this.pageModel.groups = jsonItemG.groupList;
    //       this.initList(jsonItemG.groupList)

    //       this.pagination.changePage = (() => {
    //         this.initList(jsonItemG.groupList);
    //       });
    //     } else {
    //       console.log('グループリストを検索API エラー　発生しました。');
    //     }
    //   } catch (e) {
    //     console.log('グループリストを検索API エラー　発生しました。');
    //   }
    // })
  }
  /**
  * グループid通りグループ詳細検索API
  */
  private selectGroupInfoByGroupId(groupid: any) {
    this.httpService.usePost('product/getGroupInfo', { "groupid": groupid }).then(itemG => {
      try {
        if (itemG.result) {
          let jsonItemG = typeof itemG == 'string' ? JSON.parse(itemG) : itemG;
          this.pageModel.group.groupname = jsonItemG.groupInfo.groupidname;
        } else {
          console.log('グループid通りグループ詳細検索API エラー　発生しました。');
        }
      } catch (e) {
        console.log('グループid通りグループ詳細検索API エラー　発生しました。');
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

  private initList(res: any): void {
    let page = this.pagination.currentPage - 1;
    this.pagination.totalItems = res.length;
    let head = page * this.pagination.pageItems;
    let end = head + this.pagination.pageItems - 1;
    this.pageModel.groups = res.slice(head, end);
  }

}
