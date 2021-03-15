import { Component, OnInit, ViewChild, EventEmitter, Output, Renderer2 } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { HttpService } from 'src/app/_services/HttpService';
import { HttpClient } from '@angular/common/http';
import { DataFatoryService } from 'src/app/_services/DataFatoryService';
import { RouteIdIF } from 'src/app/_common/_Interface/RouteIdIF';
import { UserInfo } from 'src/app/_common/_Interface/UserInfo';

import {MessageService} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-errorlist',
  templateUrl: './errorlist.component.html',
  styleUrls: ['./errorlist.component.css'],
  providers: [MessageService],
})
export class ErrorlistComponent implements OnInit {

  //　errorlist 
  rows: any[] = [];
  tableDisplayData:any;
  collectionSize: any;
  page = 1;
  pageSize =10;
  selectedErrorItem:any;
  editModal = null;
  contactFlag: boolean;
  // エラー処理履歴
  errResumeList = [];
  sortOn: any;

  valueSortFlg = {
    errCodeUp : false,
    errCodeDown : false,
    deviceUp : false,
    deviceDown : false,
    datatimeUp : false,
    datatimeDown : false,
  };


  public config: PerfectScrollbarConfigInterface = { };

  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective) directiveRef?: PerfectScrollbarDirective;

  @Output() closeModalEvent = new EventEmitter<boolean>();
  @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;

  /**
   * Constructor
   *
   * @param NgbModal  modal;
   * @param Renderer2  _renderer
   */
  constructor(
    private modal: NgbModal,
    private _renderer: Renderer2,
    private _httpClient: HttpClient,
    private httpService: HttpService,
    private dataFatoryService: DataFatoryService,
    private messageService: MessageService, 
    private primengConfig: PrimeNGConfig
    ) { 
    }

    protected pageModel = {
      loginInfo:{},
      targetUserInfo:{},
    }
    /**
     * OnInit
     */
  ngOnInit() {
    this.primengConfig.ripple = true;
    let item: RouteIdIF = this.dataFatoryService.getRouteIdIF();
    this.pageModel.loginInfo = {
        "loginuserid": item.uid,
        "loginusername": item.login_id,
        "loginrole": item.role,
        "logincompanyid": item.company,
      },
    this.pageModel.targetUserInfo = {
      "targetuserid": item.uid,
      "targetuserCompanyid": item.company,
    };
    this.initData();
  }

  

  // errorlist データ取得
  async initData(){
    this.rows = [];
    var param = {
      "loginInfo":this.pageModel.loginInfo,
      "targetUserInfo":this.pageModel.targetUserInfo,
      "username": this.pageModel.loginInfo["loginusername"],
    };
    this.rows = [];
    var res = await this.httpService.post("/getErrlogList",param);
    let jsonItem = typeof res.data == 'string' ? JSON.parse(res.data) : res.data;
    jsonItem.forEach(element => {
      this.rows.push(element);
    });
    this.rows = [...this.rows];
    this.getTabledata();
    console.log("rows 数据");
    console.log(this.rows);
  }

  getTabledata() {
    this.tableDisplayData = this.rows;
    // 获取当前页码
    this.collectionSize = this.tableDisplayData.length;
    // 每个元素添加了 isSelected 属性
    this.tableDisplayData.forEach(x => x.isSelected = false)
    // this.tableDisplayData = this.PaginationData();
  }

  /**
 * Pagination table
 */
  get PaginationData() {
    if (this.tableDisplayData) {
      return this.tableDisplayData.map((tabledisplaydata, i) => ({ projectid: i + 1, ...tabledisplaydata }))
        .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    }
  }

  // エラー処理履歴
    // Modalを開く
  viewErrProcessingHistoryModal(errProcessHistoryModalContent, row) {
    // 把选中的 row 对象内的东西全部给全局变量 selectedErrorItem
    this.selectedErrorItem = Object.assign({},row);
    // 打开模态框
    this.editModal = this.modal.open(errProcessHistoryModalContent, {
      windowClass: 'animated fadeInDown',
      size: 'lg'
    });
    this.contactFlag = false;
    this.getErrResumeList(this.selectedErrorItem);
  }
    // エラー処理履歴データ取得
  async getErrResumeList(selectedErrorItem){
    var param = {
      "loginInfo":this.pageModel.loginInfo,
      "targetUserInfo":this.pageModel.targetUserInfo,
      "rowid":selectedErrorItem.rowid,
    };
    var res = await this.httpService.post("/getErrResumeList",param);
    let jsonItem = typeof res.data == 'string' ? JSON.parse(res.data) : res.data;
    this.errResumeList = [];
    jsonItem.forEach(element => {
      this.errResumeList.push(element);
    });
    this.errResumeList = [...this.errResumeList];
  } 
    // Modal を閉める
  closeErrProcessingHistoryModal(errProcessHistory, row){
    errProcessHistory.reset();
    this.editModal.close(errProcessHistory.resetForm);
  }

  // エラー編集
    // Modalを開く
  processErrDataModal(processErrDataModalContent, row) {
    // 把选中的 row 对象内的东西全部给全局变量 selectedErrorItem
    this.selectedErrorItem = Object.assign({},row);
    this.selectedErrorItem.doneFlag = 0;
    this.selectedErrorItem["contents"] = "";
    this.selectedErrorItem["errlogid"] = this.selectedErrorItem["rowid"];
    // 打开模态框
    this.editModal = this.modal.open(processErrDataModalContent, {
      windowClass: 'animated fadeInDown'
    });
    this.contactFlag = false;
  }

  processErrDataUpdate(processErrDataUpdateForm,projectid){
    var flg = true;
    if (flg && !this.selectedErrorItem['contents']) {
      this.showAlert('warn' , '対応メモを入力してください。');
      flg = false;
    }


    let routeif: UserInfo = this.dataFatoryService.getUserInfo();
    if (routeif != null && flg) {
      if (confirm("対応情報を提出しますか")) {
        var param = {
          "loginInfo":this.pageModel.loginInfo,
          "targetUserInfo":this.pageModel.targetUserInfo,
          
          "errlogid": this.selectedErrorItem.errlogid,
          "contents":this.selectedErrorItem.contents,
          "doneFlag": this.selectedErrorItem.doneFlag,
        };
        this.httpService.useRpPost('registerErrresume', param).then(item => {
          try {
            if (item.resultCode == "0000") {
              this.selectedErrorItem={};
              this.showAlert('success' , '対応情報を提出しました');
              if (processErrDataUpdateForm.valid === true) {
                processErrDataUpdateForm.reset();
                this.editModal.close(processErrDataUpdateForm.resetForm);
              }
            }
            this.ngOnInit();
          } catch (e) {
            console.log(e);
            this.showAlert('error' , e);
            this.ngOnInit();
          };
        });
      }
    }
    this.ngOnInit();
  }

  sortData(nm) {
    if (this.sortOn == 1) {
      this.rows.sort(this.alphabetically(true, nm));
      this.sortOn = 2;
    } else {
      this.rows.sort(this.alphabetically(false, nm));
      this.sortOn = 1;
    }

    this.valueSortFlg.errCodeUp = false;
    this.valueSortFlg.errCodeDown = false;
    this.valueSortFlg.deviceUp = false;
    this.valueSortFlg.deviceDown = false;
    this.valueSortFlg.datatimeUp = false;
    this.valueSortFlg.datatimeDown = false;

    switch (nm) {
      case 'errcode':
        if (this.sortOn == 1) {
          this.valueSortFlg.errCodeUp = true
        } else {
          this.valueSortFlg.errCodeDown = true
        }
        break;
      case 'device':
        if (this.sortOn == 1) {
          this.valueSortFlg.deviceUp = true
        } else {
          this.valueSortFlg.deviceDown = true
        }
        break;
      case 'datatime':
        if (this.sortOn == 1) {
          this.valueSortFlg.datatimeUp = true
        } else {
          this.valueSortFlg.datatimeDown = true
        }
        break;
    }
  }

  alphabetically(ascending, nm) {
    return function (a, b) {
      // equal items sort equally
      if (a[nm] === b[nm]) {
        return 0;
      }
      // nulls sort after anything else
      else if (a[nm] === null) {
        return 1;
      }
      else if (b[nm] === null) {
        return -1;
      }
      // otherwise, if we're ascending, lowest sorts first
      else if (ascending) {
        return a[nm] < b[nm] ? -1 : 1;
      }
      // if descending, highest sorts first
      else {
        return a[nm] < b[nm] ? 1 : -1;
      }
    };
  }

  showAlert(alertType, alertDetail) {
    this.messageService.add({
      key : 'alertModal', 
      severity : alertType, 
      summary : alertType, 
      detail : alertDetail,
      life : 2000});
  }
}
