import { Component, OnInit, Output } from '@angular/core';
import { bottom_flyIn } from 'src/app/_common/_animations/bottom_flyIn';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/_shareModule/service/HttpService';
import { LoginInfo } from 'src/app/_common/_interface/userInfo';
import { ConstantsHandler } from 'src/app/_common/_constant/constants.handler';
import { CookieService } from 'ngx-cookie-service';
import { Pagination } from '../../pagination/pagination';
import { DataFatoryService } from 'src/app/_shareModule/service/DataFatoryService';
import { codes } from '@common/_utils/codes';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
  animations: [bottom_flyIn]
})
export class DetailComponent implements OnInit {
  pageModel = {
    product: {
      productname: '',
      model: '',
      version: '',
      simflag: 0,
      summary: '',
      makeruid: 0
    },
    groups: [],//groups
  }
  loginInfo: LoginInfo;

  constructor(private routerinfo: ActivatedRoute,
    private httpService: HttpService,
    private cookieService: CookieService,
    private dataFatoryService: DataFatoryService) { }

  @Output()
  public pagination: Pagination = Pagination.defaultPagination;
  ngOnInit() {
    this.pagination.currentPage = 1;
    // this.userInfo = JSON.parse(this.cookieService.get(ConstantsHandler.GLOBAL_TOKEN.id));
    this.loginInfo = this.dataFatoryService.getLoginUser();
    // プロダクトIDをリスト画面から取得された
    this.getProductInfoApi(this.routerinfo.snapshot.queryParams);
  }


  /**
  * プロダクト詳細を検索API
  */
  private getProductInfoApi(queryParams: any): void {
    let paramReq = {
      productid: queryParams.productid,　//プロダクトid
      loginInfo: this.loginInfo
    }
    this.httpService.usePost('getProductDetail', paramReq).then(item => {
      try {
        if (item.resultCode === codes.RETCODE.NORMAL) {
          // let jsonItem = typeof item.data == 'string' ? JSON.parse(item) : item;
          this.pageModel.product = JSON.parse(item.data);
        } else {

          console.log('プロダクト詳細を検索API エラー　発生しました。');
        }
      } catch (e) {
        console.log('プロダクト詳細を検索API エラー　発生しました。');
      }
    })
  }



  private initList(res: any): void {
    let page = this.pagination.currentPage - 1;
    this.pagination.totalItems = res.length;
    let head = page * this.pagination.pageItems;
    let end = head + this.pagination.pageItems - 1;
    this.pageModel.groups = res.slice(head, end);
  }
}
