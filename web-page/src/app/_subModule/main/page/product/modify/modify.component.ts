import { Component, OnInit, Output } from '@angular/core';
import { bottom_flyIn } from 'src/app/_common/_animations/bottom_flyIn';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/_shareModule/service/HttpService';
import { LoginInfo } from 'src/app/_common/_interface/userInfo';
import { ConstantsHandler } from 'src/app/_common/_constant/constants.handler';
import { CookieService } from 'ngx-cookie-service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Pagination } from '../../pagination/pagination';
import { DataFatoryService } from 'src/app/_shareModule/service/DataFatoryService';

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
      productname: '',
      model: '',
      version: '',
      simflag: 0,
      summary: '',
      makeruid: 0
    },
  }
  loginInfo: LoginInfo;


  constructor(private routerinfo: ActivatedRoute,
    private httpService: HttpService,
    private cookieService: CookieService,
    private _flashMessagesService: FlashMessagesService,
    private dataFatoryService: DataFatoryService) { }


  @Output()
  public pagination: Pagination = Pagination.defaultPagination;
  ngOnInit() {
    this.pagination.currentPage = 1;
    // ユーザー情報を取得する
    // this.loginuser = this.dataFatoryService.getLoginUser();
    // this.loginInfo = JSON.parse(this.cookieService.get(ConstantsHandler.GLOBAL_TOKEN.id));
    this.loginInfo = this.dataFatoryService.getLoginUser();

    // プロダクト更新用
    // this.pageModel.product.productid = this.routerinfo.snapshot.queryParams["productid"];

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
      productname: this.pageModel.product.productname,
      model: this.pageModel.product.model,
      version: this.pageModel.product.version,
      simflag: this.pageModel.product.simflag,
      summary: this.pageModel.product.summary,
      makeruid: 1,
      loginInfo: this.loginInfo
    }
    this.httpService.usePost('updateProduct', paramReq).then(item => {
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
    let paramReq = {
      productname: productid,
      loginInfo: this.loginInfo
    }
    this.httpService.usePost('getProductInfo', paramReq).then(item => {
      try {
        if (item.result) {
          let jsonItem = typeof item == 'string' ? JSON.parse(item) : item;
          this.pageModel.product = jsonItem.productInfo;

        } else {
          console.log('プロダクト詳細を検索API エラー　発生しました。');
        }
      } catch (e) {
        console.log('プロダクト詳細を検索API エラー　発生しました。');
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


  private initList(res: any): void {
    let page = this.pagination.currentPage - 1;
    this.pagination.totalItems = res.length;
    let head = page * this.pagination.pageItems;
    let end = head + this.pagination.pageItems - 1;
  }

}
