import { Component, OnInit, ViewChild, EventEmitter, Output, Renderer2 } from '@angular/core';
import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { HttpService } from 'src/app/_services/HttpService';
import { UserInfo } from '../../_common/_interface/userInfo'
import { DataFatoryService } from 'src/app/_services/DataFatoryService';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { TreeNode } from 'primeng/api';
import { TreeTableModule } from 'primeng/treetable';
import { MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { RouteIdIF } from 'src/app/_common/_Interface/RouteIdIF';
import { ConfirmationService } from 'primeng/api';


class Contact {
  constructor(
    public id: number,
    public userid: number,
    public username: string,
    public companyid: number,
    public loginid: string,
    public firstname: string,
    public lastname: string,
    public email: string,
    public role: number,
    public upperuserid: string,
    public companyName: string,
    public deviceCount: number,
    public userCount: number,
    public projectCount: number,
    public address: string,
    public mail: string,
    public tel: string,
    public fax: string,
    public name: string,
     public expanded: boolean,
    // public Contact: any,
  ) { }
}
const formInputData = require('../../../assets/data/forms/form-elements/form-inputs.json');
const selectData = require('../../../assets/data/forms/form-elements/select.json');

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

@Injectable()
export class UserComponent implements OnInit {

  users:any;
  userInfo: UserInfo;
  files: TreeNode[];
  files1: TreeNode[];
  addUserInfo: FormGroup;

  redata: any;

  pageSize: any;
  collectionSize: any;
  userList: any;
  userList_json: any;
  page = 1;
  TableData: any;
  sortOn: any;
  checkOn: 1;
  userSelected = false;

  showSearch = false;
  companyId: any = null;
  columns: any = [];
  contactName: any;
  contactEmail: any;
  contactPhone: any;
  contactImage: any;
  contactFavorite: boolean;
  contactactive: string;
  rows: any[] = [];
  userAll: any[] = [];
  jsonUsers: any[] = [];
  selectedContact: any;
  addSelectedContact: any;
  addSelectedCompanyUserContact: any;
  addCompanyName: any;
  contactFlag: boolean;
  addContact: any;
  placement = 'bottom-right';
  imagepathdefault: any;
  addModal = null;
  addCompanyModal = null;
  addMyModal = null;
  addProxyModal = null;
  addProxyCompanyModal = null;
  updateModal = null;
  value: any;
  loadingIndicator: true;
  selected = [];
  selectedUserid = [];
  temp = [];
  temp2 = this.rows;
  singlebasicSelected: any;

  cols: any[];

  public config: PerfectScrollbarConfigInterface = {};
  multipleMultiSelect: any;
  public multipleSelectArray = formInputData.multipleSelectArray;
  public singleSelectArray = selectData.singleSelectArray;

  pageModel = {
    result: {
      retcode: '',
      message: '',
    },
    // 一括登録のデバイス定義リスト
    addList: [],
    dataAll: [],

    adduserInfo: {
      username: '',
      lastname: '',
      firstname: '',
      password: '',
      newPassword: '',
      role: null,
      companyid: null,
      companyname: '',
      upperuserid: null,
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
    },
    addTargetUserInfo: {
      username: '',
      lastname: '',
      firstname: '',
      password: '',
      newPassword: '',
      role: null,
      email: '',
      companyid: null,
      upperuserid: null,
    },
    addTargetCompanyUserInfo: {
      username: '',
      lastname: '',
      firstname: '',
      password: '',
      newPassword: '',
      role: null,
      companyid: null,
      companyname: '',
      upperuserid: null,
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

    query: {
      companyname: '',
      lastname: '',
      firstname: '',
      email: ''

    },
    companyInfoAll: [],
    myCompanyInfoAll: [],
    userRelationList: [],
    userRelation: {
      userid: null,
      name: '',
    },
    sort: {
      companyNameUp: false,
      companyNameDown: false,
      nameUp: false,
      nameDown: false,
      usernameUp: false,
      usernameDown: false,
      addressUp: false,
      addressDown: false,
    },
    jsonUserList: [],
    jsonUsers: {},
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
    private httpService: HttpService,
    private dataFatoryService: DataFatoryService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private confirmationService: ConfirmationService,
    private formBuilder: FormBuilder,
  ) {
    // this.searchMyUsers();
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.pageSize = 10;
    this.singlebasicSelected = this.singleSelectArray[0].item_text;
    // 画面初期ログイン情報取得
    let item: UserInfo = this.httpService.getLoginUser();

    //to do ユーザー名で　ロケーシ
    this.pageModel.loginUser.loginuserid = item.uid;
    this.pageModel.loginUser.loginusername = item.login_id;
    this.pageModel.loginUser.loginrole = item.role;
    this.pageModel.loginUser.logincompanyid = item.company;
    this.pageModel.loginUser.loginupperuserid = item.upperuserid;
    this.companyId = item.company;

    this.cols = [
      // { field: 'userid', header: 'ユーザーID' },

      { field: 'companyid', header: '会社ID' },
      { field: 'companyName', header: '会社名' },
      { field: 'username', header: 'ログインID' },
      { field: 'lastname', header: '管理者姓' },
      { field: 'firstname', header: '管理者名' },
      { field: 'role', header: '管理権限' },
      // { field: 'userCount', header: 'ユーザー数' },
      { field: 'email', header: '管理者メール' },
    ];

    this.addUserInfo = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      newpassword: ['', [Validators.required, Validators.minLength(6)]],
    });

    console.log("サンプルデーター表示：");
    console.log(this.files);
    console.log("param情報：" + JSON.stringify(this.pageModel.loginUser));
    this.getUnderCompanies()
    this.searchMyUsers();
    this.getUnderUsers();
  }

  get f() {
    return this.addUserInfo.controls;
  }

  /**
 * AddMy new contact
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
  * 新規会社を呼び出し
  *
  * @param addTableDataModalContent      Id of the add contact modal;
  */
  addCompanyDataModal(addNewCompanyModalContent) {
    this.addCompanyModal = this.modal.open(addNewCompanyModalContent, {
      windowClass: 'animated fadeInDown'
    });
    this.pageModel.addTargetCompanyUserInfo.newCompanyInfo.mail = this.pageModel.addTargetCompanyUserInfo.username;
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
      windowClass: 'animated fadeInDown '
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
     * 請求者会社ユーザー新規を呼び出し
     *
     * @param editTableDataModalContent     Id of the edit contact model.
     * @param row     The row which needs to be edited.
     */
  addRowTableDataModal(addTableNewDataModalContent, row) {
    this.addSelectedContact = Object.assign({}, row);
    this.addProxyModal = this.modal.open(addTableNewDataModalContent, {
      windowClass: 'animated fadeInDown '
    });
    this.contactFlag = false;
  }

  /**
   * 請求者会社配下ユーザー新規を呼び出し
   *
   * @param editTableDataModalContent     Id of the edit contact model.
   * @param row     The row which needs to be edited.
   */
  addNewCompanyUserModal(addNewCompanyUserModal, row) {
    this.addSelectedCompanyUserContact = Object.assign({}, row);
    this.addProxyCompanyModal = this.modal.open(addNewCompanyUserModal, {
      windowClass: 'animated fadeInDown '
    });
    this.contactFlag = false;
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

    // 配下ユーザーがある場合、削除不可
    if (row.userCount > 1) {
      this.showAlert("warn", "配下のユーザーが存在している場合、削除不可です。");
      return
    }

    this.confirmationService.confirm({
      message: row.username + "を削除します。よろしいですか？",
      header: 'ユーザー削除確認',
      accept: () => {

        this.selectedUserid.push({ "userid": row.userid });
        var query = {
          "cloud_userModelList": this.selectedUserid,
        }
        this.httpService.useRpDelete('deleteUser', query).then(item => {
          try {
            if (item.resultCode === "0000") {
              this.selectedUserid = [];
              this.selected = [];
              this.searchMyUsers();
              this.showAlert("success", "ユーザーを削除しました。");
            } else {
              this.showAlert("error", "削除失敗、ご確認してください。");
              console.log('削除失敗です。');
              this.selectedUserid = [];
              this.selected = [];
            }
          } catch (e) {
            this.showAlert("error", "削除失敗、ご確認してください。");
            this.selectedUserid = [];
            this.selected = [];
          }
        });
      },
      reject: () => {
        this.showAlert("info", "削除操作を取消しました");
      },
    });
  }

  /**
   * 複数のユーザーを削除する
   */
  deleteCheckedRow() {
    var flg = false;
    for (var selecteUser of this.userList) {
      if (selecteUser.isSelected) {
        this.selectedUserid.push({ "userid": selecteUser.userid });
        flg = true;
      }
    }
    if (this.selectedUserid.length > 0) {
      this.confirmationService.confirm({
        message: "選択したデーターを削除しますか",
        header: 'ユーザー削除確認',
        accept: () => {
          // 削除パラメータの作成
          var query = {
            "cloud_userModelList": this.selectedUserid,
          }

          // ユーザー情報の削除
          this.httpService.useRpDelete('deleteUser', query).then(item => {
            try {
              if (item.resultCode === "0000") {
                this.selectedUserid = [];
                this.selected = [];
                this.searchMyUsers();
                this.showAlert("success", "選択したユーザーを削除しました");
              } else {
                this.showAlert("error", "削除失敗、ご確認してください。");
                console.log('削除失敗です。');
                this.selectedUserid = [];
                this.selected = [];
              }
            } catch (e) {
              this.showAlert("error", "削除失敗、ご確認してください。");
              this.selectedUserid = [];
              this.selected = [];
            }
          });
        },
        reject: () => {
          this.showAlert("info", "削除操作を取消しました");
        }
      });
    } else {
      this.showAlert("warn", "ユーザーを選択してください。");
    }
  }

  /**
   * ユーザー情報を更新する
   *
   * @param
   */
  onUpdate(editUpdateForm: NgForm) {
    var query = {
      "userid": this.selectedContact.userid,
      "role": this.selectedContact.role,
      "username": this.selectedContact.username,
      "lastName": this.selectedContact.lastname,
      "firstName": this.selectedContact.firstname,
      "companyid": this.pageModel.updataUserInfo.companyid,
      "corporatenumber": this.pageModel.updataUserInfo.corporatenumber,
      "companyname": this.pageModel.updataUserInfo.companyname,
      "address": this.pageModel.updataUserInfo.address,
      "industry": this.pageModel.updataUserInfo.industry,
      "mail": this.pageModel.updataUserInfo.mail,
      "tel": this.pageModel.updataUserInfo.tel,
      "fax": this.pageModel.updataUserInfo.fax
    }

    this.httpService.useRpPut('updateUser', query).then(item => {
      this.pageModel.result.retcode = '';
      this.pageModel.result.message = '';
      try {
        if (item.resultCode === "0000") {
          console.log('更新成功です。');
          console.log(item);
          this.ngOnInit();
          this.getResultMs(item);
          this.showAlert("success", "ユーザーを更新しました。");
          if (editUpdateForm.valid === true) {
            editUpdateForm.reset();
            this.updateModal.close(editUpdateForm.resetForm);
          }
          // editUpdateForm.reset();
          // this.editModal(editUpdateForm.resetForm);
        } else {
          this.getResultMs(item);
          this.showAlert("error", "更新失敗、ご確認してください。");
        }
      } catch (e) {
        this.showAlert("error", e);
      }
    });
  }

  /**
   * ユーザー新規登録（自社新規）
   *
   * @param
   */
  addMyCompUser(addForm: NgForm) {
    var username = this.pageModel.adduserInfo.username;
    var password = this.pageModel.adduserInfo.password;
    var newPassword = this.pageModel.adduserInfo.newPassword;
    var lastname = this.pageModel.adduserInfo.lastname;
    var firstname = this.pageModel.adduserInfo.firstname;
    var role = this.pageModel.adduserInfo.role;
    var upperuserid = this.pageModel.loginUser.loginupperuserid;
    var companyid = this.pageModel.loginUser.logincompanyid;
    var loginrole = this.pageModel.loginUser.loginrole;

    // 会社管理者の場合
    if (loginrole === 0) {
      upperuserid = this.pageModel.loginUser.loginuserid;
    }

    var flg = true;

    if (flg && !username) {
      this.showAlert("warn", "ログインID（メール）を入力してください。");
      flg = false;
    }

    if (flg && !password) {
      this.showAlert("warn", "パスワードを入力してください。");
      flg = false;
    }

    if (flg && !newPassword) {
      this.showAlert("warn", "確認パスワードを入力してください。");
      flg = false;
    }

    if (flg && !lastname) {
      this.showAlert("warn", "姓を入力してください。");
      flg = false;
    }

    if (flg && !firstname) {
      this.showAlert("warn", "名を入力してください。");
      flg = false;
    }

    if (flg && !role) {
      this.showAlert("warn", "権限を入力してください。");
      flg = false;
    }

    if (flg && password !== newPassword) {
      this.showAlert("warn", "新規パスワードと確認パスワードは不一致です。");
      flg = false;
    }

    if (flg) {
      var query = {
        "username": username,
        "password": password,
        "newPassword": newPassword,
        "lastName": lastname,
        "firstName": firstname,
        "role": role,
        "email": username,
        "upperuserid": upperuserid,
        "companyid": companyid,
      }
      this.registerUser(query, addForm);
    }
  }

  /**
   * 代理会の本社ユーザーを新規する
   *
   * @param 
   */
  addTargetUserDate(addForm: NgForm) {
    var username = this.pageModel.addTargetUserInfo.username;
    var password = this.pageModel.addTargetUserInfo.password;
    var newPassword = this.pageModel.addTargetUserInfo.newPassword;
    var lastname = this.pageModel.addTargetUserInfo.lastname;
    var firstname = this.pageModel.addTargetUserInfo.firstname;
    var email = this.pageModel.addTargetUserInfo.username;
    var role = this.pageModel.addTargetUserInfo.role; // 会社管理者
    var upperuserid = this.addSelectedContact.userid;
    var companyid = this.addSelectedContact.companyid;

    var flg = true;

    if (flg && !username) {
      this.showAlert("warn", "ログインID（メール）を入力してください。");
      flg = false;
    }

    if (flg && !password) {
      this.showAlert("warn", "パスワードを入力してください。");
      flg = false;
    }

    if (flg && !newPassword) {
      this.showAlert("warn", "確認パスワードを入力してください。");
      flg = false;
    }

    if (flg && !lastname) {
      this.showAlert("warn", "姓を入力してください。");
      flg = false;
    }

    if (flg && !firstname) {
      this.showAlert("warn", "名を入力してください。");
      flg = false;
    }

    if (flg && !role) {
      this.showAlert("warn", "権限を入力してください。");
      flg = false;
    }

    if (flg && password !== newPassword) {
      this.showAlert("warn", "新規パスワードと確認パスワードは不一致です。");
      flg = false;
    }

    if (flg) {
      var query = {
        "username": username,
        "password": password,
        "newPassword": newPassword,
        "lastName": lastname,
        "firstName": firstname,
        "email": email,
        "role": role,
        "upperuserid": upperuserid,
        "companyid": companyid,
      }
      this.registerUser(query, addForm);
    }
  }

  /**
   * 代理会の配下のユーザーを新規する
   *
   * @param 
   */
  addTargetCompanyUserDate(addForm: NgForm) {
    var username = this.pageModel.addTargetCompanyUserInfo.username;
    var password = this.pageModel.addTargetCompanyUserInfo.password;
    var newPassword = this.pageModel.addTargetCompanyUserInfo.newPassword;
    var lastname = this.pageModel.addTargetCompanyUserInfo.lastname;
    var firstname = this.pageModel.addTargetCompanyUserInfo.firstname;
    var email = this.pageModel.addTargetCompanyUserInfo.username;
    var role = 0; // 会社管理者
    var upperuserid = this.addSelectedCompanyUserContact.userid;

    var companyname = this.pageModel.addTargetCompanyUserInfo.newCompanyInfo.companyname;
    var corporatenumber = this.pageModel.addTargetCompanyUserInfo.newCompanyInfo.corporatenumber;
    var fax = this.pageModel.addTargetCompanyUserInfo.newCompanyInfo.fax;
    var CompanyEmail = this.pageModel.addTargetCompanyUserInfo.username;
    var tel = this.pageModel.addTargetCompanyUserInfo.newCompanyInfo.tel;
    var address = this.pageModel.addTargetCompanyUserInfo.newCompanyInfo.address;
    var industry = this.pageModel.addTargetCompanyUserInfo.newCompanyInfo.industry;

    var flg = true;

    if (flg && !username) {
      this.showAlert("warn", "ログインID（メール）を入力してください。");
      flg = false;
    }

    if (flg && !password) {
      this.showAlert("warn", "パスワードを入力してください。");
      flg = false;
    }

    if (flg && !newPassword) {
      this.showAlert("warn", "確認パスワードを入力してください。");
      flg = false;
    }

    if (flg && !lastname) {
      this.showAlert("warn", "姓を入力してください。");
      flg = false;
    }

    if (flg && !firstname) {
      this.showAlert("warn", "名を入力してください。");
      flg = false;
    }

    if (flg && !companyname) {
      this.showAlert("warn", "新規会社の会社名を入力してください。");
      flg = false;
    }

    if (flg && !corporatenumber) {
      this.showAlert("warn", "新規会社の法人番号を入力してください。");
      flg = false;
    }

    if (flg && password !== newPassword) {
      this.showAlert("warn", "新規パスワードと確認パスワードは不一致です。");
      flg = false;
    }

    if (flg) {
      var query = {
        "username": username,
        "password": password,
        "newPassword": newPassword,
        "lastName": lastname,
        "firstName": firstname,
        "email": email,
        "role": role,
        "upperuserid": upperuserid,
        "companyname": companyname,
        "corporatenumber": corporatenumber,
        "fax": fax,
        "mail": CompanyEmail,
        "tel": tel,
        "address": address,
        "industry": industry,
      }
      this.registerUser(query, addForm);
    }
  }

  /**
   * ユーザー新規登録（代理会社のユーザー新規・新規会社）
   * 
   */
  addNewCompany(addForm: NgForm) {
    var companyname = this.pageModel.addTargetCompanyUserInfo.newCompanyInfo.companyname;
    var corporatenumber = this.pageModel.addTargetCompanyUserInfo.newCompanyInfo.corporatenumber;
    var flg = true;

    if (flg && !companyname) {
      this.showAlert("warn", "会社名を入力してください。");
      flg = false;
    }

    if (flg && !corporatenumber) {
      this.showAlert("warn", "法人番号を入力してください。");
      flg = false;
    }

    if (flg) {
      this.addCompanyName = this.pageModel.addTargetCompanyUserInfo.newCompanyInfo.companyname;
      this.confirmationService.confirm({
        message: "新規会社：" + this.pageModel.addTargetCompanyUserInfo.newCompanyInfo.companyname + "の情報を保存しますか",
        header: "会社情報保存確認",
        accept: () => {
          let routeif: RouteIdIF = this.dataFatoryService.getRouteIdIF();
          if (addForm.valid === true && routeif != null) {
            this.showAlert("success", "会社情報が保存されました。");
            // addForm.reset();
            this.addCompanyModal.close(addForm.resetForm);
          }
        }
      });
    }
  }

  /**
   * ユーザー登録
   * @param query
   */
  registerUser(query, addForm: NgForm) {

    this.httpService.useRpPost('registerUser', query).then(item => {
      try {
        if (item.resultCode === "0000") {
          this.ngOnInit();
          this.showAlert("success", "ユーザーを登録しました。");
          if (addForm.valid === true) {
            addForm.reset();
            if (this.addProxyModal) {
              this.addProxyModal.close(addForm.resetForm);
            }
            if (this.addModal) {
              this.addModal.close(addForm.resetForm);
            }
            if (this.addProxyCompanyModal) {
              this.addProxyCompanyModal.close(addForm.resetForm);
            }
          }
        } else {
          this.showAlert("error", "登録失敗、ご確認してください。");
        }
      } catch (e) {
        this.showAlert("error", e);
      }
    });
  }

  /**
   * ユーザー登録
   * @param query
   */
  addMyUser(query, addForm: NgForm) {

    this.httpService.useRpPost('registerUser', query).then(item => {
      try {
        if (item.resultCode === "0000") {
          this.ngOnInit();
          this.showAlert("success", "ユーザーを登録しました。");
          if (addForm.valid === true) {
            addForm.reset();
            this.addModal.close(addForm.resetForm);
          }
        } else {
          this.showAlert("error", "登録失敗、ご確認してください。");
        }
      } catch (e) {
        this.showAlert("error", e);
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
      this._renderer.addClass(toggleIcon, 'showSearch');
      this._renderer.addClass(toggle, 'showSearch');
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
    if (event.currentTarget.className === 'content-overlay showSearch') {
      this._renderer.removeClass(toggleIcon, 'showSearch');
      this._renderer.removeClass(toggle, 'showSearch');
    }
  }

  /**
   * ユーザー一覧を取得する
   * 
   */
  async searchMyUsers() {
    var query = {
      "companyname": this.pageModel.query.companyname,
      "firstName": this.pageModel.query.firstname,
      "lastName": this.pageModel.query.lastname,
      "email": this.pageModel.query.email,
    }
    this.httpService.usePost('searchUnderUsers', query).then(item => {
      try {
        this.rows = [];
        if (item) {
          var index = 1;
          // this.pageModel.userList = item;
          var companyname = '';
          var address = '';
          item.forEach((elem) => {
            // 会社名の設定
            for (const companyInfo of this.pageModel.companyInfoAll) {
              if (elem.companyid === companyInfo.companyid) {
                companyname = companyInfo.companyname
                address = companyInfo.address
              }
            }
            // rowsにデータを入れる
            this.rows.push(new Contact(
              index,
              elem.userid,
              elem.username,
              elem.companyid,
              elem.loginid,
              elem.firstname,
              elem.lastname,
              elem.email,
              elem.role,
              elem.upperuserid,
              companyname,
              elem.deviceCount,
              elem.userCount,
              elem.projectCount,
              address,
              elem.mail,
              elem.tel,
              elem.fax,
              elem.lastname + ' ' + elem.firstname,
               elem.expanded
            ));
            index++;
             elem.expanded=false;
          });
          console.log(this.rows);
            this.users=item
          let parents = item.filter(value => value.upperuserid == 'undefined' || value.upperuserid == this.pageModel.loginUser.loginuserid);
          let childrens = item.filter(value => value.upperuserid !== 'undefined' && value.upperuserid != this.pageModel.loginUser.loginuserid);
          this.jsonUsers = this.translator(parents, childrens);
          this.jsonUsers.sort();
          // this.jsonUsers.sort((a: any, b: any) => {
          //   if (a["companyName"] > b["companyName"]) {
          //     return -1;
          //   } else if (a["companyName"] < b["companyName"]) {
          //     return 1;
          //   } else {
          //     return 0;
          //   }
          // });

          this.jsonUsers.sort(function(a, b){
            // チームで並び替え
            if(a.companyid !== b.companyid){
              // 文字列は大小で比較する必要がある
              if(a.companyid > b.companyid) return 1
              if(a.companyid < b.companyid) return -1
            }
            // スコアで並び替え
            if(a.userCount !== b.userCount){
              // -1 かけて降順にする
              return (a.userCount - b.userCount) * -1
            }
            return 0
          });

          console.log("==========取得JSONUSERS=============");
          console.log(this.jsonUsers);
          console.log("==========転換後のJSONUSERS=============");
        }
        this.rows = [...this.rows];
        this.getTabledata();

      } catch (e) {
        console.log('失敗');
      }
    });
  }

  translator(parents, childrens) {
    parents.forEach(parent => {
      parent.data = {
        "companyName": parent.companyName,
        "companyid": parent.companyid,
        "deviceCount": parent.deviceCount,
        "email": parent.email,
        "firstname": parent.firstname,
        "lastname": parent.lastname,
        "projectCount": parent.projectCount,
        "role": parent.role,
        "upperuserid": parent.upperuserid,
        "userCount": parent.userCount,
        "userid": parent.userid,
        "username": parent.username,
        "deleteflag": parent.deleteflag
      };
      childrens.forEach((child, index) => {
        child.data = child;
        if (parent.userid == child.upperuserid) {
          let temp = [];
          childrens.forEach(element => {
            if (element.data) {
              temp.push(element.data)
            } else {
              temp.push(element)
            }
          });
          // let temp = childrens;
          temp.splice(index, 1);
          this.translator([child], temp);
          if (typeof parent.children !== "undefined") {
            parent.children.push(child);
            // parent.data.push(child);
          } else {
            parent.children = [child]
            // parent.data = data;
          }
        }
      });
    });
    return parents;
  }

  /**
   * ユーザー一覧を取得する(上位管理者)
   * 
   */
  async getUnderUsers() {
    var query = {
      "companyname": this.pageModel.query.companyname,
      "firstName": this.pageModel.query.firstname,
      "lastName": this.pageModel.query.lastname,
      "email": this.pageModel.query.email,
    }
    this.httpService.usePost('getUnderUsers', query).then(item => {
      try {

        item.forEach(element => {
          element.userid
        });
        if (item) {
          console.log('上位管理者：');
          console.log(item);
          this.userAll = item;
        }
      } catch (e) {
        console.log('');
      }
    });
  }

  /**
   * 会社情報を取得(一覧画面の会社名)
   */
  protected async getUnderCompanies() {
    var query = {
      "loginuserid": this.pageModel.loginUser.loginuserid
    }
    this.httpService.usePost('getUnderCompanies', query).then(item => {
      try {
        if (item) {
          this.pageModel.companyInfoAll = item;
          console.log(this.pageModel.myCompanyInfoAll);
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
   * 会社情報を取得（新規の会社選択）
   */
  protected async getMyUnderCompanies() {
    var query = {
      "loginuserid": this.pageModel.adduserInfo.upperuserid
    }
    this.httpService.usePost('getMyUnderCompanies', query).then(item => {
      try {
        if (item) {
          this.pageModel.myCompanyInfoAll = item;
          this.pageModel.myCompanyInfoAll.push({
            address: ""
            , companyid: null
            , companyname: ""
            , corporatenumber: ""
            , fax: ""
            , industry: ""
            , level: ""
            , mail: ""
            , tel: ""
          });
          console.log(this.pageModel.myCompanyInfoAll);
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
    for (var company in this.pageModel.myCompanyInfoAll) {
      console.log(company);
      if (this.pageModel.adduserInfo.companyInfo.companyid === this.pageModel.myCompanyInfoAll[company]["companyid"]) {
        this.pageModel.adduserInfo.companyInfo.corporatenumber = this.pageModel.myCompanyInfoAll[company]["corporatenumber"];
        this.pageModel.adduserInfo.companyInfo.address = this.pageModel.myCompanyInfoAll[company]["address"];
        this.pageModel.adduserInfo.companyInfo.industry = this.pageModel.myCompanyInfoAll[company]["industry"];
        this.pageModel.adduserInfo.companyInfo.mail = this.pageModel.myCompanyInfoAll[company]["mail"];
        this.pageModel.adduserInfo.companyInfo.tel = this.pageModel.myCompanyInfoAll[company]["tel"];
        this.pageModel.adduserInfo.companyInfo.fax = this.pageModel.myCompanyInfoAll[company]["fax"];
      }
    }
  }

  sortData(nm) {
    if (this.sortOn == 1) {
      this.userList.sort(this.alphabetically(true, nm));
      this.sortOn = 2;
    } else {
      this.userList.sort(this.alphabetically(false, nm));
      this.sortOn = 1;
    }
    this.pageModel.sort.usernameUp = false;
    this.pageModel.sort.usernameDown = false;
    this.pageModel.sort.companyNameUp = false;
    this.pageModel.sort.companyNameDown = false;
    this.pageModel.sort.addressUp = false;
    this.pageModel.sort.addressDown = false;
    this.pageModel.sort.nameUp = false;
    this.pageModel.sort.nameDown = false;

    switch (nm) {
      case 'username':
        if (this.sortOn == 1) {
          this.pageModel.sort.usernameUp = true
        } else {
          this.pageModel.sort.usernameDown = true
        }
        break;
      case 'companyName':
        if (this.sortOn == 1) {
          this.pageModel.sort.companyNameUp = true
        } else {
          this.pageModel.sort.companyNameDown = true
        }
        break;
      case 'address':
        if (this.sortOn == 1) {
          this.pageModel.sort.addressUp = true
        } else {
          this.pageModel.sort.addressDown = true
        }
        break;
      case 'name':
        if (this.sortOn == 1) {
          this.pageModel.sort.nameUp = true
        } else {
          this.pageModel.sort.nameDown = true
        }
        break;
    }
  }

  alphabetically(ascending, nm) {
    return function (a, b) {
      if (a[nm] === b[nm]) {
        return 0;
      } else if (a[nm] === null) {
        return 1;
      } else if (b[nm] === null) {
        return -1;
      } else if (ascending) {
        return a[nm] < b[nm] ? -1 : 1;
      } else {
        return a[nm] < b[nm] ? 1 : -1;
      }
    };
  }

  checkAll(ev) {
    this.userList.forEach(x => x.isSelected = ev.target.checked)
    this.userSelected = ev.target.checked;
  }

  checkChange(ev, selected) {
    this.userList.forEach(function (user) {
      if (user.userid === selected['userid']) { user.isSelected = ev.target.checked }
    });
  }

  isAllChecked() {
    // return this.productList.every(_ => _.productSelected);
    // this.productSelected=true;

  }

  getTabledata() {
    this.userList = this.rows;
    this.collectionSize = this.userList.length;
    this.userList.forEach(x => x.isSelected = false)
    // this.productList();
  }

  /**
* Pagination table
*/
  get PaginationData() {
    if (this.userList) {
      return this.userList.map((person, i) => ({ userid: i + 1, ...person }))
        .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    }
  }

  /**
   * 取消ボタンを押下 
   * 
   */
  cancleModel(openForm: NgForm) {
    if (this.addModal != null) {
      openForm.reset();
      this.addModal.close(openForm.resetForm);
    }
    if (this.updateModal != null) {
      openForm.reset();
      this.updateModal.close(openForm.resetForm);
    }
    if (this.addProxyModal != null) {
      openForm.reset();
      this.addProxyModal.close(openForm.resetForm);
    }
    if (this.addProxyCompanyModal != null) {
      this.cliarCompanyInfo();
      openForm.reset();
      this.addProxyCompanyModal.close(openForm.resetForm);
    }
  }

  /**
 * 新規会社の取消ボタンを押下 
 * 
 */
  cancleCompanyModel(openForm: NgForm) {
    if (this.addCompanyModal != null) {
      this.cliarCompanyInfo();
      openForm.reset();
      this.addCompanyModal.close(openForm.resetForm);
    }
  }

  /**
   * 新規会社情報のクリア
   */
  cliarCompanyInfo() {
    this.pageModel.addTargetCompanyUserInfo.newCompanyInfo.corporatenumber = '';
    this.pageModel.addTargetCompanyUserInfo.newCompanyInfo.companyname = '';
    this.pageModel.addTargetCompanyUserInfo.newCompanyInfo.address = '';
    this.pageModel.addTargetCompanyUserInfo.newCompanyInfo.industry = '';
    this.pageModel.addTargetCompanyUserInfo.newCompanyInfo.tel = '';
    this.pageModel.addTargetCompanyUserInfo.newCompanyInfo.mail = '';
    this.pageModel.addTargetCompanyUserInfo.newCompanyInfo.fax = '';
  }

  getResultMs(item) {
    this.pageModel.result.retcode = '';
    this.pageModel.result.message = '';
    this.pageModel.result.retcode = item.resultCode;
    this.pageModel.result.message = item.resultMsg;
  }

  showAlert(alertType, alertDetail) {
    this.messageService.add({
      key: 'alertModal',
      severity: alertType,
      summary: alertType,
      detail: alertDetail,
      life: 2000
    });
  }

  /**
   * 
   * @param role 
   */
  setRole(role) {
    this.pageModel.addTargetUserInfo.role = role.defaultValue;
  }

  /**
 * 
 * @param role 
 */
  setMyUserRole(role) {
    this.pageModel.adduserInfo.role = role.defaultValue;
  }

  openData(pvalue: any){
    console.log("click");
    if(pvalue!==null||pvalue!==''){

      this.users.forEach((elem) => {

        elem.expanded=true;
   
      });
      this.jsonUsers=null;
      let parents = this.users.filter(value => value.upperuserid == 'undefined' || value.upperuserid == this.pageModel.loginUser.loginuserid);
      let childrens = this.users.filter(value => value.upperuserid !== 'undefined' && value.upperuserid != this.pageModel.loginUser.loginuserid);
      this.jsonUsers = this.translatorFilter(parents, childrens);
      this.jsonUsers.sort(function(a, b){
        // チームで並び替え
        if(a.companyid !== b.companyid){
          // 文字列は大小で比較する必要がある
          if(a.companyid > b.companyid) return 1
          if(a.companyid < b.companyid) return -1
        }
        // スコアで並び替え
        if(a.userCount !== b.userCount){
          // -1 かけて降順にする
          return (a.userCount - b.userCount) * -1
        }
        return 0
      });
    }
  }

  translatorFilter(parents, childrens) {
    parents.forEach(parent => {
      parent.data = {
        "companyName": parent.companyName,
        "companyid": parent.companyid,
        "deviceCount": parent.deviceCount,
        "email": parent.email,
        "firstname": parent.firstname,
        "lastname": parent.lastname,
        "projectCount": parent.projectCount,
        "role": parent.role,
        "upperuserid": parent.upperuserid,
        "userCount": parent.userCount,
        "userid": parent.userid,
        "username": parent.username
      };
      childrens.forEach((child, index) => {
        child.data = child;
        if (parent.userid == child.upperuserid) {
          let temp = [];
          childrens.forEach(element => {
            if (element.data) {
              temp.push(element.data)
            } else {
              temp.push(element)
            }
          });
          // let temp = childrens;
          temp.splice(index, 1);
          this.translatorFilter([child], temp);
          if (typeof parent.children !== "undefined") {
            // parent.children.push(child);
            // parent.data.push(child);
          } else {
            parent.children = [child]
            // parent.data = data;
          }
        }
      });
    });
    return parents;
  }
}
