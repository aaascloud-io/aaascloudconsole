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
  selector: 'app-version',
  templateUrl: './version.component.html',
  styleUrls: ['./version.component.css'],
  providers: [MessageService],
})
export class VersionComponent implements OnInit {

  
  name = 'Angular';
  selectedContact: any;
  contactFlag: boolean;
  addContact: any;
  placement = 'bottom-right';
  imagepathdefault: any;
  addModal = null;
  editModal = null;
  value: any;
  loadingIndicator: true;
  temp = [];
  temp2 = [];
  
  // 必用なデータ
    // rows サーバから取った画面のメインデータ
  rows: any[] = [];
  collectionSize: any;
    // 今のページ
  page = 1;
    // 1ページに展示するデータ数量
  pageSize =10;
    // 1ページに展示するデータ
  tableDisplayData:any;
    // 選択されたプロダクト
  selectedVersion: any;
    // 複数選択されたプロダクト
  selected = [];
    // 検索値
  searchValue = {
    productname:'',
    versionname:''
  };
  sortOn: any;
  checkOn: 1;
  show = false;
  // 新規バージョンのデータ
  addVersion = {};
  // すべてのproductName
  productNameList = [];

  valueSortFlg = {
    productNameUp : false,
    productNameDown : false,
    versionCodeUp : false,
    versionCodeDown : false,
    versionNameUp : false,
    versionNameDown : false,
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
      USERCODE:null,
      addList: [],
      dataAll: [],
      productList: [],
      addProject:{
        projectName:'',
        productId:'',
        projectSummary:'',
        userId:'',
      },
      // 登录数据
      loginUser: {
        loginuserid: null,
        loginusername: '',
        loginrole: null,
        logincompanyid: '',
      },
      // 登录用数据
      loginInfo:{},
      targetUserInfo:{},

      data:[],
      selectedData : {},
    }

