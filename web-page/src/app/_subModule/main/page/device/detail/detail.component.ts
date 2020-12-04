import { Component, OnInit } from '@angular/core';
import { bottom_flyIn } from 'src/app/_common/_animations/bottom_flyIn';
import { HttpService } from 'src/app/_shareModule/service/HttpService';
import { ActivatedRoute } from "@angular/router";
import { ConstantsHandler } from 'src/app/_common/_constant/constants.handler';
import { CookieService } from 'ngx-cookie-service';
import { PathofDevice } from 'src/app/_common/_constant/pathofapi.handler';
import { AlertService } from 'ngx-alerts';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
  animations: [bottom_flyIn]
})
export class DetailComponent implements OnInit {
  private pageModel = {
    device: {
      imei: '',
      iccid: '',
      imsi: '',
      uid: '',
      devicename: '',
      firmwareVersion: '',
      newestVersionConfirmTime: '',
    },
    userList: [],
    nameValue: '',
  }
  constructor(
    private httpService: HttpService,
    private routeInfo: ActivatedRoute,
    private cookieService: CookieService,
    private alertService: AlertService
  ) {
  }

  ngOnInit() {
    this.getDevice();
  }

  getUserName() {
    var obj = this;
    this.httpService.executeGet(ConstantsHandler.server + "/user/getIdName", "",
      function (res) {
        obj.pageModel.userList = res["userIdNameMap"];
        for (var item in obj.pageModel.userList) {
          if (item == obj.pageModel.device.uid) { //item 表示Json串中的属性，如'name' 
            obj.pageModel.nameValue = obj.pageModel.userList[item];//key所对应的value 
            console.log(obj.pageModel.nameValue);
          }
        }

      });
    return obj;
  }

  getDevice() {
    var obj = this;
    this.httpService.executeGet(ConstantsHandler.server + "/deviceBinding/adminList",
      {
        pageSize: 1,
        pageNumber: 1,
        imei: this.routeInfo.snapshot.queryParams["imei"],
        uid: this.routeInfo.snapshot.queryParams["uid"]
      }, function (res) {
        obj.pageModel.device = res["list"][0];
        if (obj.pageModel.device != null) {
          obj.getUserName();
        } else {
          obj.alertService.warning("このデバイスにはバンディング情報が見つかりません")
        }
      });
  }
}
