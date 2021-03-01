import { Component, OnInit, ViewChild, EventEmitter, Output, Renderer2 } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import * as XLSX from 'xlsx';
import { AlertService } from '../../_services/alert.service';
import { HttpService } from 'src/app/_services/HttpService';
import { UserInfo } from '../../_common/_interface/userInfo'
import { DataFatoryService } from 'src/app/_services/DataFatoryService';
import { RouteIdIF } from 'src/app/_common/_Interface/RouteIdIF';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

class Contact {
  constructor(
    public id: number,
    public userid: number,
    public username: string,
    public companyid: number,
    public loginid: string,
    public role: number,
    public upperuserid: string,
    public companyName: string,
    public devicecount: number,
    public userCount: number,
    public projectCount: number,
    public address: string,
    public mail: string,
    public tel: string,
    public fax: string,
  ) { }
}
const formInputData = require('../../../assets/data/forms/form-elements/form-inputs.json');
const selectData = require('../../../assets/data/forms/form-elements/select.json');

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  userInfo: UserInfo;

  companyId: any = null;
  columns: any = [];
  contactName: any;
  contactEmail: any;
  contactPhone: any;
  contactImage: any;
  contactFavorite: boolean;
  contactactive: string;
  rows: any[] = [];
  name = 'Angular';
  public imagePath;
  imgURL: any;
  selectedContact: any;
  contactFlag: boolean;
  addContact: any;
  placement = 'bottom-right';
  imagepathdefault: any;
  addModal = null;
  updateModal = null;
  value: any;
  loadingIndicator: true;
  selected = [];
  selectedUserid = [];
  temp = [];
  temp2 = this.rows;
  singlebasicSelected: any;
  queryParams_userid: any;
  queryParams_companyid: any;


  public config: PerfectScrollbarConfigInterface = {};
  multipleMultiSelect: any;
  public multipleSelectArray = formInputData.multipleSelectArray;
  public singleSelectArray = selectData.singleSelectArray;

  protected pageModel = {
    // 一括登録のデバイス定義リスト
    addList: [],
    dataAll: [],
    userList: [],
    adduserInfo: {
      username: '',
      role: null,
      passwrod: '',
      passwrod2: '',
      companyInfo: {
        corporatenumber: '',
        companyid: null,
        companyname: '',
        address: '',
        industry: '',
        tel: '',
        mail: '',
        fax: ''
      },
      newCompanyInfo: {
        corporatenumber: '',
        companyname: '',
        address: '',
        industry: '',
        tel: '',
        mail: '',
        fax: ''
      }
    },
    updataUserInfo: {
      corporatenumber: '',
      companyid: null,
      companyname: '',
      address: '',
      industry: '',
      tel: '',
      mail: '',
      fax: ''
    },
    loginUser: {
      loginuserid: null,
      loginusername: '',
      loginrole: null,
      logincompanyid: null,
      loginupperuserid: null
    },
    userInfoParame: {
      loginInfo: {},
      targetUserInfo: {
        targetuserid: '',
        targetuserCompanyid: ''
      }
    },

    companyInfoAll: []
  }

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
    private alertService: AlertService,
    private httpService: HttpService,
    private dataFatoryService: DataFatoryService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.getUserAll();
  }

  ngOnInit(): void {

    // 画面遷移する場合、値を取得する
    this.queryParams_userid = this.activatedRoute.snapshot.queryParams['userid'];
    this.queryParams_companyid = this.activatedRoute.snapshot.queryParams['companyid'];
    console.log("画面遷移の取得した値：" + this.queryParams_userid);
    console.log("画面遷移の取得した値：" + this.queryParams_companyid);

    this.singlebasicSelected = this.singleSelectArray[0].item_text;
    // 画面初期ログイン情報取得
    let item: RouteIdIF = this.dataFatoryService.getRouteIdIF();

    //to do ユーザー名で　ロケーシ
    this.pageModel.loginUser.loginuserid = item.uid;
    this.pageModel.loginUser.loginusername = item.login_id;
    // this.pageModel.loginUser.loginrole = item.role;
    this.pageModel.loginUser.loginrole = 1;
    this.pageModel.loginUser.logincompanyid = item.company;
    this.pageModel.loginUser.loginupperuserid = item.upperuserid;
    this.companyId = item.company;
    console.log("ログイン情報：" + JSON.stringify(item));

    this.pageModel.userInfoParame.loginInfo = {
      "loginuserid": this.pageModel.loginUser.loginuserid,
      "loginusername": this.pageModel.loginUser.loginusername,
      "loginrole": this.pageModel.loginUser.loginrole,
      "logincompanyid": this.pageModel.loginUser.logincompanyid,
      "loginupperuserid": this.pageModel.loginUser.loginupperuserid
    }

    if (this.queryParams_userid && this.queryParams_companyid) {
      this.pageModel.userInfoParame.targetUserInfo.targetuserid = this.queryParams_userid;
      this.pageModel.userInfoParame.targetUserInfo.targetuserCompanyid = this.queryParams_companyid;
    } else {
      this.pageModel.userInfoParame.targetUserInfo.targetuserid = this.pageModel.loginUser.loginuserid;
      this.pageModel.userInfoParame.targetUserInfo.targetuserCompanyid = this.pageModel.loginUser.logincompanyid;
    }

    console.log("param情報：" + JSON.stringify(this.pageModel.loginUser));
    this.getUnderCompanies()
    this.getUserAll();
  }

  /**
 * Add new contact
 *
 * @param addTableDataModalContent      Id of the add contact modal;
 */
  addTableDataModal(addTableDataModalContent) {
    this.addModal = this.modal.open(addTableDataModalContent, {
      windowClass: 'animated fadeInDown'
    });
    this.contactFlag = true;
  }
  /**
     * Edit selected contact row.
     *
     * @param editTableDataModalContent     Id of the edit contact model.
     * @param row     The row which needs to be edited.
     */
  editTableDataModal(editTableDataModalContent, row) {
    this.selectedContact = Object.assign({}, row);
    this.updateModal = this.modal.open(editTableDataModalContent, {
      windowClass: 'animated fadeInDown'
    });
    this.contactFlag = false;
    this.pageModel.updataUserInfo.companyid = this.selectedContact.companyid;
    // 会社情報変更
    for (var company in this.pageModel.companyInfoAll) {
      if (this.pageModel.updataUserInfo.companyid === this.pageModel.companyInfoAll[company]["companyid"]) {
        this.pageModel.updataUserInfo.companyname = this.pageModel.companyInfoAll[company]["companyname"];
        this.pageModel.updataUserInfo.corporatenumber = this.pageModel.companyInfoAll[company]["corporatenumber"];
        this.pageModel.updataUserInfo.address = this.pageModel.companyInfoAll[company]["address"];
        this.pageModel.updataUserInfo.industry = this.pageModel.companyInfoAll[company]["industry"];
        this.pageModel.updataUserInfo.mail = this.pageModel.companyInfoAll[company]["mail"];
        this.pageModel.updataUserInfo.tel = this.pageModel.companyInfoAll[company]["tel"];
        this.pageModel.updataUserInfo.fax = this.pageModel.companyInfoAll[company]["fax"];
      }
    }
  }

  /**
   * Selected contact
   *
   * @param selected      Selected contact;
   */
  onSelectContact({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  /**
   * Search contact from contact table
   *
   * @param event     Convert value uppercase to lowercase;
   */
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.rows = [...this.temp2];
    this.temp = [...this.rows];
    const temp = this.rows.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows = temp;
    this.table.offset = 0;
  }

  /**
   * Choose contact image
   *
   * @param event     Select contact image;
   */
  preview(event) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.contactImage = e.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  /**
   * 単一ユーザーを削除する
   * @param row     Selected row for delete contact
   */
  deleteRow(row) {
    // let index = 0;
    // const temp = [...this.rows];
    // for (const tempRow of temp) {
    //   if (tempRow.id === row.id) {
    //     temp.splice(index, 1);
    //     break;
    //   }
    //   index++;
    // }
    // this.rows = temp;
    if (confirm("削除してもよろしいでしょうか")) {


      this.selectedUserid.push({ "userid": row.userid });
      var query = {
        "loginInfo": this.pageModel.userInfoParame.loginInfo,
        "targetUserInfo": {
          "targetuserid": this.pageModel.userInfoParame.targetUserInfo.targetuserid,
          "targetuserCompanyid": this.pageModel.userInfoParame.targetUserInfo.targetuserid,
        },
        "cloud_userModelList": this.selectedUserid,
      }
      this.httpService.delete('deleteUser', query).then(item => {
        try {
          if (item.body.resultCode === "0000") {
            this.selectedUserid = [];
            this.selected = [];
            this.getUserAll();
            alert('削除成功です。');
          } else {
            console.log('削除失敗です。');
            this.selectedUserid = [];
            this.selected = [];
          }
        } catch (e) {
          console.log('削除失敗です。');
          this.selectedUserid = [];
          this.selected = [];
        }
      });
    }
  }

  /**
   * 複数のユーザーを削除する
   */
  deleteCheckedRow() {
    // let index = 0;
    // const removedIndex = [];
    // const temp = [...this.rows];
    // for (const row of temp) {
    //   for (const selectedRow of this.selected) {
    //     if (row.id === selectedRow.id) {
    //       removedIndex.push(index);
    //     }
    //   }
    //   index++;
    // }
    // for (let i = removedIndex.length - 1; i >= 0; i--) {
    //   temp.splice(removedIndex[i], 1);
    // }
    // this.rows = temp;
    if (confirm("削除してもよろしいでしょうか")) {


      for (var selecteUser of this.selected) {
        this.selectedUserid.push({ "userid": selecteUser.userid });
      }
      var query = {
        "loginInfo": this.pageModel.userInfoParame.loginInfo,
        "targetUserInfo": {
          "targetuserid": this.pageModel.userInfoParame.targetUserInfo.targetuserid,
          "targetuserCompanyid": this.pageModel.userInfoParame.targetUserInfo.targetuserid,
        },
        "cloud_userModelList": this.selectedUserid,
      }

      this.httpService.delete('deleteUser', query).then(item => {
        try {
          if (item.body.resultCode === "0000") {
            this.selectedUserid = [];
            this.selected = [];
            this.getUserAll();
            alert('削除成功です。');
          } else {
            console.log('削除失敗です。');
            this.selectedUserid = [];
            this.selected = [];
          }
        } catch (e) {
          console.log('削除失敗です。');
          this.selectedUserid = [];
          this.selected = [];
        }
      });
    }
  }

  /**
   * ユーザー情報を更新する
   *
   * @param
   */
  onUpdate(editUpdateForm: NgForm) {
    var query = {
      "loginInfo": {
        "loginuserid": this.pageModel.loginUser.loginuserid,
        "logincompanyid": this.pageModel.loginUser.logincompanyid
      },
      "targetUserInfo": {
        "targetuserid": this.pageModel.userInfoParame.targetUserInfo.targetuserid,
        "targetuserCompanyid": this.pageModel.userInfoParame.targetUserInfo.targetuserid,
      },
      "userid": this.selectedContact.userid,
      "role": this.selectedContact.role,
      "username": this.selectedContact.username,
      "companyid": this.pageModel.updataUserInfo.companyid,
      "corporatenumber": this.pageModel.updataUserInfo.corporatenumber,
      "companyname": this.pageModel.updataUserInfo.companyname,
      "address": this.pageModel.updataUserInfo.address,
      "industry": this.pageModel.updataUserInfo.industry,
      "mail": this.pageModel.updataUserInfo.mail,
      "tel": this.pageModel.updataUserInfo.tel,
      "fax": this.pageModel.updataUserInfo.fax
    }

    this.httpService.put('updateUser', query).then(item => {
      try {
        console.log('更新成功です。');
        console.log(item);
        this.getUserAll();
        alert('更新成功です。');
        // editUpdateForm.reset();
        // this.editModal(editUpdateForm.resetForm);
      } catch (e) {
        console.log('更新失敗です。');
      }
    });
  }

  /**
   * ユーザー新規
   *
   * @param 
   */
  addCompUser() {
    var companyid = this.pageModel.adduserInfo.companyInfo.companyid;
    var username = this.pageModel.adduserInfo.username;
    var role = this.pageModel.adduserInfo.role;
    var flg = true;

    if (flg && !username) {
      confirm(`ユーザー名を入力してください。`);
      flg = false;
    }

    if (flg && !role) {
      confirm(`権限を選択してください。`);
      flg = false;
    }

    if (flg && !companyid) {
      confirm(`会社名を選択してください。`);
      flg = false;
    }

    if (flg) {
      var query = {
        "loginInfo": this.pageModel.userInfoParame.loginInfo,
        "targetUserInfo": {
          "targetuserid": this.pageModel.userInfoParame.targetUserInfo.targetuserid,
          "targetuserCompanyid": this.pageModel.userInfoParame.targetUserInfo.targetuserCompanyid
        },

        "companyid": this.pageModel.adduserInfo.companyInfo.companyid,
        "username": this.pageModel.adduserInfo.username,
        "role": this.pageModel.adduserInfo.role,
      }
      this.registerUser(query);
    }
    // addForm.reset();
    // this.addModal.close(addForm.resetForm);

  }

  /**
   * 
   * 
   */
  addNewCompUser() {
    var companyname = this.pageModel.adduserInfo.newCompanyInfo.companyname;
    var corporatenumber = this.pageModel.adduserInfo.newCompanyInfo.corporatenumber;
    var username = this.pageModel.adduserInfo.username;
    var role = this.pageModel.adduserInfo.role;
    var flg = true;

    if (flg && !username) {
      confirm(`ユーザー名を入力してください。`);
      flg = false;
    }

    if (flg && !role) {
      confirm(`権限を選択してください。`);
      flg = false;
    }

    if (flg && !companyname) {
      confirm(`会社名を入力してください。`);
      flg = false;
    }

    if (flg && !corporatenumber) {
      confirm(`法人番号を入力してください。`);
      flg = false;
    }

    if (flg) {
      var query = {
        "loginInfo": this.pageModel.userInfoParame.loginInfo,
        "targetUserInfo": {
          "targetuserid": this.pageModel.userInfoParame.targetUserInfo.targetuserid,
          "targetuserCompanyid": this.pageModel.userInfoParame.targetUserInfo.targetuserCompanyid
        },

        "username": this.pageModel.adduserInfo.username,
        "upperuserid": this.pageModel.userInfoParame.targetUserInfo.targetuserid,
        "corporatenumber": this.pageModel.adduserInfo.newCompanyInfo.corporatenumber,
        "role": this.pageModel.adduserInfo.role,
        "companyname": this.pageModel.adduserInfo.newCompanyInfo.companyname,
        "address": this.pageModel.adduserInfo.newCompanyInfo.address,
        "industry": this.pageModel.adduserInfo.newCompanyInfo.industry,
        "mail": this.pageModel.adduserInfo.newCompanyInfo.mail,
        "tel": this.pageModel.adduserInfo.newCompanyInfo.tel,
        "fax": this.pageModel.adduserInfo.newCompanyInfo.fax,
      };

      this.registerUser(query);
    }
  }

  /**
   * ユーザー登録
   * @param query
   */
  registerUser(query) {

    this.httpService.usePost('registerUser', query).then(item => {
      try {
        if (item.resultCode == "0000") {
          this.getUserAll();
          alert('ユーザー情報は登録成功です。');
        }
      } catch (e) {
        console.log('登録失敗です。');
      }
    });
  }


  /**
   * Set the phone number format
   */
  onFormat() {
    if (this.contactFlag === true) {
      this.value = this.contactPhone;
    } else if (this.contactFlag === false) {
      this.value = this.selectedContact['phone'];
    }

    let country, city, number;

    switch (this.value.length) {
      case 6:
        country = 1;
        city = this.value.slice(0, 3);
        number = this.value.slice(3);
        break;

      case 7:
        country = this.value[0];
        city = this.value.slice(1, 4);
        number = this.value.slice(4);
        break;

      case 8:
        country = this.value.slice(0, 3);
        city = this.value.slice(3, 5);
        number = this.value.slice(5);
        break;

      default:
        return this.value;
    }
    if (country === 1) {
      country = '';
    }

    number = number.slice(0, 3) + '-' + number.slice(3);

    const no = '(' + city + ')' + '-' + number;
    if (this.contactFlag === true) {
      this.contactPhone = no;
    } else if (this.contactFlag === false) {
      this.selectedContact['phone'] = no;
    }
  }

  /**
   * Sidebar open/close in responsive
   *
   * @param event     Sidebar open/close
   */
  sidebar(event) {
    const toggleIcon = document.getElementById('sidebar-left');
    const toggle = document.getElementById('content-overlay');
    if (event.currentTarget.className === 'sidebar-toggle d-block d-lg-none') {
      this._renderer.addClass(toggleIcon, 'show');
      this._renderer.addClass(toggle, 'show');
    }
  }

  /**
   * Overlay add/remove fuction in responsive
   *
   * @param event     Overlay click event
   */
  contentOverlay(event) {
    const toggleIcon = document.getElementById('sidebar-left');
    const toggle = document.getElementById('content-overlay');
    if (event.currentTarget.className === 'content-overlay show') {
      this._renderer.removeClass(toggleIcon, 'show');
      this._renderer.removeClass(toggle, 'show');
    }
  }

  /**
   * ユーザー一覧取得
   */
  protected async getUserAll() {
    var query = {
      "loginInfo": this.pageModel.userInfoParame.loginInfo,
      "targetUserInfo": {
        "targetuserid": this.pageModel.userInfoParame.targetUserInfo.targetuserid,
        "targetuserCompanyid": this.pageModel.userInfoParame.targetUserInfo.targetuserid,
      },
    }
    this.httpService.usePost('getSonUsers', query).then(item => {
      try {
        this.rows = [];
        console.log(item);
        var index = 1;
        this.pageModel.userList = item;
        item.forEach((elem) => {
          this.rows.push(new Contact(
            index,
            elem.userid,
            elem.username,
            elem.companyid,
            elem.loginid,
            elem.role,
            elem.upperuserid,
            elem.companyName,
            elem.devicecount,
            elem.userCount,
            elem.projectCount,
            elem.address,
            elem.mail,
            elem.tel,
            elem.fax,
          ));
          index++;
        });
        this.rows = [...this.rows];
        // }

      } catch (e) {
        console.log('');
      }
    });
  }

  /**
   * 会社情報を取得
   */
  protected async getUnderCompanies() {
    var query = {
      "loginuserid": this.pageModel.userInfoParame.targetUserInfo.targetuserid
    }
    this.httpService.usePost('getUnderCompanies', query).then(item => {
      try {
        if (item) {
          this.pageModel.companyInfoAll = item;
          console.log(item);
          console.log("会社情報の取得は成功しました。");
        } else {
          console.log("会社情報の取得は失敗しました。");
        }
      } catch (e) {
        console.log("会社情報の取得は失敗しました。");
      }
    });
  }

  /**
   * 会社情報自動的に入れること
   */
  show() {
    // 会社情報変更
    for (var company in this.pageModel.companyInfoAll) {
      console.log(company);
      if (this.pageModel.adduserInfo.companyInfo.companyid === this.pageModel.companyInfoAll[company]["companyid"]) {
        this.pageModel.adduserInfo.companyInfo.corporatenumber = this.pageModel.companyInfoAll[company]["corporatenumber"];
        this.pageModel.adduserInfo.companyInfo.address = this.pageModel.companyInfoAll[company]["address"];
        this.pageModel.adduserInfo.companyInfo.industry = this.pageModel.companyInfoAll[company]["industry"];
        this.pageModel.adduserInfo.companyInfo.mail = this.pageModel.companyInfoAll[company]["mail"];
        this.pageModel.adduserInfo.companyInfo.tel = this.pageModel.companyInfoAll[company]["tel"];
        this.pageModel.adduserInfo.companyInfo.fax = this.pageModel.companyInfoAll[company]["fax"];
      }
    }
  }

  // reload() {
  //   // window.location.reload();
  //   this.router.onSameUrlNavigation = 'reload';
  //   this.router.navigateByUrl('/user').then(() => {
  //     this.router.navigate(['/user']);
  //     this.router.onSameUrlNavigation = 'ignore';
  //   });
  // }
  // /**
  //  * 
  //  */
  // rotueUserInfo() {
  //   this.router.navigate(['/device']);
  // }
}