    /**
     * OnInit
     */
  ngOnInit() {
    this.primengConfig.ripple = true;
    this.variableReset();
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

  async initData(){
    // 把服务器请求到的数据存在 rows 数组中
    this.rows = [];
    let param = {
      "loginInfo":this.pageModel.loginInfo,
      "targetUserInfo":this.pageModel.targetUserInfo,
      "username": this.pageModel.loginInfo["loginusername"],
    };
    var res = await this.httpService.post("/getAllVersions",param);
    let jsonItem = typeof res.data == 'string' ? JSON.parse(res.data) : res.data;
    jsonItem.forEach(element => {
      this.rows.push(element);
    });
    this.rows = [...this.rows];
    this.getTabledata();
    this.getProductNameList();
    console.log("rows");
    console.log(this.rows);
  }


  // 新規プロジェクト
    // Modal を開く
  addNewVersionModal(addNewVersion){
    this.addModal = this.modal.open(addNewVersion, {
      windowClass: 'animated fadeInDown',
      size: 'lg'
    });
    this.contactFlag = true;
  }
    // ModalデータをAPIに更新
  addNewVersionForm(NewVersionForm:NgForm){
    var flg = true;
    if (flg && !this.addVersion['productid']) {
      this.showAlert("warn","プロダクト名を選択してください。");
      flg = false;
    }

    if (flg && !this.addVersion['versioncode']) {
      this.showAlert("warn","バージョンコードを入力してください。");
      flg = false;
    }
    if (flg && !this.addVersion['versionname']) {
      this.showAlert("warn","バージョン名を入力してください。");
      flg = false;
    }

    let routeif: RouteIdIF = this.dataFatoryService.getRouteIdIF();
    if (routeif != null && flg) {
      var param = {
        // 登録データ
        "loginInfo":this.pageModel.loginInfo,
        "targetUserInfo":this.pageModel.targetUserInfo,
        // プロジェクト更新データ
        "productid": this.addVersion['productid'],
        "versioncode": this.addVersion['versioncode'],
        "versionname": this.addVersion['versionname'],
        "downloadurl": this.addVersion['downloadurl'],
        "description": this.addVersion['description'],
      }
      this.httpService.useRpPost('registerVersion',param).then(item=>{
        console.log("这是item");
        console.log(item);
        try{
          if(item.resultCode == "0000"){
            this.addVersion={},
            this.ngOnInit();
            this.showAlert("success","プロジェクトを登録しました。");
          }else{
            console.log('登録失敗、ご確認してください。');
            console.log(item);
            this.showAlert("error","登録失敗、ご確認してください。");
          }
        }catch(e){
          this.showAlert("error",e);
        }
      });
      if (NewVersionForm.valid === true) {
        NewVersionForm.reset();
        this.addModal.close(NewVersionForm.resetForm);
      }
    } 
  }

  // 検索機能
  searchProject(){
    let routeif: UserInfo = this.dataFatoryService.getUserInfo();
    if (routeif != null) {
      var param = {
        "loginInfo":this.pageModel.loginInfo,
        "targetUserInfo":this.pageModel.targetUserInfo,
        "productname": this.searchValue.productname,
        "versionname": this.searchValue.versionname,
      };
      this.httpService.useRpPost('searchVersions',param).then(item=>{
        let jsonItem = typeof item.data == 'string' ? JSON.parse(item.data) : item.data;
        this.rows = [];
        jsonItem.forEach(element => {
          this.rows.push(element);
        });
        this.rows = [...this.rows];
        this.getTabledata();
      });
    }
  }

  // 検索条件クリア
  clearSearchProject(){
    this.searchValue = {
      productname:'',
      versionname:''
    };
    this.ngOnInit();
  }

  // プロジェクト削除
  /**
   * Delete contact row
   * @param row     Selected row for delete contact
   */
  deleteRow(row) {
    let index = 0;
    if (confirm(row.versionname + "を削除します。よろしいですか？")){
      let routeif: RouteIdIF = this.dataFatoryService.getRouteIdIF();
    if (routeif != null) {
      var param = {
        "loginInfo":this.pageModel.loginInfo,
        "targetUserInfo":this.pageModel.targetUserInfo,
        "rowid":row.rowid,
      };
    }
      this.httpService.delete('deleteVersion',param).then(item=>{
        console.log("这是 delete 的 item");
        console.log(item);
        try{
          if(item.body.resultCode == "0000"){

            this.ngOnInit();
            this.showAlert("success","プロジェクトを削除しました。");
          }else{
            console.log('登録失敗、ご確認してください。');
            console.log(item);
            this.showAlert("error","登録失敗、ご確認してください。");
          }
        }catch(e){
          this.showAlert("error",e);
        }
      });
    }
  }

  // プロジェクト詳細と修正
    // // Modal を開く
  editVersionDataModal(editVersionDataModalContent, row) {
    // this.selectedContact = Object.assign({}, row);
    this.selectedVersion = Object.assign({},row);
    this.editModal = this.modal.open(editVersionDataModalContent, {
      windowClass: 'animated fadeInDown',
      size: 'lg',
    });
    this.contactFlag = false;
  }
  
    // ModalデータをAPIに更新
  /**
   * Update contact details
   *
   * @param versionEditForm      Edit form for values check
   * @param projectid      Id match to the selected row Id
   */
  versionDataUpdate(versionEditForm: NgForm, rowid) {
    var flg = true;
    if (flg && !this.selectedVersion['productid']) {
      this.showAlert("warn","プロダクト名を選択してください。");
      flg = false;
    }

    if (flg && !this.selectedVersion['versioncode']) {
      this.showAlert("warn","バージョンコードを入力してください。");
      flg = false;
    }
    if (flg && !this.selectedVersion['versionname']) {
      this.showAlert("warn","バージョン名を入力してください。");
      flg = false;
    }

    let routeif: UserInfo = this.dataFatoryService.getUserInfo();
    if (routeif != null && flg) {
      var param = {
        "loginInfo":this.pageModel.loginInfo,
        "targetUserInfo":this.pageModel.targetUserInfo,

        "rowid": this.selectedVersion.rowid,
        "productid":this.selectedVersion.productid,
        "versioncode":this.selectedVersion.versioncode,
        "versionname":this.selectedVersion.versionname,
        "description":this.selectedVersion.description,
        "downloadurl":this.selectedVersion.downloadurl,
      };
      this.httpService.useRpPost('updateVersion', param).then(item => {
        try {
          if (item.resultCode == "0000") {
  
            this.ngOnInit();
            this.showAlert("success","プロジェクト情報を改修しました");
            if (versionEditForm.valid === true) {
              versionEditForm.reset();
              this.editModal.close(versionEditForm.resetForm);
            }
          }else{
            console.log('登録失敗、ご確認してください。');
            console.log(item);
            this.showAlert("error","登録失敗、ご確認してください。");
          }
        } catch (e) {
          console.log(e);
          this.showAlert("error",e);
        }
      });
      // versionEditForm.reset();
      // this.editModal.close(versionEditForm.resetForm);
    }
  }

  // 選択したプロジェクトを複数削除
  /**
   * Delete selected contact
   */
  deleteCheckedRow() {
    for (var row of this.rows) {
      if (row.isSelected) {
        this.selected.push(row.rowid);
      }
    }

    if(this.selected.length > 0){
      if (confirm("選択したデーターを削除しますか")) {
        var query = {
          "loginInfo":this.pageModel.loginInfo,
          "targetUserInfo":this.pageModel.targetUserInfo,
          "rowidlist": this.selected,
        }
        this.httpService.useRpDelete('deleteVersions', query).then(item => {
          try {
            if (item.resultCode == "0000") {
              this.searchValue = {
                productname:'',
                versionname:''
              };
              this.ngOnInit();
              this.showAlert("success","選択したプロジェクトを削除しました");
              this.selected = [];
            }else{
              console.log('登録失敗、ご確認してください。');
              console.log(item);
              this.showAlert("error","登録失敗、ご確認してください。");
            }
          } catch (e) {
            console.log(e);
            this.showAlert("error",e);
          }
        });
      }
    }else{
      this.showAlert("warn","バージョンを選択してください。");
    }
  }


  checkAll(ev){
    this.rows.forEach(x => x.isSelected = ev.target.checked)
  }
  checkChange(ev, element) {
    this.rows.forEach(function (version) {
      if (version.rowid === element['rowid']) { version.isSelected = ev.target.checked }
    });
  }

  isAllChecked() {
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

  sortData(nm) {
    console.log("这是排序前的rows");
    console.log(this.rows);
    if (this.sortOn == 1) {
      this.rows.sort(this.alphabetically(true, nm));
      this.sortOn = 2;
    } else {
      this.rows.sort(this.alphabetically(false, nm));
      this.sortOn = 1;
    }
    console.log("这是排序后的rows");
    console.log(this.rows);
    this.valueSortFlg.productNameUp = false;
    this.valueSortFlg.productNameDown = false;
    this.valueSortFlg.versionCodeUp = false;
    this.valueSortFlg.versionCodeDown = false;
    this.valueSortFlg.versionNameUp = false;
    this.valueSortFlg.versionNameDown = false;
    switch (nm) {
      case 'productname':
        if (this.sortOn == 1) {
          this.valueSortFlg.productNameUp = true
        } else {
          this.valueSortFlg.productNameDown = true
        }
        break;
      case 'versioncode':
        if (this.sortOn == 1) {
          this.valueSortFlg.versionCodeUp = true
        } else {
          this.valueSortFlg.versionCodeDown = true
        }
        break;
      case 'versionname':
        if (this.sortOn == 1) {
          this.valueSortFlg.versionNameUp = true
        } else {
          this.valueSortFlg.versionNameDown = true
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

  /**
   * プロダクト名覧取得
   */
  protected async getProductNameList() {
    this.productNameList = [];
    let routeif: UserInfo = this.dataFatoryService.getUserInfo();
    if (routeif != null) {
      var param = {
        "loginInfo":this.pageModel.loginInfo,
        "targetUserInfo":this.pageModel.targetUserInfo,
        "projectname": this.searchValue,
      };
      var res = await this.httpService.post("/searchMyProduct",param);
      let jsonItem = typeof res.data == 'string' ? JSON.parse(res.data) : res.data;
      jsonItem.forEach(element => {
        this.productNameList.push(element);
        this.productNameList = [...this.productNameList];
      });
    }
  }

  variableReset(){
    this.rows = [];
    this.tableDisplayData = [];
    this.selectedVersion = {};
    this.selected=[];
    this.searchValue = {
      productname:'',
      versionname:''
    };
    this.addVersion = {};
    this.productNameList = [];
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
