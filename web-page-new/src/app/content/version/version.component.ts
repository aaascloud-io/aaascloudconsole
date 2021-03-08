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
  selector: 'app-version',
  templateUrl: './version.component.html',
  styleUrls: ['./version.component.css']
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
  selectedVersion: any;
    // 选中的多条数据
  selected = [];
    // 搜索框检索值
  searchValue = {
    productname:'',
    versionname:''
  };
  sortOn: any;
  checkOn: 1;
  show = false;
  // 新规 version 数据
  addVersion = {
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
    console.log("从api 获取的 rows 值");
    console.log(this.rows);
    this.getTabledata();
  }


  // 新規プロジェクト
    // Modal を開く
  addNewVersionModal(addNewVersion){
    this.addModal = this.modal.open(addNewVersion, {
      windowClass: 'animated fadeInDown'
    });
    this.contactFlag = true;
  }
    // ModalデータをAPIに更新
  addNewVersionForm(NewVersionForm:NgForm){
    let routeif: RouteIdIF = this.dataFatoryService.getRouteIdIF();
    if (routeif != null) {
      var param = {
        // 登録データ
        "loginInfo":this.pageModel.loginInfo,
        "targetUserInfo":this.pageModel.targetUserInfo,
        // プロジェクト更新データ
        "productid": this.addVersion['productid'],
        "versioncode": this.addVersion['versioncode'],
        "versionname": this.addVersion['versionname'],
        "description": this.addVersion['description'],
        "downloadurl": this.addVersion['downloadurl'],
      }
    }
    console.log("这是 addNewProjectForm 的 param");
    console.log(param);
    this.httpService.useRpPost('registerVersion',param).then(item=>{
      console.log("这是 addNewProjectForm 的 item");
      console.log(item);
      try{
        if(item.resultCode == "0000"){
          this.addVersion={},
          this.ngOnInit();
          alert("プロジェクトを登録しました。");
        }
      }catch(e){
        alert(e);
      }
    });

    if (NewVersionForm.valid === true) {

      NewVersionForm.reset();
      this.addModal.close(NewVersionForm.resetForm);
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
        "productname": this.searchValue.productname,
        "versionname": this.searchValue.versionname,
      };
      console.log("这是目前的 param");
      console.log(param);

      this.httpService.useRpPost('searchVersions',param).then(item=>{
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
    this.searchValue = {
      productname:'',
      versionname:''
    };
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
    if (confirm(row.versionname + "を削除します。よろしいですか？")){
      let routeif: RouteIdIF = this.dataFatoryService.getRouteIdIF();
    if (routeif != null) {
      var param = {
        "loginInfo":this.pageModel.loginInfo,
        "targetUserInfo":this.pageModel.targetUserInfo,
        "rowid":row.rowid,
      };
    }
      console.log("这是 delete 的 param");
      console.log(param);
      // var res = await this.httpService.post("/deleteProject",param);
      // console.log("这是 delete 的 res");
      // console.log(res);
      this.httpService.delete('deleteVersion',param).then(item=>{
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
  editVersionDataModal(editVersionDataModalContent, row) {
    // this.selectedContact = Object.assign({}, row);
    this.selectedVersion = Object.assign({},row);

    console.log("这是 edit 功能内的 selectedVersion 值");
    console.log(this.selectedVersion);

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
    let routeif: UserInfo = this.dataFatoryService.getUserInfo();
    if (routeif != null) {
      var param = {
        "loginInfo":this.pageModel.loginInfo,
        "targetUserInfo":this.pageModel.targetUserInfo,

        "rowid": this.selectedVersion.rowid,
        "productid":this.selectedVersion.productid,
        "productname":this.selectedVersion.productname,
        "versioncode":this.selectedVersion.versioncode,
        "versionname":this.selectedVersion.versionname,
        "description":this.selectedVersion.description,
        "downloadurl":this.selectedVersion.downloadurl,
      };
      console.log("这是目前的 param");
      console.log(param);

      this.httpService.useRpPost('updateVersion', param).then(item => {
        console.log("这是目前的 item");
        console.log(item);
        try {
          if (item.resultCode == "0000") {
  
            this.ngOnInit();
            alert('プロジェクト情報を改修しました');
          if (versionEditForm.valid === true) {
  
            versionEditForm.reset();
            this.editModal.close(versionEditForm.resetForm);
          }
          }
        } catch (e) {
          console.log(e);
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
    console.log("这是复选后的rows");
    console.log(this.rows);
    if (confirm("選択したデーターを削除しますか")) {
      for (var row of this.rows) {
        if (row.isSelected) {
          this.selected.push(row.rowid);
        }
      }
      console.log("这是复选后的selected");
      console.log(this.selected);

      var query = {
        "loginInfo":this.pageModel.loginInfo,
        "targetUserInfo":this.pageModel.targetUserInfo,
        "rowidlist": this.selected,
      }
      console.log("这是复选后的query");
      console.log(query);
      this.httpService.useRpDelete('deleteVersions', query).then(item => {
        console.log('这是item');
        console.log(item);
        try {
          if (item.resultCode == "0000") {
            this.searchValue = {
              productname:'',
              versionname:''
            };
            this.ngOnInit();
            alert('選択したプロジェクトを削除しました');
            this.selected = [];
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
    console.log(this.selectedVersion);
  }
  checkChange(ev, element) {
    console.log("这是checkChange的函数内部");
    console.log(ev);
    console.log(element);
    console.log(this.rows);
    this.rows.forEach(function (version) {
      if (version.rowid === element['rowid']) { version.isSelected = ev.target.checked }
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
