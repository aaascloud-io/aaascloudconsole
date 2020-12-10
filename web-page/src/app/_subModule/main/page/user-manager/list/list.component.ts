import { Component, OnInit, Output, Injector } from '@angular/core';
import { HttpService } from 'src/app/_shareModule/service/HttpService';
import { UserInfo } from 'src/app/_common/_interface/userInfo';
import { ConstantsHandler } from 'src/app/_common/_constant/constants.handler';
import { CookieService } from 'ngx-cookie-service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { Logger } from '@utils/logger';
import { bottom_flyIn } from '@common/_animations/bottom_flyIn';
import { DataFatoryService } from '@service/DataFatoryService';
import { UserService } from '@service/UserService';
import { DeviceService } from '@service/DeviceService';
import { AbstractComponent } from '@sub/abstract/abstract.component';
import { Pagination } from '@sub/main/page/pagination/pagination';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  animations: [bottom_flyIn]
})
export class ListComponent extends AbstractComponent implements OnInit {

  /** １ページあたりの表示数 */
  public static SIZE_PER_PAGE: number = 10;

  protected pageModel = {
    ///現在のページ
    current: 1,
    ///検索条件に該当したユーザー
    matches: [],
    ///表示するユーザー(１ページ分)
    shows: [],

    ///削除時のターゲット
    target: '',
  }

  /** Pagination部品 */
  @Output()
  protected pagination: Pagination = new Pagination(
    1,  ///ページ数
    this.pageModel.current, ///現在のページ
    0,  ///全データ数
    ListComponent.SIZE_PER_PAGE,  ///１ページのデータ数
    () => {}  ///ページ変更時に呼ばれるコールバック
  );

  // 削除uid
  ///deleteUid: "";
  ///loginuser: loginUser;
  
  constructor(
    protected injector: Injector,
    private dataFactoryService: DataFatoryService,
    private httpService: HttpService, 
    private userService: UserService,
    private cookieService: CookieService
  ) {
    super(injector);
  }


  ngOnInit() {
    Logger.debug(this, `component initialized.`);
    ///this.pagination.currentPage = 1;
    // ユーザー情報を取得する
    // this.loginuser = this.dataFatoryService.getLoginUser();
    ///this.loginuser = JSON.parse(this.cookieService.get(ConstantsHandler.GLOBAL_TOKEN.id));

    var model = this.dataFactoryService.getPageModel('/main/page/userManager/list');
    if (model) this.pageModel = model;
    this.getUserList();

    var obj = this;
    this.pagination.changePage = () => {
      Logger.detail(this, `page changed. [${obj.pageModel.current}→${obj.pagination.currentPage}]`);
      obj.pageModel.current = obj.pagination.currentPage;
      obj.refreshShows();
      obj.refreshPagenation();
    }
  }

  ngOnDestroy() {
    this.dataFactoryService.setPageModel('/main/page/userManager/list', this.pageModel);
  }

  /**
   * ユーザー照会(画面からも)
   * 
   */
  protected async getUserList() {
    try {
      var res = await this.userService.getUsers({}).toPromise();
      this.refreshMatches(res.users);
      ///this.pageModel.current = 1;
      this.refreshShows();
      this.refreshPagenation();
    } catch (err) {
      super.handleError('照会失敗', err);
    }
  }

  /**
   * 該当するユーザーの選択
   * 
   * @param all 
   */
  private refreshMatches(all: [any]) {
    this.pageModel.matches = [];
    var i = 0;
    for (var item of all) {
      var flg = true;
      if (flg) {
        item.no = ++i;
        this.pageModel.matches.push(item);
      }
    }
    Logger.detail(this, `matches refreshed. length:[${this.pageModel.matches.length}]`);
  }

  /**
   * 表示分(1ページ)の選択
   * 
   */
  private refreshShows() {
    this.pageModel.shows = [];
    var start = (this.pageModel.current - 1) * ListComponent.SIZE_PER_PAGE;
    var end = this.pageModel.current * ListComponent.SIZE_PER_PAGE;
    for (var i = start; i < end && i < this.pageModel.matches.length; i++) {
      this.pageModel.shows.push(this.pageModel.matches[i]);
    }
    Logger.detail(this, `shows refreshed. length:[${this.pageModel.shows.length}]`);
  }

  /**
   * Pagination更新
   * 
   */
  private refreshPagenation() {
    this.pagination.totalItems = this.pageModel.matches.length;
    this.pagination.pageLength = Math.ceil(this.pagination.totalItems / this.pagination.pageItems);
    this.pagination.currentPage = this.pageModel.current;
    Logger.detail(this, `pagenation refreshed. data:[${this.pagination.totalItems}] ` + 
      `pages:[${this.pagination.pageLength}] current:[${this.pageModel.current}]`);
  }

  /**
   * モーダル前の削除対象のセット(未使用)
   * 
   * @param item 削除対象
   */
  protected setTarget(item: any) {
    this.pageModel.target = item.uid;
  }


  private getApi(role: any, createdid: any): void {
    this.httpService.usePost('login/getUserList', { "role": role, "createdid": createdid }).then(item => {
      try {
        if (item.result) {
          ///this.blockUI.stop();
          let jsonItem = typeof item == 'string' ? JSON.parse(item) : item;
          // this.pageModel.userList = jsonItem.userList;
          ///this.initList(jsonItem.userList);

          this.pagination.changePage = (() => {
            ///this.initList(jsonItem.userList);
          });
        } else {
          ///this.blockUI.stop();
          console.log('httpService エラー　発生しました。');
        }
      } catch (e) {
        ///this.blockUI.stop();
        console.log('httpService エラー　発生しました。');
      }

    })
  }

  /*
  private closeDialog() {
    setInterval(() => {
      this.pageModel.delete_alert_success = false;
      this.pageModel.delete_alert_danger = false;
    }, 5000)
  }
  */


  /*
  private initList(res: any): void {
    this.pageModel.userList = [];
    let page = this.pagination.currentPage - 1;
    this.pagination.totalItems = res.length;
    let head = page * this.pagination.pageItems;
    let end = head + this.pagination.pageItems - 1;
    res.slice(head, end).forEach(element => {
      if (element.role === "0") {
        element.roleName = 'スーパーユーザー';
        // } else if (element.role === this.loginuser.role) {
        // element.roleName = '管理ユーザー';
      } else {
        element.roleName = '一般ユーザー';
      }
      this.pageModel.userList.push(element);
    });
  }
  */

  /**
   * 一括削除(画面より)
   * 
   */
  protected async delete() {
    var targets = [];
    for (var item of this.pageModel.shows) {
      if (item.removing) {
        targets.push(item.imei);
      }
    }
    if (0 < targets.length) {
      try {
        console.log(targets);
        ///TODO
        var flg = true;
        for(var target of targets) {
          var res = this.userService.deleteUser(target).toPromise();
          if (!res) {
            flg = false;
            this.alert.success(`操作失敗：${target}`);
            break;
          }
        }
        if (flg) {
          this.alert.success('操作成功');
        }
      } catch (err) {
        ///console.log(err);
        ///this.alert.danger(`操作失敗： ${err.status} ${err.statusText}`);
        this.handleError('操作失敗', err);
      }
    } else {
      this.alert.warning('選択データ無し');
    }
  }
}
