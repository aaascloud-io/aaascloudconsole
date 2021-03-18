import { Component, OnInit, ViewChild } from '@angular/core';
import * as Chartist from 'chartist';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ChartEvent, ChartType } from 'ng-chartist';
import 'chartist-plugin-tooltips';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { PerfectScrollbarDirective, PerfectScrollbarComponent, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ChartApiService } from '../../_services/chart.api';
import { TableApiService } from '../../_services/table-api.service';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/_services/HttpService';
import { UserInfo } from 'src/app/_common/_Interface/UserInfo';
import { DataFatoryService } from 'src/app/_services/DataFatoryService';

export interface Chart {
  type: ChartType;
  data: Chartist.IChartistData;
  responsiveOptions?: any;
  events?: ChartEvent;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public config: PerfectScrollbarConfigInterface = { wheelPropagation: true };
  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective) directiveRef?: PerfectScrollbarDirective;

  currentJustify = 'end';

  ChartistData: any;
  datatableData: any;
  lineAreaDay: any;
  lineAreaWeek: any;
  lineAreaMonth: any;
  ecommercesaleslineArea: any;
  donutChart: any;
  barChart: any;
  @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;
  Daygraph = true;
  Weekgraph = false;
  Monthgraph = false;

  bigSize = true; //windowサイズflg

  constructor(
    private dataFatoryService: DataFatoryService,
    private httpService: HttpService,) { }

  pageModel = {
    //プロダクト
    products: [],
    productLength: 0,//プロダクト数
    userList: [],
    userLength: 0,//ユーザー数
    projectLength: 0,//プロジェクト数
    deciveLength: 0,//IoT デバイス数総数
    deviceOnlLength: 0,//IoT デバイス数オンライン数
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
  ///////////////////// End barchart////////////////
  ngOnInit() {
    let item: UserInfo = this.dataFatoryService.getUserInfo();
    if (item != null) {
      var param = {
        "username": item.login_id
      }
    }
    this.httpService.usePost('/getDashboardInfo', param).then(item => {
      try {
        if (item != null) {
          this.pageModel.products = item.productList;
          this.pageModel.productLength = this.pageModel.products.length;
          this.pageModel.userList = item.userList;
          this.pageModel.userLength = this.pageModel.userList.length;
          this.pageModel.errlogList = item.errlogList;
          this.pageModel.errlogLength = this.pageModel.errlogList.length;

          this.pageModel.projectLength = item.projectCount;
          this.pageModel.deciveLength = item.deviceCount;
          this.pageModel.deviceOnlLength = 0;
        }
      } catch (e) {
        console.log('ユーザー数数を検索API エラー　発生しました。');
      }
    })
  }

  onResize() {
    //プロジェクト改行size
    if (innerWidth < 1596) {
      this.bigSize = false;
    } else {
      this.bigSize = true;
    }
  }
}
