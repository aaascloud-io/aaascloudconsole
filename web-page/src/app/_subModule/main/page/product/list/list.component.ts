import { Component, OnInit, Output } from '@angular/core';
import { bottom_flyIn } from 'src/app/_common/_animations/bottom_flyIn';
import { HttpService } from 'src/app/_shareModule/service/HttpService';
import { DataFatoryService } from 'src/app/_shareModule/service/DataFatoryService';
import { UserInfo } from 'src/app/_common/_interface/UserInfo';
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

  constructor(
    private httpService: HttpService,
    private cookieService: CookieService,
    private　dataFatoryService: DataFatoryService
  ) { }

  pageModel = {
    productid: '',
    productList: []
  }
  userInfo: UserInfo

  @Output()
  public pagination: Pagination = Pagination.defaultPagination;
  // Wires up BlockUI instance
  @BlockUI() blockUI: NgBlockUI;
  ngOnInit() {
    // this.blockUI.start('プロダクト検索中です。少々お待ちください。');
    this.pagination.currentPage = 1;
    // ユーザー情報を取得する
    // this.userInfo = this.dataFatoryService.getLoginUser();


    // this.userInfo = JSON.parse(this.cookieService.get(ConstantsHandler.GLOBAL_TOKEN.id));

    // プロダクトリストを取得する
    this.getProjectList();

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
  * プロダクトリストを検索
  */
  private getProjectList(): void {
    this.httpService.usePost('getProductAll', {}).then(item => {
      try {
        if (item.resultCode === "0000") {
          // this.blockUI.stop();
          let jsonItemData = typeof item.data == 'string' ? JSON.parse(item.data) : item.data;
          this.pageModel.productList = jsonItemData;
          this.initList(jsonItemData);

          this.pagination.changePage = (() => {
            this.initList(jsonItemData);
          });
        } else {
          this.blockUI.stop();
          console.log('プロダクトを検索 エラー　発生しました。');
        }
      } catch (e) {
        this.blockUI.stop();
        console.log('プロダクトを検索 エラー　発生しました。', e);
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
