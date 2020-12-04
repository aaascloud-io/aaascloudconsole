import { Component, OnInit, Output } from '@angular/core';
import { bottom_flyIn } from 'src/app/_common/_animations/bottom_flyIn';
import { HttpService } from 'src/app/_shareModule/service/HttpService';
import { loginUser } from 'src/app/_common/_interface/userInfo';
import { ConstantsHandler } from 'src/app/_common/_constant/constants.handler';
import { CookieService } from 'ngx-cookie-service';
import { Pagination } from '../../pagination/pagination';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  animations: [bottom_flyIn]
})
export class ListComponent implements OnInit {

  constructor(private httpService: HttpService, private cookieService: CookieService) { }

  pageModel = {
    productid: '',
    productList: [
      {productid: '0000001', 
      productname: 'faceII',
      location: '東京',
      summary: '顔識別、温度検査',
    },
    ]
  }
  loginuser: loginUser

  @Output()
  public pagination: Pagination = Pagination.defaultPagination;
  // Wires up BlockUI instance
  @BlockUI() blockUI: NgBlockUI;
  ngOnInit() {
    // this.blockUI.start('プロダクト検索中です。少々お待ちください。');
    this.pagination.currentPage = 1;
    // ユーザー情報を取得する
    // this.loginuser = this.dataFatoryService.getLoginUser();
    // this.loginuser = JSON.parse(this.cookieService.get(ConstantsHandler.GLOBAL_TOKEN.id));

    // プロダクトリストを取得する
    // this.getProjectListApi(this.loginuser.role);

  }

  /**
  * プロダクト削除前選択されたプロダクトidを設定する
  */
  deleteProductSetId(productid: any) {
    // 選択されたプロダクトidを設定する
    this.pageModel.productid = productid;
  }

  /**
  * プロダクト削除
  */
  deleteProduct() {
    let paramReq = {
      productid: this.pageModel.productid//プロダクトid
    }
    this.httpService.usePost('product/deleteProduct', paramReq).then(item => {
      try {
        if (item.result) {
          //更新後再検索
          // this.getProjectListApi(this.loginuser.role);
        }
      } catch (e) {
        console.log('グループを登録するAPI エラー　発生しました。');
      }
    })

  }

  /**
  * プロダクトリストを検索API
  */
  private getProjectListApi(role: any): void {
    this.httpService.usePost('product/getProductList', { "makeruid": this.loginuser.uid, "role": role }).then(item => {
      try {
        if (item.result) {
          this.blockUI.stop();
          let jsonItem = typeof item == 'string' ? JSON.parse(item) : item;
          // this.pageModel.productList = jsonItem.productList;
          this.initList(jsonItem.productList);

          this.pagination.changePage = (() => {
            this.initList(jsonItem.productList);
          });
        } else {
          this.blockUI.stop();
          console.log('ユーザーリストを検索API エラー　発生しました。');
        }
      } catch (e) {
        this.blockUI.stop();
        console.log('ユーザーリストを検索API エラー　発生しました。', e);
      }
    })
  }

  private initList(res: any): void {
    let page = this.pagination.currentPage - 1;
    this.pagination.totalItems = res.length;
    let head = page * this.pagination.pageItems;
    let end = head + this.pagination.pageItems - 1;
    this.pageModel.productList = res.slice(head, end);
  }

}
