import { Component, OnInit } from '@angular/core';
import { bottom_flyIn } from 'src/app/_common/_animations/bottom_flyIn';
import { HttpService } from 'src/app/_shareModule/service/HttpService';
import { UserInfo } from 'src/app/_common/_interface/userInfo';
import { ConstantsHandler } from 'src/app/_common/_constant/constants.handler';
import { CookieService } from 'ngx-cookie-service';
import { PathofDevice } from 'src/app/_common/_constant/pathofapi.handler';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [bottom_flyIn]
})
export class DashboardComponent implements OnInit {

  constructor(private httpService: HttpService, private cookieService: CookieService) { }

  pageModel = {

    //プロダクト
    products: [],
    productLength: 0,//プロダクト数
    userLength: 0,//ユーザー数
    projectLength: 0,//プロジェクト数
    deviceLen: 0,//IoT デバイス数総数
    deviceOnlLen: 0,//IoT デバイス数オンライン数
    deviceOnlLenPer: '',//IoT デバイス数オンライン数%
    deviceOutlLen: 0,//IoT デバイス数オフライン・エラー数
    deviceOutlLenPer: '',//IoT デバイス数オフライン・エラー数%
    // ユーザー属性(デフォルトは一般ユーザー)
    superUserFlg: false,
    // 管理ユーザー時、ユーザー一覧
    superUserList: [],
    errlogList: [],
    errlogLength: 0,//プロダクト数
  }
  UserInfo: UserInfo

  ngOnInit() {
    // ユーザー情報を取得する
    // this.UserInfo = JSON.parse(this.cookieService.get(ConstantsHandler.GLOBAL_TOKEN.id));
    // プロダクト数を検索API
    
    // this.httpService.usePost('/getDashboardInfo', { "username":this.UserInfo.username }).then(item => {
    this.httpService.usePost('/getDashboardInfo', { "username":"ifocus" }).then(item => {
      try {
        if (item.resultCode == "0000") {
          if(item.data!= null){
            let jsonItem = typeof item.data == 'string' ? JSON.parse(item.data) : item.data;

        
          //   jsonItem.productList.forEach((elem) => {
          //     let product_info = JSON.parse(elem);
          //     this.pageModel.products.push(product_info)
          //  });
          //   this.pageModel.productLength = jsonItem.productCount;


          this.pageModel.products=[{productid:1,productcode:"code004",productname:"テスト用プロダクト",model:"モデム",version:"Ver0001",simflag:1,summary:"テスト",alive:0},{productid:2,productcode:"code004",productname:"テスト用プロダクト2",model:"モデム",version:"Ver0001",simflag:1,summary:"テスト",alive:0}];
           this.pageModel.productLength = 0;  
          // ユーザー数を検索
            // this.getUserListLengthApi(this.UserInfo.role, this.UserInfo.uid)
          }
        } else {
          console.log('ユーザー数を検索API エラー　発生しました。');
        }
      } catch (e) {
        console.log('ユーザー数数を検索API エラー　発生しました。');
      }
    })



  }

  /*
  * ユーザー数を検索API
  */
  // private getUserListLengthApi(role: any, createdid: any): void {
  //   this.httpService.usePost('login/getUserList', { "role": role, "createdid": createdid }).then(item => {
  //     try {
  //       if (item.result) {
  //         let jsonItem = typeof item == 'string' ? JSON.parse(item) : item;
  //         this.pageModel.superUserList = jsonItem.userList;//ここで「superUserList」は普通ユーザーです画面リスト表示用
  //         this.pageModel.userLength = jsonItem.userList.length;

  //         try {
  //           // 管理ユーザーと一般ユーザー判断する
  //           jsonItem.userList.forEach(itemUser => {
  //             // 管理ユーザーの場合
  //             // if (itemUser.role === this.UserInfo.role) {
  //             //   // 管理ユーザー時、全部ユーザー一覧
  //             //   this.pageModel.superUserList = jsonItem.userList;
  //             //   throw new Error("supper")
  //             // }
  //           });
  //         } catch (error) {
  //           if (error.message === ("supper")) {
  //             // 管理ユーザーフラグ設定
  //             this.pageModel.superUserFlg = true;
  //           }
  //         }
  //         // 一般ユーザーの場合
  //         if (!this.pageModel.superUserFlg) {
  //           // IoT デバイス数/オンラインを検索API
  //           // this.getDevOnlApi();

