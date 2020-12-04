import { Component, OnInit } from '@angular/core';
import { bottom_flyIn } from 'src/app/_common/_animations/bottom_flyIn';
import { HttpService } from 'src/app/_shareModule/service/HttpService';
import { loginUser } from 'src/app/_common/_interface/userInfo';
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
    products: [
      {productId:'00001', productName:'顔識別', type:'1.2.3'},
      {productId:'00002', productName:'watch', type:'20.0'}
    ],
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
    superUserList: [
      {uid:'000000', adminId:'00000', companyName:'I-focus', loginId:'ifocus'},
      {uid:'000001', adminId:'00001', companyName:'山田電機', loginId:'yamada'},
      {uid:'000002', adminId:'00002', companyName:'ドン・キホーテ', loginId:'donki'},
      {uid:'000003', adminId:'00003', companyName:'XX学校', loginId:'XXgakkou'},
    ],
  }
  loginuser: loginUser

  ngOnInit() {
    // ユーザー情報を取得する
    // this.loginuser = JSON.parse(this.cookieService.get(ConstantsHandler.GLOBAL_TOKEN.id));
    // プロダクト数を検索API
    // this.httpService.usePost('dashboard/getProductList', { "makeruid":this.loginuser.uid,"role": this.loginuser.role }).then(item => {
    //   try {
    //     if (item.result) {
    //       let jsonItem = typeof item == 'string' ? JSON.parse(item) : item;
    //       this.pageModel.products = jsonItem.productList;
    //       this.pageModel.productLength = jsonItem.productList.length;
    //       // ユーザー数を検索
    //       this.getUserListLengthApi(this.loginuser.role, this.loginuser.uid)
    //     } else {
    //       console.log('ユーザー数を検索API エラー　発生しました。');
    //     }
    //   } catch (e) {
    //     console.log('ユーザー数数を検索API エラー　発生しました。');
    //   }
    // })
  }

  /*
  * ユーザー数を検索API
  */
  private getUserListLengthApi(role: any, createdid: any): void {
    this.httpService.usePost('login/getUserList', { "role": role, "createdid": createdid }).then(item => {
      try {
        if (item.result) {
          let jsonItem = typeof item == 'string' ? JSON.parse(item) : item;
          this.pageModel.superUserList = jsonItem.userList;//ここで「superUserList」は普通ユーザーです画面リスト表示用
          this.pageModel.userLength = jsonItem.userList.length;

          try {
            // 管理ユーザーと一般ユーザー判断する
            jsonItem.userList.forEach(itemUser => {
              // 管理ユーザーの場合
              // if (itemUser.role === this.loginuser.role) {
              //   // 管理ユーザー時、全部ユーザー一覧
              //   this.pageModel.superUserList = jsonItem.userList;
              //   throw new Error("supper")
              // }
            });
          } catch (error) {
            if (error.message === ("supper")) {
              // 管理ユーザーフラグ設定
              this.pageModel.superUserFlg = true;
            }
          }
          // 一般ユーザーの場合
          if (!this.pageModel.superUserFlg) {
            // IoT デバイス数/オンラインを検索API
            this.getDevOnlApi();

            // superUserの場合
          } else {
            this.getDevOnlApiSuper();
          }
        } else {
          console.log('httpService エラー　発生しました。');
        }
      } catch (e) {
        console.log('httpService エラー　発生しました。');
      }

    })
  }

  /*
  * IoT デバイス数/オンラインを検索API
  */
  private getDevOnlApi(): void {
    let url = PathofDevice.PATH_DEVICE_LIST + this.loginuser.uid;
    // 设备预定义リストを検索
    this.httpService.UsePostForRealPath(url, {}).then(res => {

      //IoT デバイス数総数
      this.pageModel.deviceLen = res.length;

      // 设备statusリストを検索
      this.httpService.UsePostForRealPath(PathofDevice.PATH_DEVICE_BAND_STATUS_LIST, { uid: this.loginuser.uid }).then(resSur => {// デバイス監視を取得

        var resultArray = [];
        Object.keys(resSur).map(function (personNamedIndex) {
          let deviceSta = resSur[personNamedIndex];
          if (deviceSta.isOnline == 1) {
            resultArray.push(deviceSta);
          }
        });
        //IoT デバイス数オンライン数
        this.pageModel.deviceOnlLen = resultArray.length;

        //IoT デバイス数オンライン数%
        this.pageModel.deviceOnlLenPer = (this.pageModel.deviceOnlLen / this.pageModel.deviceLen * 100).toString() + '%';

        //IoT デバイス数オフライン・エラー数
        this.pageModel.deviceOutlLen = this.pageModel.deviceLen - this.pageModel.deviceOnlLen;

        //IoT デバイス数オフライン・エラー数%
        this.pageModel.deviceOutlLenPer = (this.pageModel.deviceOutlLen / this.pageModel.deviceLen * 100).toString() + '%';
      });
    }).catch(function (res) {
      console.log(res.error);
    });
  }

  /*
  * IoT デバイス数/オンラインを検索APISuper
  */
  async getDevOnlApiSuper() {
    let forOverFlg = false;
    for (let index = 0; index < this.pageModel.superUserList.length; index++) {
      const element = this.pageModel.superUserList[index];
      let url = PathofDevice.PATH_DEVICE_LIST + element.uid;
      // 设备预定义リストを検索
      await this.httpService.UsePostForRealPath(url, {}).then(res => {
        //IoT デバイス数総数
        this.pageModel.deviceLen = this.pageModel.deviceLen + res.length;
      }).catch(function (res) {
        console.log(res.error);
      });
      // 设备statusリストを検索
      await this.httpService.UsePostForRealPath(PathofDevice.PATH_DEVICE_BAND_STATUS_LIST, { uid: element.uid }).then(resSur => {// デバイス監視を取得
        var resultArray = [];
        Object.keys(resSur).map(function (personNamedIndex) {
          let deviceSta = resSur[personNamedIndex];
          if (deviceSta.isOnline == 1) {
            resultArray.push(deviceSta);
          }
        });
        //IoT デバイス数オンライン数
        this.pageModel.deviceOnlLen = this.pageModel.deviceOnlLen + resultArray.length;
      });
      if (index === this.pageModel.superUserList.length - 1) {
        forOverFlg = true;
      }
    }
    if (forOverFlg) {
      //IoT デバイス数オンライン数%
      this.pageModel.deviceOnlLenPer = (this.pageModel.deviceOnlLen / this.pageModel.deviceLen * 100).toString() + '%';

      //IoT デバイス数オフライン・エラー数
      this.pageModel.deviceOutlLen = this.pageModel.deviceLen - this.pageModel.deviceOnlLen;

      //IoT デバイス数オフライン・エラー数%
      this.pageModel.deviceOutlLenPer = (this.pageModel.deviceOutlLen / this.pageModel.deviceLen * 100).toString() + '%';
    }

  }
}
