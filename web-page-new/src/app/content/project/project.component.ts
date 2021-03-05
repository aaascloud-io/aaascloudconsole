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
  deviceList:any;
    // 选中的 device 列表
  selectedDevice = [];
    // 搜索框检索值
  searchValue:any;
  sortOn: any;
  checkOn: 1;
  show = false;

  


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
      addProject:{
        projectName:'',
        productId:'',
        projectSummary:'',
        userId:'',
      },
      projectDetail: {
        deviceCounts:'',
        groupCounts:'',
        productid:'',
        projectid:'',
        projectname:'',
        projectsummary:'',
        alive:'',
        groupList:[],
        deviceList:[],
        userId:1,
      },

      // 登录数据
      loginUser: {
        loginuserid: null,
        loginusername: '',
        loginrole: null,
        logincompanyid: '',
      },
      // 登录用数据
      userInfoParame: {
      },
      loginInfo:{},
      targetUserInfo:{},

      data:[],
      selectedData : {},
    }

      

    /**
     * OnInit
     */
  ngOnInit() {
    // 获取登录时必须的认证数据，并存在pageModal的 loginUser 和 userInfoParame 中
    let item: RouteIdIF = this.dataFatoryService.getRouteIdIF();
    this.pageModel.loginUser.loginuserid = item.uid;
    this.pageModel.loginUser.loginusername = item.login_id;
    this.pageModel.loginUser.loginrole = item.role;
    this.pageModel.loginUser.logincompanyid = item.company;

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
    this.getTabledata();

    // jsonItem.productList.forEach((elem) => {
    //   let product_info = JSON.parse(elem);
    //   this.pageModel.products.push(product_info)
    // });
    // this.pageModel.productLength = jsonItem.productCount;

  }


  // 新規プロジェクト
    // Modal を開く
  addNewProjectModal(addNewProjectModal){
    this.addModal = this.modal.open(addNewProjectModal, {
      windowClass: 'animated fadeInDown'
    });
    this.contactFlag = true;
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
    }
    console.log("这是 addNewProjectForm 的 param");
    console.log(param);
    this.httpService.useRpPost('registerProject',param).then(item=>{
      console.log("这是 addNewProjectForm 的 item");
      console.log(item);
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
  }

  // 検索機能
  searchProject(){
    console.log("这是搜索条件");
    console.log(this.searchValue);
    let routeif: UserInfo = this.dataFatoryService.getUserInfo();
    if (routeif != null) {
      var param = {
        "loginInfo":this.pageModel.loginInfo,
        "targetUserInfo":this.pageModel.targetUserInfo,
        "projectname": this.searchValue,
      };
      console.log("这是目前的 param");
      console.log(param);

      this.httpService.useRpPost('searchProjects',param).then(item=>{
        console.log("这是 searchProject 的 item");
        console.log(item);
        let jsonItem = typeof item.data == 'string' ? JSON.parse(item.data) : item.data;
        console.log("这是jsonItem的值");
        console.log(jsonItem);
        this.rows = [];
        jsonItem.forEach(element => {
          this.rows.push(element);
        });
        console.log("这是rows的data值");
        console.log(this.rows);

        this.rows = [...this.rows];
        console.log("这是...运算符后的data值");
        console.log(this.rows);
        this.getTabledata();
      });
    }
  }

  // 検索条件クリア
  clearSearchProject(){
    this.searchValue = "";
    console.log("清除搜索条件");
    console.log(this.searchValue);
    this.ngOnInit();
  }

  // プロジェクト削除
  /**
   * Delete contact row
   * @param row     Selected row for delete contact
   */
  deleteRow(row) {
    let index = 0;
    console.log("这是 delete 里面的 row");
    console.log(row);
    if (confirm(row.projectname + "を削除します。よろしいですか？")){
      let routeif: RouteIdIF = this.dataFatoryService.getRouteIdIF();
    if (routeif != null) {
      var param = {
        "loginInfo":this.pageModel.loginInfo,
        "targetUserInfo":this.pageModel.targetUserInfo,
        "projectid":row.projectid,
      };
    }
      console.log("这是 delete 的 param");
      console.log(param);
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

  /**
   * Edit selected contact row.
   *
   * @param editTableDataModalContent     Id of the edit contact model.
   * @param row     The row which needs to be edited.
   */
  // editTableDataModal(editTableDataModalContent, row) {
  //   console.log("模态框导入row");
  //   console.log(row);
  //   this.pageModel.selectedData = Object.assign({},row)
  //   console.log("模态框导入selectedData");
  //   console.log(this.pageModel.selectedData);

    
  //   this.editModal = this.modal.open(editTableDataModalContent, {
  //     windowClass: 'animated fadeInDown'
  //   });
  //   this.contactFlag = false;
  // }


  // プロジェクト詳細と修正
    // // Modal を開く
  editProjectDataModal(editProjectDataModalContent, row) {
    // this.selectedContact = Object.assign({}, row);
    this.selectedProject = Object.assign({},row);

    console.log("这是 edit 功能内的 selectedProject 值");
    console.log(this.selectedProject);

    this.editModal = this.modal.open(editProjectDataModalContent, {
      windowClass: 'animated fadeInDown'
    });
    this.contactFlag = false;
  }
    // ModalデータをAPIに更新
  /**
   * Update contact details
   *
   * @param projectEditForm      Edit form for values check
   * @param projectid      Id match to the selected row Id
   */
  projectDataUpdate(projectEditForm: NgForm, projectid) {
    let routeif: UserInfo = this.dataFatoryService.getUserInfo();
    if (routeif != null) {
      this.pageModel.projectDetail.projectid = projectid;
      this.pageModel.projectDetail.productid = this.selectedProject.productid;
      this.pageModel.projectDetail.projectname = this.selectedProject.projectname;
      this.pageModel.projectDetail.projectsummary = this.selectedProject.projectsummary;
      var param = {
        "loginInfo":this.pageModel.loginInfo,
        "targetUserInfo":this.pageModel.targetUserInfo,
        "projectid": this.pageModel.projectDetail.projectid,
        "productid": this.pageModel.projectDetail.productid,
        "projectname": this.pageModel.projectDetail.projectname,
        "projectsummary": this.pageModel.projectDetail.projectsummary,
      };
      console.log("这是目前的 param");
      console.log(param);

      this.httpService.useRpPut('updateProject', param).then(item => {
        console.log("这是目前的 item");
        console.log(item);
        try {
          if (item.resultCode == "0000") {
  
            this.ngOnInit();
            alert('プロジェクト情報を改修しました');
          if (projectEditForm.valid === true) {
  
            projectEditForm.reset();
            this.editModal.close(projectEditForm.resetForm);
          }
          }
        } catch (e) {
          console.log(e);
        }
      });
    }
  }

  // 選択したプロジェクトを複数削除
  /**
   * Delete selected contact
   */
  deleteCheckedRow() {
    console.log("这是复选后的rows");
    console.log(this.rows);
    if (confirm("選択したデーターを削除しますか")) {
      for (var row of this.rows) {
        if (row.isSelected) {
          this.selected.push(row);
        }
      }
      console.log("这是复选后的selected");
      console.log(this.selected);

      var query = {
        "loginInfo": this.pageModel.loginUser,
        "targetUserInfo":this.pageModel.targetUserInfo,
        "projectlist": this.selected,
      }
      this.httpService.useRpDelete('deleteProjects', query).then(item => {
        try {
          if (item.resultCode == "0000") {
            this.searchValue = "";
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
    console.log("这是checkall的函数内部");
    console.log(ev);
    console.log(this.rows);
    console.log(this.selectedProject);
  }
  checkChange(ev, element) {
    console.log("这是checkChange的函数内部");
    console.log(ev);
    console.log(element);
    console.log(this.rows);
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

// デバイス連携
  // Modal 開く
  deviceLinkModal(deviceLinkModalContent, row) {
    this.getDeviceList();
    this.selectedProject = Object.assign({}, row);
    this.editModal = this.modal.open(deviceLinkModalContent, {
      windowClass: 'animated fadeInDown',
      size: 'lg'
    });
  }

  async getDeviceList(){
    this.deviceList = [];
    let param = {
      "loginInfo":this.pageModel.loginInfo,
      "targetUserInfo":this.pageModel.targetUserInfo,
    };
    console.log("这里是 initData 的 param 数据");
    console.log(param);
    var res = await this.httpService.post("/getMySelectableDevices",param);
    let jsonItem = typeof res.data == 'string' ? JSON.parse(res.data) : res.data;
    jsonItem.forEach(element => {
      this.deviceList.push(element);
    });
    console.log("这是deviceList的data值");
    console.log(this.deviceList);

    this.deviceList = [...this.deviceList];
    console.log("这是...运算符后的deviceList值");
    console.log(this.deviceList);
  }

  checkAllDevice(ev){
    this.deviceList.forEach(x => x.isSelected = ev.target.checked)
    // this.selectedProject = ev.target.checked;
    console.log("这是checkall的函数内部");
    console.log(ev);
    console.log(this.rows);
    console.log(this.selectedProject);
  }
  checkChangeDevice(ev, element) {
    console.log("这是checkChangeDevice的函数内部");
    console.log(ev);
    console.log(element);
    console.log(this.deviceList);
    this.deviceList.forEach(function (device) {
      if (device.deviceid === element['deviceid']) { device.isSelected = ev.target.checked }
    });
    console.log(this.deviceList);
  }

  projectDeviceDataUpdate(projectDeviceForm,projectid){
    let routeif: UserInfo = this.dataFatoryService.getUserInfo();
    if (routeif != null) {
      if (confirm("選択したデバイスをプロジェクトに連携しますか")) {
        for (var item of this.deviceList) {
          if (item.isSelected) {
            console.log("这是标记为已选中的item");
            console.log(item);
            this.selectedDevice.push(item.deviceid);
          }
        }
        var param = {
          "loginInfo":this.pageModel.loginInfo,
          "targetUserInfo":this.pageModel.targetUserInfo,
          "userid" :this.pageModel.loginUser.loginuserid, 
          "projectid": projectid,
          "deviceList": this.selectedDevice,
        };
        console.log("这是目前的 param");
        console.log(param);
        this.httpService.useRpPut('updateProjectDevices', param).then(item => {
          console.log("这是目前的 item");
          console.log(item);
          try {
            if (item.resultCode == "0000") {
    
              this.ngOnInit();
              alert('プロジェクト情報を改修しました');
            if (projectDeviceForm.valid === true) {
    
              projectDeviceForm.reset();
              this.editModal.close(projectDeviceForm.resetForm);
            }
            }
          } catch (e) {
            console.log(e);
          }
        });
      }

    }
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
