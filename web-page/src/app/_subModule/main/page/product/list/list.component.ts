import { Component, OnInit, Output } from '@angular/core';
import { bottom_flyIn } from 'src/app/_common/_animations/bottom_flyIn';
import { HttpService } from 'src/app/_shareModule/service/HttpService';
import { DataFatoryService } from 'src/app/_shareModule/service/DataFatoryService';
import { UserInfo } from 'src/app/_common/_interface/UserInfo';
import { ConstantsHandler } from 'src/app/_common/_constant/constants.handler';
import { CookieService } from 'ngx-cookie-service';
import { Pagination } from '../../pagination/pagination';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { LoginInfo } from 'src/app/_common/_interface/userInfo';
import { codes } from '@common/_utils/codes';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  animations: [bottom_flyIn]
})
export class ListComponent implements OnInit {

  loginInfo: LoginInfo;

  constructor(
    private httpService: HttpService,
    private cookieService: CookieService,
    private dataFatoryService: DataFatoryService,
  ) { }

  pageModel = {
    productid: '',
    productList: []
  }

  @Output()
  public pagination: Pagination = Pagination.defaultPagination;
  // Wires up BlockUI instance
  @BlockUI() blockUI: NgBlockUI;
  ngOnInit() {
    // this.blockUI.start('プロダクト検索中です。少々お待ちください。');
    this.pagination.currentPage = 1;
    // ユーザー情報を取得する
    this.loginInfo = this.dataFatoryService.getLoginUser();
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
      productid: this.pageModel.productid,　//プロダクトid
      loginInfo: this.loginInfo
    }
    this.httpService.usePost('deleteProduct', paramReq).then(item => {
      try {
        if (item.resultCode === codes.RETCODE.NORMAL) {
          //削除後再検索
          this.getProjectList();
        } else {
          console.log('プロダクトの削除は エラー 発生しました。');
        }
      } catch (e) {
        console.log('プロダクトの削除は エラー　発生しました。');
      }
    })
  }

  /**
  * プロダクトリストを検索
  */
  private getProjectList(): void {
    // console.log(JSON.stringify( this.loginInfo.loginid));
    // サーバーのstyleのため、jsonのjsonを作る
    var loginInfo = {
      loginInfo: this.loginInfo
    }
    
    this.httpService.usePost('getProductAll', loginInfo).then(item => {
      try {
        if (item.resultCode === codes.RETCODE.NORMAL) {
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
