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
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
  providers: [MessageService],
})
export class ProjectComponent implements OnInit {

  name = 'Angular';
  selectedContact: any;
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
    // rows サーバから取ったメインデータ
  rows: any[] = [];
    // 今メインデータ総数
  collectionSize: any;
    // 今のページ
  page = 1;
    // 1ページに展示するデータ数量
  pageSize =10;
    // 1ページに展示するデータ
  tableDisplayData:any;
    // 選択されたプロダクト
  selectedProject: any;
    // 複数選択されたプロダクト
  selected = [];
    // 利用できるデバイスリスト
  usableDeviceList:any;
    // 複数選択されたデバイスリスト
  selectedDevice = [];
    // 検索値
  searchValue = {
    projectname:'',
    productname:''
  };
  sortOn: any;
  checkOn: 1;
  show = false;
    // プロジェクトに配られたデバイスリスト
  linkedDeviceList =[];
    // すべてのproduct typeを取る
  productTypes = [];
    // すべてのproductName
  productNameList = [];
  valueSortFlg = {
    projectNameUp : false,
    projectNameDown : false,
    productNameUp : false,
    productNameDown : false,
    deviceCountsUp : false,
    deviceCountsDown : false,
    groupCountsUp : false,
    groupCountsDown : false,
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
      data:[],
      selectedData : {},
      
      // 登録用認証データ
      loginInfo:{},
      targetUserInfo:{},
      // 新規項目データ
      addProject:{
        projectName:'',
        productId:'',
        productname:'',
        projectSummary:'',
        userId:'',
      },
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
    this.rows = [];
    let param = {
      "loginInfo":this.pageModel.loginInfo,
      "targetUserInfo":this.pageModel.targetUserInfo,
    };
    var res = await this.httpService.post("/getProjects",param);
    let jsonItem = typeof res.data == 'string' ? JSON.parse(res.data) : res.data;
    jsonItem.forEach(element => {
      this.rows.push(element);
    });
    this.rows = [...this.rows];
    this.getTabledata();
    this.getProductTypes();
    this.getProductNameList();
    console.log("rows 数据");
    console.log(this.rows);
  }


