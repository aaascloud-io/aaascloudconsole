import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SubjectService } from '../../_shareModule/service/SubjectService';
import { DataFatoryService } from 'src/app/_shareModule/service/DataFatoryService';
import { UserInfo, loginUser } from 'src/app/_common/_interface/userInfo';
import { Subscription } from 'rxjs';
import { MenuHandler } from '../../_common/_constant/menu.handler';
import { ConstantsHandler } from 'src/app/_common/_constant/constants.handler';
import { CookieService } from 'ngx-cookie-service';
import * as $ from 'jquery';
import { HttpService } from 'src/app/_shareModule/service/HttpService';

import { Logger } from '@utils/logger';

@Component({
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  private subscription: Subscription;
  private pageModel = {
    menu: {
      name: '',
      path: '',
      sub_name: '',
    },
    uid: '',
    login_id: '',
    company: '',
    uname: ""
  }
  loginuser: loginUser;

  constructor(private dataFatoryService: DataFatoryService,
    private router: Router,
    private subjectService: SubjectService,
    private cookieService: CookieService,
    private httpService: HttpService) { }

  ngOnInit() {
    //userInfoを取得する
    this.loginuser = this.dataFatoryService.getLoginUser();

    ///cookieが利用できない時の対応追加
    ///let userInfo = JSON.parse(this.cookieService.get(ConstantsHandler.GLOBAL_TOKEN.id));
    var tmp = this.cookieService.get(ConstantsHandler.GLOBAL_TOKEN.id);
    if (tmp) {
      var userInfo = JSON.parse(tmp);

      this.pageModel.uid = userInfo.uid;
      this.pageModel.login_id = userInfo.login_id;
      this.pageModel.uname = userInfo.uname;
      this.pageModel.company = userInfo.company;
    } else {
      Logger.warn(this, `has no cookie. key:[${ConstantsHandler.GLOBAL_TOKEN.id}]`);
    }
    this.subscription = this.subjectService.getMessage().subscribe(menuId => {
      if (menuId.type === 'menu') {
        // if (menuId=== 0) {
        MenuHandler.MENU.forEach(meu => {
          if (meu.path === menuId.path) {
            this.pageModel.menu.name = meu.title;
            this.pageModel.menu.path = meu.path;
            this.pageModel.menu.sub_name = menuId.subPath;
          }
        });
      }
    });
    this.router.navigate(['main/page']);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      console.log('subscription canceled');
    }
  }

  menuOnOff(): void {

    if ($('#mainDiv').hasClass('left-side-collapsed')) {
      $('#mainDiv').removeClass('left-side-collapsed');
      $('#sidebar .slimScrollDiv').css('overflow', 'hidden');
      $('#sidebar .menu-scroll').css('overflow', 'hidden');
    } else {
      $('#mainDiv').removeClass('right-side-collapsed');
      $('#mainDiv').addClass('left-side-collapsed')
      $('#sidebar .slimScrollDiv').css('overflow', 'initial');
      $('#sidebar .menu-scroll').css('overflow', 'initial');
    }
  }

  private logout() {
    this.httpService.logout();
    // this.menuService.clearMenu();
  }

}
