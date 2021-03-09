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
  options?: any;
  responsiveOptions?: any;
  events?: ChartEvent;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @BlockUI('newOrders') blockUINewOrders: NgBlockUI;
  
  public config: PerfectScrollbarConfigInterface = { wheelPropagation: true };
  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective) directiveRef?: PerfectScrollbarDirective;

  currentJustify = 'end';
  loadingIndicator = true;
  options = {
    close: false,
    expand: false,
    minimize: false,
    reload: true
  };
  ChartistData: any;
  datatableData: any;
  lineAreaDay: any;
  lineAreaWeek: any;
  lineAreaMonth: any;
  ecommercesaleslineArea: any;
  donutChart: any;
  barChart: any;
  rows: any;
  @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;
  Daygraph = true;
  Weekgraph = false;
  Monthgraph = false;

  constructor(
    private dataFatoryService: DataFatoryService,
    private chartApiservice: ChartApiService,
    private httpService: HttpService,
    private tableApiservice: TableApiService,
    private route: Router) { }

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

    getTabledata() {
      this.rows = this.datatableData.rows;
    }
  getlineArea() {
    const ChartData = this.ChartistData;
  this.lineAreaDay = {
    type: 'Line',
    data: ChartData['lineArea'],
    options: {
      lineSmooth: Chartist.Interpolation.simple({
        divisor: 1.8
      }),
      fullwidth: true,
      height: '320px',
      low: 0,
      showArea: true,
      fullWidth: true,
      showPoint: false,
      axisX: {
        showGrid: false,
      },
      axisY: {
        low: 0,
        offset: 16,
        scaleMinSpace: 40,
        labelInterpolationFnc: function (value) {
          return value + 'K';
        },
      },
    },
    responsiveOptions: [
      ['screen and (max-width: 640px) and (min-width: 200px)', {
        axisX: {
          labelInterpolationFnc: function (value, index) {
            return index % 2 === 0 ? value : null;
          }
        }
      }],
      ['screen and (max-width: 380px)', {
        axisX: {
          labelInterpolationFnc: function (value, index) {
            return index % 3 === 0 ? value : null;
          }
        }
      }]
    ],
    events: {
      created(data: any): void {
        const defs = data.svg.elem('defs');
        defs.elem('linearGradient', {
          id: 'gradient2',
          x1: 1,
          y1: 1,
          x2: 1,
          y2: 1
        }).elem('stop', {
          offset: 0,
          'stop-color': 'rgba(22, 141, 238, 1)'
        }).parent().elem('stop', {
          offset: 1,
          'stop-color': 'rgba(98, 188, 270, 11)'
        });
      },
    },
  };
  this.lineAreaWeek = {
    type: 'Line',
    data: ChartData['lineAreaWeek'],

    options: {
      lineSmooth: Chartist.Interpolation.simple({
        divisor: 2
      }),
      fullwidth: true,
      height: '320px',
      low: 0,
      showArea: true,
      fullWidth: true,
      showPoint: false,
      chartPadding: {
        top: 33,
      },
      axisX: {
        showGrid: false
      },
      axisY: {
        low: 0,
        scaleMinSpace: 40,
        labelInterpolationFnc: function (value) {
          return value + 'K';
        },
        offset: 20,
      },
    },
    responsiveOptions: [
      ['screen and (max-width: 640px) and (min-width: 200px)', {
        axisX: {
          labelInterpolationFnc: function (value, index) {
            return index % 2 === 0 ? value : null;
          }
        }
      }],
      ['screen and (max-width: 380px)', {
        axisX: {
          labelInterpolationFnc: function (value, index) {
            return index % 3 === 0 ? value : null;
          }
        }
      }]
    ],
    events: {
      created(data: any): void {
        const defs = data.svg.elem('defs');
        defs.elem('linearGradient', {
          id: 'gradient2',
          x1: 0,
          y1: 0,
          x2: 1,
          y2: 0
        }).elem('stop', {
          offset: 0,
          'stop-color': 'rgba(22, 141, 238, 1)'
        }).parent().elem('stop', {
          offset: 1,
          'stop-color': 'rgba(98, 188, 246, 1)'
        });
      },
    },
  };
  this.lineAreaMonth = {
    type: 'Line',
    data: ChartData['lineAreaMonth'],
    options: {
      lineSmooth: Chartist.Interpolation.simple({
        divisor: 2
      }),
      // low: 650,
      fullwidth: true,
      height: '320px',
      low: 0,
      chartPadding: {
        top: 30,
        left: 0,
        right: 25
      },
      showArea: true,
      fullWidth: true,
      showPoint: false,
      axisX: {
        showGrid: false
      },
      axisY: {
        low: 0,
        scaleMinSpace: 60,
        labelInterpolationFnc: function (value) {
          return value + 'K';
        },
      }

    },
    responsiveOptions: [
      ['screen and (max-width: 640px) and (min-width: 200px)', {
        axisX: {
          labelInterpolationFnc: function (value, index) {
            return index % 2 === 0 ? value : null;
          }
        }
      }],
      ['screen and (max-width: 380px)', {
        axisX: {
          labelInterpolationFnc: function (value, index) {
            return index % 3 === 0 ? value : null;
          }
        }
      }]
    ],
    events: {
      created(data: any): void {
        const defs = data.svg.elem('defs');
        defs.elem('linearGradient', {
          id: 'gradient2',
          x1: 0,
          y1: 0,
          x2: 1,
          y2: 0
        }).elem('stop', {
          offset: 0,
          'stop-color': 'rgba(22, 141, 238, 1)'
        }).parent().elem('stop', {
          offset: 1,
          'stop-color': 'rgba(98, 188, 246, 1)'
        });
      },
    },
  };

  this.ecommercesaleslineArea = {
    type: 'Line',
    data: ChartData['lineArea2'],
    options: {
      height: '300px',
      low: 0,
      showArea: true,
      fullWidth: true,
      onlyInteger: true,
      axisX: {
        showGrid: false
      },
      axisY: {
        low: 0,
        scaleMinSpace: 40,
        showGrid: false
      },
    },
    responsiveOptions: [
      ['screen and (max-width: 640px) and (min-width: 381px)', {
        axisX: {
          labelInterpolationFnc: function (value, index) {
            return index % 2 === 0 ? value : null;
          }
        }
      }],
      ['screen and (max-width: 380px)', {
        axisX: {
          labelInterpolationFnc: function (value, index) {
            return index % 3 === 0 ? value : null;
          }
        }
      }]
    ],
    events: {

      draw(data: any): void {
        const circleRadius = 6;
        if (data.type === 'point') {
          const circle = new Chartist.Svg('circle', {
            cx: data.x,
            cy: data.y,
            r: circleRadius,
            class: 'ct-point-circle'
          });
          data.element.replace(circle);
        }
      }
    },
  };

  // Doughnut
    this.donutChart = {
    type: 'Pie',
    data: ChartData.donutDashboard,
    options: {
      width: '100%',
      height: '290px',
      donut: true,
      startAngle: 0,
      low: 0,
      high: 8,
      fullWidth: true,
      plugins: [
        Chartist.plugins.tooltip({
          appendToBody: false,
          class: 'donut_tooltip',
        })
      ],
      labelInterpolationFnc: function (value) {
        const total = ChartData.donutDashboard.series.reduce(function (prev, series) {
          return prev + series.value;
        }, 0);
        return total + '%';
      }
    },
    events: {
      draw(data: any): void {
        if (data.type === 'label') {
          if (data.index === 0) {
            data.element.attr({
              dx: data.element.root().width() / 2,
              dy: data.element.root().height() / 2
            });
          } else {
            data.element.remove();
          }
        }
      }
    }
  };

  ///////////////////// End doughnutchart////////////////
  ///////////////////// Start barchart////////////////
  this.barChart = {
    type: 'Bar',
    data: ChartData['Bar'],
    options: {
      fullwidth: true,
      height: '380px',
      seriesBarDistance: 21,
      chartPadding: {
        top: 0,
      },
      plugins: [
        Chartist.plugins.tooltip({
          appendToBody: false,
          class: 'bar_tooltip',
        })
      ],
      axisX: {
        showLable: true,
        showGrid: false,
        offset: 60,
        labelInterpolationFnc: function (value) {
          return value.slice(0, 3);
        }
      },

      axisY: {
        scaleMinSpace: 40,
      }
    },
  };
}
  ///////////////////// End barchart////////////////
  ngOnInit() {

    this.chartApiservice.getEcommerceData().subscribe(Response => {
      this.ChartistData = Response;
      this.getlineArea();
      });
    this.tableApiservice.getEcommerceTableData().subscribe(Response => {
      this.datatableData = Response;
      this.getTabledata();
      });

      let item: UserInfo = this.dataFatoryService.getUserInfo();
      if (item != null) {
        var param = {
            "username": item.uid
        }
      }
      this.httpService.usePost('/getDashboardInfo', { "username":"ifocus" }).then(item => {
        try {
    
            if(item!= null){
              // let jsonItem = typeof item.data == 'string' ? JSON.parse(item.data) : item.data;
            //   jsonItem.productList.forEach((elem) => {
            //     let product_info = JSON.parse(elem);
            //     this.pageModel.products.push(product_info)
            //  });
            //   this.pageModel.productLength = jsonItem.productCount;
  
            this.pageModel.products = item.productList;
            this.pageModel.productLength = this.pageModel.products.length;
            this.pageModel.userList = item.userList;
            this.pageModel.userLength = this.pageModel.userList.length;
            this.pageModel.errlogList = item.errlogList;
            this.pageModel.errlogLength = this.pageModel.errlogList.length;

            this.pageModel.projectLength = item.projectCount;
            this.pageModel.deciveLength = item.deviceCount;
            this.pageModel.deviceOnlLength = 0;

            // this.pageModel.products=[{productid:1,productcode:"code004",productname:"テスト用プロダクト",model:"モデム",version:"Ver0001",simflag:1,summary:"テスト",alive:0},{productid:2,productcode:"code004",productname:"テスト用プロダクト2",model:"モデム",version:"Ver0001",simflag:1,summary:"テスト",alive:0}];
            //  this.pageModel.productLength = 0;  
            // ユーザー数を検索
              // this.getUserListLengthApi(this.UserInfo.role, this.UserInfo.uid)
            }

        } catch (e) {
          console.log('ユーザー数数を検索API エラー　発生しました。');
        }
      })
  }
  reloadNewOrders() {
    this.blockUINewOrders.start('Loading..');
    setTimeout(() => {
      this.blockUINewOrders.stop();
    }, 2500);
  }
  rotueInvoice() {
    this.route.navigate(['/invoice/invoice-summary']);
  }
  reLoad(){
    this.route.navigate([''])
  }
  }