  //           // superUserの場合
  //         } else {
  //           // this.getDevOnlApiSuper();
  //         }
  //       } else {
  //         console.log('httpService エラー　発生しました。');
  //       }
  //     } catch (e) {
  //       console.log('httpService エラー　発生しました。');
  //     }

  //   })
  // }

  /*
  * IoT デバイス数/オンラインを検索API
  */
  // private getDevOnlApi(): void {
  //   let url = PathofDevice.PATH_DEVICE_LIST + this.UserInfo.uid;
  //   // 设备预定义リストを検索
  //   this.httpService.UsePostForRealPath(url, {}).then(res => {

  //     //IoT デバイス数総数
  //     this.pageModel.deviceLen = res.length;

  //     // 设备statusリストを検索
  //     this.httpService.UsePostForRealPath(PathofDevice.PATH_DEVICE_BAND_STATUS_LIST, { uid: this.UserInfo.uid }).then(resSur => {// デバイス監視を取得

  //       var resultArray = [];
  //       Object.keys(resSur).map(function (personNamedIndex) {
  //         let deviceSta = resSur[personNamedIndex];
  //         if (deviceSta.isOnline == 1) {
  //           resultArray.push(deviceSta);
  //         }
  //       });
  //       //IoT デバイス数オンライン数
  //       this.pageModel.deviceOnlLen = resultArray.length;

  //       //IoT デバイス数オンライン数%
  //       this.pageModel.deviceOnlLenPer = (this.pageModel.deviceOnlLen / this.pageModel.deviceLen * 100).toString() + '%';

  //       //IoT デバイス数オフライン・エラー数
  //       this.pageModel.deviceOutlLen = this.pageModel.deviceLen - this.pageModel.deviceOnlLen;

  //       //IoT デバイス数オフライン・エラー数%
  //       this.pageModel.deviceOutlLenPer = (this.pageModel.deviceOutlLen / this.pageModel.deviceLen * 100).toString() + '%';
  //     });
  //   }).catch(function (res) {
  //     console.log(res.error);
  //   });
  // }

  /*
  * IoT デバイス数/オンラインを検索APISuper
  */
  // async getDevOnlApiSuper() {
  //   let forOverFlg = false;
  //   for (let index = 0; index < this.pageModel.superUserList.length; index++) {
  //     const element = this.pageModel.superUserList[index];
  //     let url = PathofDevice.PATH_DEVICE_LIST + element.uid;
  //     // 设备预定义リストを検索
  //     await this.httpService.UsePostForRealPath(url, {}).then(res => {
  //       //IoT デバイス数総数
  //       this.pageModel.deviceLen = this.pageModel.deviceLen + res.length;
  //     }).catch(function (res) {
  //       console.log(res.error);
  //     });
  //     // 设备statusリストを検索
  //     await this.httpService.UsePostForRealPath(PathofDevice.PATH_DEVICE_BAND_STATUS_LIST, { uid: element.uid }).then(resSur => {// デバイス監視を取得
  //       var resultArray = [];
  //       Object.keys(resSur).map(function (personNamedIndex) {
  //         let deviceSta = resSur[personNamedIndex];
  //         if (deviceSta.isOnline == 1) {
  //           resultArray.push(deviceSta);
  //         }
  //       });
  //       //IoT デバイス数オンライン数
  //       this.pageModel.deviceOnlLen = this.pageModel.deviceOnlLen + resultArray.length;
  //     });
  //     if (index === this.pageModel.superUserList.length - 1) {
  //       forOverFlg = true;
  //     }
  //   }
  //   if (forOverFlg) {
  //     //IoT デバイス数オンライン数%
  //     this.pageModel.deviceOnlLenPer = (this.pageModel.deviceOnlLen / this.pageModel.deviceLen * 100).toString() + '%';

  //     //IoT デバイス数オフライン・エラー数
  //     this.pageModel.deviceOutlLen = this.pageModel.deviceLen - this.pageModel.deviceOnlLen;

  //     //IoT デバイス数オフライン・エラー数%
  //     this.pageModel.deviceOutlLenPer = (this.pageModel.deviceOutlLen / this.pageModel.deviceLen * 100).toString() + '%';
  //   }

  // }
}