  // 新規プロジェクト
    // Modal を開く
  addNewProjectModal(addNewProjectModal){
    this.addModal = this.modal.open(addNewProjectModal, {
      windowClass: 'animated fadeInDown'
    });
  }
    // ModalデータをAPIに更新
  addNewProjectForm(NewProjectForm:NgForm){
    var flg = true;
    if (flg && !this.pageModel.addProject.projectName) {
      this.showAlert("warn", "プロジェクト名を入力してください。");
      flg = false;
    }

    if (flg && !this.pageModel.addProject.productId) {
      this.showAlert("warn", "プロダクト名を選択してください。");
      flg = false;
    }

    let routeif: RouteIdIF = this.dataFatoryService.getRouteIdIF();
    if (routeif != null && flg) {
      var param = {
        // 登録データ
        "loginInfo":this.pageModel.loginInfo,
        "targetUserInfo":this.pageModel.targetUserInfo,
        // プロジェクト更新データ
        "projectname": this.pageModel.addProject.projectName,
        "productid":this.pageModel.addProject.productId,
        "projectsummary":this.pageModel.addProject.projectSummary,
      }
      this.httpService.useRpPost('registerProject',param).then(item=>{
        try{
          if(item.resultCode == "0000"){
            this.pageModel.addProject.projectName = '';
            this.pageModel.addProject.productId = '';
            this.pageModel.addProject.projectSummary = '';
            this.ngOnInit();
            this.showAlert("success", "プロジェクトを登録しました。");
          }else{
            console.log('登録失敗、ご確認してください。');
            console.log(item);
            this.showAlert("error", "登録失敗、ご確認してください。");
          }
        }catch(e){
          console.log('登録失敗、ご確認してください。');
          console.log(e);
          this.showAlert("error", e);
        }
      });
      if (NewProjectForm.valid === true) {
        NewProjectForm.reset();
        this.addModal.close(NewProjectForm.resetForm);
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
        "projectname": this.searchValue.projectname,
        "productname":this.searchValue.productname,
      };
      this.httpService.useRpPost('searchProjects',param).then(item=>{
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
      projectname:'',
      productname:''
    };
    this.ngOnInit();
  }

  // プロジェクト削除
  deleteRow(row) {
    if (confirm(row.projectname + "を削除します。よろしいですか？")){
      let routeif: RouteIdIF = this.dataFatoryService.getRouteIdIF();
      if (routeif != null) {
        var param = {
          "loginInfo":this.pageModel.loginInfo,
          "targetUserInfo":this.pageModel.targetUserInfo,
          "projectid":row.projectid,
        };
      }
      console.log("单个删除的传入参数");
      console.log(param);
      // var res = await this.httpService.post("/deleteProject",param);
      // console.log("这是 delete 的 res");
      // console.log(res);
      this.httpService.delete('deleteProject',param).then(item=>{
        try{
          if(item.body.resultCode == "0000"){
            this.ngOnInit();
            this.showAlert("success", "プロジェクトを削除しました。");
          }else{
            console.log('削除失敗、ご確認してください。');
            console.log(item);
            this.showAlert("error", "削除失敗、ご確認してください。");
          }
        }catch(e){
          this.showAlert("error", e);
        }
      });
    }
  }


  // プロジェクト詳細と修正
    // // Modal を開く
  editProjectDataModal(editProjectDataModalContent, row) {
    this.selectedProject = Object.assign({},row);
    this.editModal = this.modal.open(editProjectDataModalContent, {
      windowClass: 'animated fadeInDown'
    });
  }
    // ModalデータをAPIに更新
  projectDataUpdate(projectEditForm: NgForm, projectid) {
    var flg = true;
    if (flg && !this.selectedProject.projectname) {
      this.showAlert("warn", "プロジェクト名を入力してください。");
      flg = false;
    }

    if (flg && !this.selectedProject.productid) {
      this.showAlert("warn", "プロダクト名を選択してください。");
      flg = false;
    }

    let routeif: UserInfo = this.dataFatoryService.getUserInfo();
    if (routeif != null　&& flg) {
      var param = {
        "loginInfo":this.pageModel.loginInfo,
        "targetUserInfo":this.pageModel.targetUserInfo,
        "projectid": projectid,
        "productid": this.selectedProject.productid,
        "projectname": this.selectedProject.projectname,
        "projectsummary": this.selectedProject.projectsummary,
      };
      this.httpService.useRpPut('updateProject', param).then(item => {
        try {
          if (item.resultCode == "0000") {
            this.showAlert("success", "プロジェクト情報を改修しました");
            this.ngOnInit();
            if (projectEditForm.valid === true) {
              projectEditForm.reset();
              this.editModal.close(projectEditForm.resetForm);
            }
            this.selectedProject={};
          }else{
            console.log('改修失敗、ご確認してください。');
            console.log(item);
            this.showAlert("error", "改修失敗、ご確認してください。");
          }
        } catch (e) {
          console.log(e);
          alert(e);
          this.showAlert("error", e);
        }
      });
    }
  }

  // 選択したプロジェクトを複数削除
  deleteCheckedRow() {
    for (var row of this.rows) {
      if (row.isSelected) {
        this.selected.push(row);
      }
    }
    if(this.selected.length > 0){
      if (confirm("選択したデーターを削除しますか")) {
          var query = {
            "loginInfo": this.pageModel.loginInfo,
            "targetUserInfo":this.pageModel.targetUserInfo,
            "projectlist": this.selected,
          }
          this.httpService.useRpDelete('deleteProjects', query).then(item => {
            try {
              if (item.resultCode == "0000") {
                this.searchValue = {
                  projectname:'',
                  productname:''
                };;
                this.selected=[];
                this.ngOnInit();
                this.showAlert("success", "選択したプロジェクトを削除しました");
              }else{
                console.log('削除失敗、ご確認してください。');
                console.log(item);
                this.showAlert("error", "削除失敗、ご確認してください。");
              }
            } catch (e) {
              console.log(e);
              this.showAlert("error", e);
            }
          });
      }
    }else{
      this.showAlert("warn", "プロジェクトを選択してください。");
    }
  }


  checkAll(ev){
    this.rows.forEach(x => x.isSelected = ev.target.checked)
    // this.selectedProject = ev.target.checked;
  }
  checkChange(ev, element) {
    this.rows.forEach(function (project) {
      if (project.projectid === element['projectid']) { project.isSelected = ev.target.checked }
    });
  }

  isAllChecked() {

  }

  getTabledata() {
    this.tableDisplayData = this.rows;
    // 获取总页码
    this.collectionSize = this.tableDisplayData.length;
    // 每个元素添加了 isSelected 属性
    this.tableDisplayData.forEach(x => x.isSelected = false)
    // this.tableDisplayData = this.PaginationData();
    // this.PaginationData;
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
    console.log(nm);
    if (this.sortOn == 1) {
      this.rows.sort(this.alphabetically(true, nm));
      this.sortOn = 2;
    } else {
      this.rows.sort(this.alphabetically(false, nm));
      this.sortOn = 1;
    }
    console.log("这是排序后的rows");
    console.log(this.rows);
    this.valueSortFlg.projectNameUp = false;
    this.valueSortFlg.projectNameDown = false;
    this.valueSortFlg.productNameUp = false;
    this.valueSortFlg.productNameDown = false;
    this.valueSortFlg.deviceCountsUp = false;
    this.valueSortFlg.deviceCountsDown = false;
    this.valueSortFlg.groupCountsUp = false;
    this.valueSortFlg.groupCountsDown = false;
    switch (nm) {
      case 'projectname':
        if (this.sortOn == 1) {
          this.valueSortFlg.projectNameUp = true
        } else {
          this.valueSortFlg.projectNameDown = true
        }
        break;
      case 'productname':
        if (this.sortOn == 1) {
          this.valueSortFlg.productNameUp = true
        } else {
          this.valueSortFlg.productNameDown = true
        }
        break;
      case 'deviceCounts':
        if (this.sortOn == 1) {
          this.valueSortFlg.deviceCountsUp = true
        } else {
          this.valueSortFlg.deviceCountsDown = true
        }
        break;
      case 'groupCounts':
        if (this.sortOn == 1) {
          this.valueSortFlg.groupCountsUp = true
        } else {
          this.valueSortFlg.groupCountsDown = true
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

// デバイス連携追加
  // Modal 開く
  deviceLinkAddModal(deviceLinkAddModalContent, row) {
    this.getUsableDeviceList();
    this.selectedProject = Object.assign({}, row);
    this.editModal = this.modal.open(deviceLinkAddModalContent, {
      windowClass: 'animated fadeInDown',
      size: 'lg'
    });
  }
  // 利用できるデバイスListを取得
  async getUsableDeviceList(){
    this.usableDeviceList = [];
    let param = {
      "loginInfo":this.pageModel.loginInfo,
      "targetUserInfo":this.pageModel.targetUserInfo,
    };
    var res = await this.httpService.post("/getMySelectableDevices",param);
    let jsonItem = typeof res.data == 'string' ? JSON.parse(res.data) : res.data;
    jsonItem.forEach(element => {
      this.usableDeviceList.push(element);
    });
    this.usableDeviceList = [...this.usableDeviceList];
  }

  checkAllUsableDevice(ev){
    this.usableDeviceList.forEach(x => x.isSelected = ev.target.checked)
  }
  checkChangeUsableDevice(ev, element) {
    this.usableDeviceList.forEach(function (device) {
      if (device.deviceid === element['deviceid']) { device.isSelected = ev.target.checked }
    });
  }

  projectDeviceDataUpdate(projectDeviceForm,projectid){
    let routeif: UserInfo = this.dataFatoryService.getUserInfo();
    if (routeif != null) {
      for (var item of this.usableDeviceList) {
        if (item.isSelected) {
          this.selectedDevice.push(item);
        }
      }
      if(this.selectedDevice.length > 0){
        if (confirm("選択したデバイスをプロジェクトに連携しますか")) {
          console.log("这是 this.selectedDevice");
          console.log(this.selectedDevice);
          var param = {
            "loginInfo":this.pageModel.loginInfo,
            "targetUserInfo":this.pageModel.targetUserInfo,
            "projectid": projectid,
            "deviceList": this.selectedDevice,
          };
          this.httpService.useRpPut('addProjectDevices', param).then(item => {
            try {
              if (item.resultCode == "0000") {
                // this.selectedDevice=[];
                this.showAlert("success", "プロジェクトにデバイスを追加しました");
                if (projectDeviceForm.valid === true) {
                  projectDeviceForm.reset();
                  this.editModal.close(projectDeviceForm.resetForm);
                }
              }else{
                console.log('更新失敗、ご確認してください。');
                console.log(item);
                this.showAlert("error", "更新失敗、ご確認してください。");
              }
              this.ngOnInit();
            } catch (e) {
              console.log(e);
              alert(e);
              this.ngOnInit();
            };
          });
        }
      }else{
        this.showAlert("warn", "デバイスを選択してください。");
      }
    }
  }

  // project　連携した　DeviceList　一覧
    // Modal 開く
  deviceLinkListModal(deviceLinkDeleteModalContent, row) {
    this.getLinkedDeviceList(row.projectid);
    this.selectedProject = Object.assign({}, row);
    this.editModal = this.modal.open(deviceLinkDeleteModalContent, {
      windowClass: 'animated fadeInDown',
      size: 'lg'
    });
  }
  async getLinkedDeviceList(projectid){
    this.linkedDeviceList = [];
    let param = {
      "loginInfo":this.pageModel.loginInfo,
      "targetUserInfo":this.pageModel.targetUserInfo,
      "userid":this.pageModel.loginInfo["loginuserid"],
      "projectid": projectid,
    };
    var res = await this.httpService.post("/getProject",param);
    var jsonItem = typeof res.data == 'string' ? JSON.parse(res.data) : res.data;
    jsonItem.deviceList.forEach(element => {
      this.linkedDeviceList.push(element);
    });
    this.linkedDeviceList = [...this.linkedDeviceList];
  }

  checkAllLinkedDevice(ev){
    this.linkedDeviceList.forEach(x => x.isSelected = ev.target.checked)
    // this.selectedProject = ev.target.checked;
  }
  checkChangeLinkedDevice(ev, element) {
    this.linkedDeviceList.forEach(function (device) {
      if (device.deviceid === element['deviceid']) { device.isSelected = ev.target.checked }
    });
  }
  // プロジェクトに連携したデバイスを削除
  projectLinkedDeviceDataUpdate(projectLinkedDeviceForm,projectid){
    let routeif: UserInfo = this.dataFatoryService.getUserInfo();
    if (routeif != null) {
      for (var item of this.linkedDeviceList) {
        if (item.isSelected) {
          this.selectedDevice.push(item);
        }
      }
      if(this.selectedDevice.length >0){
        if (confirm("選択したデバイスをプロジェクトから削除しますか")) {
          var param = {
            "loginInfo":this.pageModel.loginInfo,
            "targetUserInfo":this.pageModel.targetUserInfo,
            
            "projectid": projectid,
            "deviceList": this.selectedDevice,
          };
          this.httpService.useRpPut('deleteProjectDevices', param).then(item => {
            try {
              if (item.resultCode == "0000") {
                this.selectedDevice=[];
                this.showAlert("success", "プロジェクトからデバイスを削除しました。");
                if (projectLinkedDeviceForm.valid === true) {
                  projectLinkedDeviceForm.reset();
                  this.editModal.close(projectLinkedDeviceForm.resetForm);
                }
              }else{
                console.log('削除失敗、ご確認してください。');
                console.log(item);
                this.showAlert("error", "削除失敗、ご確認してください。");
              }
              this.ngOnInit();
            } catch (e) {
              console.log(e);
              this.showAlert("error", e);
              this.ngOnInit();
            }
          });
        }
      }else{
        this.showAlert("warn", "デバイスを選択してください。");
      }
    }
  }


  /**
   * プロダクトタイプ一覧取得
   */
  protected async getProductTypes() {
    this.httpService.useGet('getProductTypeAll').then(item => {
      try {
        if (item) {
          this.productTypes = item;
          console.log(item);
          console.log("プロダクトタイプの取得は成功しました。");
        } else {
          console.log("プロダクトタイプの取得は失敗しました。");
          this.showAlert("error", "プロダクトタイプの取得は失敗しました。");
        }
      } catch (e) {
        console.log("プロダクトタイプの取得は失敗しました。");
        this.showAlert("error", e);
      }
    });
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

  viewProjectLinkedDevice(viewProjectLinkedDeviceForm){
    viewProjectLinkedDeviceForm.reset();
    this.editModal.close(viewProjectLinkedDeviceForm.resetForm);
  }

  variableReset(){
    this.rows = [];
    this.tableDisplayData = [];
    this.selectedProject = {};
    this.selected=[];
    this.usableDeviceList =[];
    this.selectedDevice = [];
    this.searchValue = {
      projectname:'',
      productname:''
    };
    this.linkedDeviceList =[];
    this.productTypes = [];
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