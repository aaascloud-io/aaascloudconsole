import { Component, OnInit } from '@angular/core';
import { bottom_flyIn } from 'src/app/_common/_animations/bottom_flyIn';
import { HttpService } from 'src/app/_shareModule/service/HttpService';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
  animations: [bottom_flyIn]
})
export class DetailComponent implements OnInit {
  private pageModel = {
    loginid: '',
    company: '',
    address: '',
    mail: '',
    tel: '',
    prodects: [],//所属プロダクト;
    groups: [],//所属group
  }

  constructor(private httpService: HttpService, private routeInfo: ActivatedRoute) { }

  ngOnInit() {
    // uid⇒リスト中に選択されたのユーザー(ユーザー詳細検索)
    this.httpService.usePost('login/getUserInfo', { "uid": this.routeInfo.snapshot.queryParams["uid"] }).then(item => {
      try {
        let jsonItem = typeof item == 'string' ? JSON.parse(item) : item;
        this.pageModel.loginid = jsonItem.userInfo.loginid;
        this.pageModel.company = jsonItem.userInfo.company;
        this.pageModel.address = jsonItem.userInfo.address;
        this.pageModel.mail = jsonItem.userInfo.mail;
        this.pageModel.tel = jsonItem.userInfo.tel;

        // プロダクト検索
        this.httpService.usePost('login/getProductsByProductids', { "productids": jsonItem.userInfo.productid }).then(itemP => {
          try {
            let jsonItemP = typeof itemP == 'string' ? JSON.parse(itemP) : itemP;
            this.pageModel.prodects = jsonItemP.products;
            // グループ検索
            this.httpService.usePost('login/getGroupsByGroupids', { "groupids": jsonItem.userInfo.groupid }).then(itemG => {
              try {
                let jsonItemG = typeof itemG == 'string' ? JSON.parse(itemG) : itemG;
                this.pageModel.groups = jsonItemG.groups;
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

}
