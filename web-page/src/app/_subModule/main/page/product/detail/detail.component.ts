import { Component, OnInit, Output } from '@angular/core';
import { bottom_flyIn } from 'src/app/_common/_animations/bottom_flyIn';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/_shareModule/service/HttpService';
import { UserInfo } from 'src/app/_common/_interface/userInfo';
import { ConstantsHandler } from 'src/app/_common/_constant/constants.handler';
import { CookieService } from 'ngx-cookie-service';
import { Pagination } from '../../pagination/pagination';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
  animations: [bottom_flyIn]
})
export class DetailComponent implements OnInit {
  pageModel = {
    product: {
      productid: '',
      affiliationuid: '',
      groupid: '',
      productname: '',
      industrytype: '',
      application: '',
      location: '',
      summary: '',
      makeruid: ''
    },
    groups: [],//groups
  }
  userInfo: UserInfo;

  constructor(private routerinfo: ActivatedRoute, private httpService: HttpService, private cookieService: CookieService) { }

  @Output()
  public pagination: Pagination = Pagination.defaultPagination;
  ngOnInit() {
    this.pagination.currentPage = 1;
    // this.userInfo = JSON.parse(this.cookieService.get(ConstantsHandler.GLOBAL_TOKEN.id));
    // プロダクトIDをリスト画面から取得された
    this.getProductInfoApi(this.routerinfo.snapshot.queryParams);
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
          // this.httpService.usePost('product/getGroupList',{ "role":this.loginuser.role,"productid":productid}).then(itemG =>{
          //   try{
          //     if(itemG.result){
          //       let jsonItemG = typeof itemG=='string'?JSON.parse(itemG):itemG;
          //       // this.pageModel.groups = jsonItemG.groupList;
          //       this.initList(jsonItemG.groupList)

          //       this.pagination.changePage = (() => {
          //         this.initList(jsonItemG.groupList);
          //       });
          //     }else{
          //       console.log('グループリストを検索API エラー　発生しました。');
          //     }
          //   }catch(e){
          //     console.log('グループリストを検索API エラー　発生しました。');
          //   }
          // })
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
