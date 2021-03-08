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


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
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
  
  // 需要用到的数据
    // rows 用于存储核心数据
  rows: any[] = [];
  collectionSize: any;
    // 用来表示当前的页码
  page = 1;
    // 默认为一页显示10条数据
  pageSize =10;
    // 每页表格显示数据
  tableDisplayData:any;
    // 选中的单条数据
  selectedProject: any;
    // 选中的多条数据
  selected = [];
    // 待分配的硬件列表
  usableDeviceList:any;
    // 选中的 device 列表
  selectedDevice = [];
    // 搜索框检索值
  searchValue:any;
  sortOn: any;
  checkOn: 1;
  show = false;
    //已经在 project 中分配掉的 device 
  linkedDeviceList =[];

  


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
    ) { 
    }

    protected pageModel = {
      USERCODE:null,
      addList: [],
      dataAll: [],
      productList: [],
      data:[],
      selectedData : {},
      
      // 登录用数据
      loginInfo:{},
      targetUserInfo:{},
      // 新规项目数据存储
      addProject:{
        projectName:'',
        productId:'',
        projectSummary:'',
        userId:'',
      },
    }

    /**
     * OnInit
     */
  ngOnInit() {
    // 获取登录时必须的认证数据，并存在 pageModal的 loginUser 和 userInfoParame 中
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
    };
    var res = await this.httpService.post("/getProjects",param);

    let jsonItem = typeof res.data == 'string' ? JSON.parse(res.data) : res.data;
    jsonItem.forEach(element => {
      this.rows.push(element);
    });
    this.rows = [...this.rows];
    // 获取当前页表格内显示的值
    this.getTabledata();
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
    let routeif: RouteIdIF = this.dataFatoryService.getRouteIdIF();
    if (routeif != null) {
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
            alert("プロジェクトを登録しました。");
          }
        }catch(e){
          alert(e);
        }
      });
      if (NewProjectForm.valid === true) {
        NewProjectForm.reset();
        this.addModal.close(NewProjectForm.resetForm);
      }
      console.log("这是一个测试，能看到我说明被执行了");
    }
  }

  // 検索機能
  searchProject(){
    let routeif: UserInfo = this.dataFatoryService.getUserInfo();
    if (routeif != null) {
      var param = {
        "loginInfo":this.pageModel.loginInfo,
        "targetUserInfo":this.pageModel.targetUserInfo,
        "projectname": this.searchValue,
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
    this.searchValue = "";
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
      // var res = await this.httpService.post("/deleteProject",param);
      // console.log("这是 delete 的 res");
      // console.log(res);
      this.httpService.delete('deleteProject',param).then(item=>{
        console.log("这是 delete 的 item");
        console.log(item);
        try{
          if(item.body.resultCode == "0000"){
            this.ngOnInit();
            alert("プロジェクトを削除しました。");
          }
        }catch(e){
          alert(e);
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
    let routeif: UserInfo = this.dataFatoryService.getUserInfo();
    if (routeif != null) {
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
            alert('プロジェクト情報を改修しました');
            this.ngOnInit();
            if (projectEditForm.valid === true) {
              projectEditForm.reset();
              this.editModal.close(projectEditForm.resetForm);
            }
            this.selectedProject={};
          }
        } catch (e) {
          console.log(e);
        }
      });
    }
  }

  // 選択したプロジェクトを複数削除
  deleteCheckedRow() {
    if (confirm("選択したデーターを削除しますか")) {
      for (var row of this.rows) {
        if (row.isSelected) {
          this.selected.push(row);
        }
      }
      var query = {
        "loginInfo": this.pageModel.loginInfo,
        "targetUserInfo":this.pageModel.targetUserInfo,
        "projectlist": this.selected,
      }
      this.httpService.useRpDelete('deleteProjects', query).then(item => {
        try {
          if (item.resultCode == "0000") {
            this.searchValue = "";
            this.selected=[];
            this.ngOnInit();
            alert('選択したプロジェクトを削除しました');
          }
        } catch (e) {
          console.log(e);
        }
      });
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
    console.log(this.rows);
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
    if (this.sortOn == 1) {
      this.rows.sort((b, a) => a[nm].localeCompare(b[nm]));
      this.sortOn = 2;
    } else {
      this.rows.sort((a, b) => a[nm].localeCompare(b[nm]));
      this.sortOn = 1;
    }
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

  async getUsableDeviceList(){
    this.usableDeviceList = [];
    let param = {
      "loginInfo":this.pageModel.loginInfo,
      "targetUserInfo":this.pageModel.targetUserInfo,
    };
    console.log("这里是 initData 的 param 数据");
    console.log(param);
    var res = await this.httpService.post("/getMySelectableDevices",param);
    let jsonItem = typeof res.data == 'string' ? JSON.parse(res.data) : res.data;
    jsonItem.forEach(element => {
      this.usableDeviceList.push(element);
    });
    console.log("这是deviceList的data值");
    console.log(this.usableDeviceList);

    this.usableDeviceList = [...this.usableDeviceList];
    console.log("这是...运算符后的deviceList值");
    console.log(this.usableDeviceList);
  }

  checkAllUsableDevice(ev){
    this.usableDeviceList.forEach(x => x.isSelected = ev.target.checked)
    // this.selectedProject = ev.target.checked;
    console.log("这是checkall的函数内部");
    console.log(ev);
    console.log(this.rows);
    console.log(this.selectedProject);
  }
  checkChangeUsableDevice(ev, element) {
    console.log("这是checkChangeDevice的函数内部");
    console.log(ev);
    console.log(element);
    console.log(this.usableDeviceList);
    this.usableDeviceList.forEach(function (device) {
      if (device.deviceid === element['deviceid']) { device.isSelected = ev.target.checked }
    });
    console.log(this.usableDeviceList);
  }

  projectDeviceDataUpdate(projectDeviceForm,projectid){
    let routeif: UserInfo = this.dataFatoryService.getUserInfo();
    if (routeif != null) {
      if (confirm("選択したデバイスをプロジェクトに連携しますか")) {
        for (var item of this.usableDeviceList) {
          if (item.isSelected) {
            console.log("这是标记为已选中的item");
            console.log(item);
            this.selectedDevice.push(item);
          }
        }
        var param = {
          "loginInfo":this.pageModel.loginInfo,
          "targetUserInfo":this.pageModel.targetUserInfo,
          "userid" :this.pageModel.loginInfo['loginuserid'], 
          "projectid": projectid,
          "deviceList": this.selectedDevice,
        };
        console.log("这是目前的 param");
        console.log(param);
        this.httpService.useRpPut('addProjectDevices', param).then(item => {
          console.log("这是目前的 item");
          console.log(item);
          try {
            if (item.resultCode == "0000") {
              this.selectedDevice=[];
              alert('プロジェクト情報を改修しました');
              if (projectDeviceForm.valid === true) {
                projectDeviceForm.reset();
                this.editModal.close(projectDeviceForm.resetForm);
              }
            }
            this.ngOnInit();
          } catch (e) {
            console.log(e);
            this.ngOnInit();
          };
        });
      }
    }
    this.ngOnInit();
  }

  // project　連携　DeviceList　一覧
    // Modal 開く
  deviceLinkListModal(deviceLinkListModalContent, row) {
    this.getLinkedDeviceList(row.projectid);
    this.selectedProject = Object.assign({}, row);
    this.editModal = this.modal.open(deviceLinkListModalContent, {
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
    console.log("这里是 initData 的 param 数据");
    console.log(param);
    var res = await this.httpService.post("/getProject",param);
    console.log("这里是请求到的 res 数据");
    console.log(res);
    var jsonItem = typeof res.data == 'string' ? JSON.parse(res.data) : res.data;
    console.log("jsonItem");
    console.log(jsonItem);
    jsonItem.deviceList.forEach(element => {
      this.linkedDeviceList.push(element);
    });
    console.log("这是deviceList的data值");
    console.log(this.linkedDeviceList);
    this.linkedDeviceList = [...this.linkedDeviceList];
  }

  checkAllLinkedDevice(ev){
    this.linkedDeviceList.forEach(x => x.isSelected = ev.target.checked)
    // this.selectedProject = ev.target.checked;
    console.log("这是checkall的函数内部");
    console.log(ev);
    console.log(this.rows);
    console.log(this.linkedDeviceList);
  }
  checkChangeLinkedDevice(ev, element) {
    console.log("这是checkChangeLinkedDevice的函数内部");
    console.log(ev);
    console.log(element);
    console.log(this.linkedDeviceList);
    this.linkedDeviceList.forEach(function (device) {
      if (device.deviceid === element['deviceid']) { device.isSelected = ev.target.checked }
    });
    console.log(this.linkedDeviceList);
  }

  projectLinkedDeviceDataUpdate(projectLinkedDeviceForm,projectid){
    let routeif: UserInfo = this.dataFatoryService.getUserInfo();
    if (routeif != null) {
      if (confirm("選択したデバイスをプロジェクトから削除しますか")) {
        for (var item of this.linkedDeviceList) {
          if (item.isSelected) {
            console.log("这是标记为已选中的item");
            console.log(item);
            this.selectedDevice.push(item);
          }
        }
        var param = {
          "loginInfo":this.pageModel.loginInfo,
          "targetUserInfo":this.pageModel.targetUserInfo,
          
          "projectid": projectid,
          "deviceList": this.selectedDevice,
        };
        console.log("这是目前的 param");
        console.log(param);
        this.httpService.useRpPut('deleteProjectDevices', param).then(item => {
          console.log("这是目前的 item");
          console.log(item);
          try {
            if (item.resultCode == "0000") {
              this.selectedDevice=[];
              alert('プロジェクトからデバイスを削除しました。');
              if (projectLinkedDeviceForm.valid === true) {
                projectLinkedDeviceForm.reset();
                this.editModal.close(projectLinkedDeviceForm.resetForm);
              }
            }
          } catch (e) {
            console.log(e);
            
          }
        });
      }
    }
    this.ngOnInit();
  }

  // デバイス検索（本地検索）、機能廃棄、API検索に交換
    // 用法：
        // 在搜索框中监测按键抬起  (keyup)='updateFilter($event)'
  /**
   * Search contact from contact table
   *
   * @param event     Convert value uppercase to lowercase;
   */
  // updateFilter(event) {
  //   const val = event.target.value;
  //   this.rows = [...this.temp2];
  //   this.temp = [...this.rows];
  //   const temp = this.rows.filter(function (d) {
  //     return d.projectname.toLowerCase().indexOf(val) !== -1 || !val;
  //   });
  //   this.rows = temp;
  //   this.table.offset = 0;
  // }





////////////////////////////////////////////////////////////////////////////
// 以下为垃圾代码
  /**
   * Overlay add/remove fuction in responsive
   *
   * @param event     Overlay click event
   */
  // contentOverlay(event) {
  //   const toggleIcon = document.getElementById('sidebar-left');
  //   const toggle = document.getElementById('content-overlay');
  //   if (event.currentTarget.className === 'content-overlay show') {
  //     this._renderer.removeClass(toggleIcon, 'show');
  //     this._renderer.removeClass(toggle, 'show');
  //   }
  // }

  /**
   * Set the phone number format
   */
  // onFormat() {
  //   if (this.contactFlag === true) {
  //     this.value = this.contactPhone;
  //   } else if (this.contactFlag === false) {
  //     this.value = this.selectedContact['phone'];
  //   }

  //   let country, city, number;

  //   switch (this.value.length) {
  //     case 6:
  //       country = 1;
  //       city = this.value.slice(0, 3);
  //       number = this.value.slice(3);
  //       break;

  //     case 7:
  //       country = this.value[0];
  //       city = this.value.slice(1, 4);
  //       number = this.value.slice(4);
  //       break;

  //     case 8:
  //       country = this.value.slice(0, 3);
  //       city = this.value.slice(3, 5);
  //       number = this.value.slice(5);
  //       break;

  //     default:
  //       return this.value;
  //   }
  //   if (country === 1) {
  //     country = '';
  //   }

  //   number = number.slice(0, 3) + '-' + number.slice(3);

  //   const no = '(' + city + ')' + '-' + number;
  //   if (this.contactFlag === true) {
  //     this.contactPhone = no;
  //   } else if (this.contactFlag === false) {
  //     this.selectedContact['phone'] = no;
  //   }
  // }

  /**
   * Sidebar open/close in responsive
   *
   * @param event     Sidebar open/close
   */
  // sidebar(event) {
  //   const toggleIcon = document.getElementById('sidebar-left');
  //   const toggle = document.getElementById('content-overlay');
  //   if (event.currentTarget.className === 'sidebar-toggle d-block d-lg-none') {
  //     this._renderer.addClass(toggleIcon, 'show');
  //     this._renderer.addClass(toggle, 'show');
  //   }
  // }

  /**
   * New contact add to the table
   *
   * @param addForm     Add contact form
   */
  // addNewContact(addForm: NgForm) {
  //   if (this.contactImage == null) {
  //     this.contactImage = '../../../assets/images/portrait/small/default.png';
  //   } else {
  //     this.contactImage = this.contactImage;
  //   }

  //   if (this.contactactive === undefined) {
  //     this.contactactive = 'away';
  //   } else {
  //     this.contactactive = this.contactactive;
  //   }

  //   if (addForm.valid === true) {
  //     this.rows.push(
  //       new Contact(
  //         this.rows.length + 1,
  //         this.contactName,
  //         this.contactEmail,
  //         this.contactPhone,
  //         this.contactImage,
  //         this.contactFavorite,
  //         this.contactactive
  //       )
  //     );
  //     this.rows = [...this.rows];
  //     addForm.reset();
  //     this.addModal.close(addForm.resetForm);
  //   }
  // }

  /**
   * favorite set when add contact
   *
   * @param event     favorite set on click event
   */
  // addFavoriteImage(event) {
  //   if (event.target.checked === true) {
  //     this.contactFavorite = true;
  //   } else {
  //     this.contactFavorite = false;
  //   }
  // }

   /**
   * Contact changed to favorite or non-favorite
   *
   * @param row     Row of the favorite contact
   */
  // favoriteChange(row) {
  //   if (row.isFavorite) {
  //     row.isFavorite = row.isFavorite ? false : true;
  //   } else {
  //     row.isFavorite = true;
  //   }
  // }

    /**
   * Update contact details
   *
   * @param editForm      Edit form for values check
   * @param id      Id match to the selected row Id
   */
  // onUpdate(editForm: NgForm, id) {
  //   for (const row of this.rows) {
  //     if (row.id === id && editForm.valid === true) {
  //       row.name = this.selectedContact['name'];
  //       row.email = this.selectedContact['email'];
  //       row.phone = this.selectedContact['phone'];
  //       this.editModal.close(editForm.resetForm);
  //       break;
  //     }
  //   }
  // }

  /**
   * Add new contact
   *
   * @param addNewProjectModal      Id of the add contact modal;
   */
  // addTableDataModal(addTableDataModalContent) {
  //   this.addModal = this.modal.open(addTableDataModalContent, {
  //     windowClass: 'animated fadeInDown'
  //   });
  //   this.contactFlag = true;
  // }

   /**
   * Selected contact
   *
   * @param selected      Selected contact;
   */
  // onSelectContact({ selected }) {
  //   this.selected.splice(0, this.selected.length);
  //   this.selected.push(...selected);
  // }

   /**
   * Choose contact image
   *
   * @param event     Select contact image;
   */
  // preview(event) {
  //   const reader = new FileReader();
  //   reader.onload = (e: any) => {
  //     this.contactImage = e.target.result;
  //   };
  //   reader.readAsDataURL(event.target.files[0]);
  // }



}
