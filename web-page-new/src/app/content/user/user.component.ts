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

  userInfo: UserInfo;
  files: TreeNode[];
  files1: TreeNode[];
  addUserInfo: FormGroup;


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
  contactFlag: boolean;
  addContact: any;
  placement = 'bottom-right';
  imagepathdefault: any;
  addModal = null;
  addCompanyModal = null;
  addMyModal = null;
  addProxyModal = null;
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
      { field: 'userid', header: 'ユーザーID' },
      { field: 'username', header: 'ユーザー名' },
      { field: 'companyName', header: '会社名' },
      { field: 'role', header: '権限' },
      { field: 'email', header: 'メール' },
      { field: 'userfullname', header: '作成者' },
    ];

    this.files = <TreeNode[]>[
      {
        "data": {
          "companyName": "アイフォーカス",
          "companyid": 1,
          "email": "ifocus@ifocus",
          "firstname": "wang",
          "lastname": "wang",
          "projectCount": 4,
          "role": 1,
          "upperuserid": 0,
          "userCount": 7,
          "userfullname": "wang wang",
          "userid": 1,
          "username": "wang",
        },
        "children": [
          {
            "data": {
              "companyName": "アイフォーカス",
              "companyid": 1,
              "email": "ifocus@ifocus",
              "firstname": "wang",
              "lastname": "wang",
              "projectCount": 4,
              "role": 1,
              "upperuserid": 0,
              "userCount": 7,
              "userfullname": "wang wang",
              "userid": 1,
              "username": "wang",
            },
            "children": [
              {
                "data": {
                  "companyName": "アイフォーカス",
                  "companyid": 1,
                  "email": "ifocus@ifocus",
                  "firstname": "wang",
                  "lastname": "wang",
                  "projectCount": 4,
                  "role": 1,
                  "upperuserid": 0,
                  "userCount": 7,
                  "userfullname": "wang wang",
                  "userid": 1,
                  "username": "wang",
                }
              },
              {
                "data": {
                  "companyName": "アイフォーカス",
                  "companyid": 1,
                  "email": "ifocus@ifocus",
                  "firstname": "wang",
                  "lastname": "wang",
                  "projectCount": 4,
                  "role": 1,
                  "upperuserid": 0,
                  "userCount": 7,
                  "userfullname": "wang wang",
                  "userid": 1,
                  "username": "wang",
                }
              },
              {
                "data": {
                  "companyName": "アイフォーカス",
                  "companyid": 1,
                  "email": "ifocus@ifocus",
                  "firstname": "wang",
                  "lastname": "wang",
                  "projectCount": 4,
                  "role": 1,
                  "upperuserid": 0,
                  "userCount": 7,
                  "userfullname": "wang wang",
                  "userid": 1,
                  "username": "wang",
                }
              }
            ]
          },
          {
            "data": {
              "companyName": "アイフォーカス",
              "companyid": 1,
              "email": "ifocus@ifocus",
              "firstname": "wang",
              "lastname": "wang",
              "projectCount": 4,
              "role": 1,
              "upperuserid": 0,
              "userCount": 7,
              "userfullname": "wang wang",
              "userid": 1,
              "username": "wang",
            }
          },
          {
            "data": {
              "userid": "1",
              "username": "王3",
              "companyName": "王3会社",
            }
          }
        ]
      },
      {
        "data": {
          "userid": "1",
          "username": "i-focus2",
          "companyName": "アイフォーカス２",
        },
        "children": [
          {
            "data": {
              "userid": "1",
              "username": "wang",
              "companyName": "王会社",
            }
          },
          {
            "data": {
              "userid": "1",
              "username": "wang1",
              "companyName": "王1会社",
            }
          }
        ]
      },
      {
        "data": {
          "userid": "1",
          "username": "i-focus3",
          "companyName": "アイフォーカス3",
        },
        "children": [
          {
            "data": {
              "userid": "1",
              "username": "wang",
              "companyName": "王会社",
            }
          },
          {
            "data": {
              "userid": "1",
              "username": "wang",
              "companyName": "王会社",
            }
          }
        ]
      },
      {
        "data": {
          "userid": "1",
          "username": "i-focus4",
          "companyName": "アイフォーカス4",
        },
        "children": [
          {
            "data": {
              "userid": "1",
              "username": "wang",
              "companyName": "王会社",
            },
            "children": [
              {
                "data": {
                  "userid": "1",
                  "username": "wang2",
                  "companyName": "王2会社",
                }
              },
              {
                "data": {
                  "userid": "1",
                  "username": "wang3",
                  "companyName": "王3会社",
                }
              }
            ]
          },
          {
            "data": {
              "userid": "1",
              "username": "i-focus4",
              "companyName": "アイフォーカス２",
            },
            "children": [
              {
                "data": {
                  "userid": "1",
                  "username": "wang",
                  "companyName": "王会社",
                }
              }
            ]
          }
        ]
      },
      {
        "data": {
          "userid": "1",
          "username": "wang",
          "companyName": "王会社",
        },
        "children": [
          {
            "data": {
              "userid": "1",
              "username": "wang",
              "companyName": "王会社",
            },
            "children": [
              {
                "data": {
                  "userid": "1",
                  "username": "wang",
                  "companyName": "王会社",
                }
              },
              {
                "data": {
                  "userid": "1",
                  "username": "wang",
                  "companyName": "王会社",
                }
              }
            ]
          },
          {
            "data": {
              "userid": "1",
              "username": "wang",
              "companyName": "王会社",
            },
            "children": [
              {
                "data": {
                  "userid": "1",
                  "username": "wang",
                  "companyName": "王会社",
                }
              },
              {
                "data": {
                  "userid": "1",
                  "username": "wang",
                  "companyName": "王会社",
                }
              }
            ]
          }
        ]
      },
      {
        "data": {
          "userid": "1",
          "username": "wang",
          "companyName": "王会社",
        },
        "children": [
          {
            "data": {
              "userid": "1",
              "username": "wang",
              "companyName": "王会社",
            }
          },
          {
            "data": {
              "userid": "1",
              "username": "wang",
              "companyName": "王会社",
            }
          },
          {
            "data": {
              "userid": "1",
              "username": "wang",
              "companyName": "王会社",
            }
          }
        ]
      },
      {
        "data": {
          "userid": "1",
          "username": "wang",
          "companyName": "王会社",
        },
        "children": [
          {
            "data": {
              "userid": "1",
              "username": "wang",
              "companyName": "王会社",
            }
          },
          {
            "data": {
              "userid": "1",
              "username": "wang",
              "companyName": "王会社",
            }
          }
        ]
      },
      {
        "data": {
          "userid": "1",
          "username": "wang",
          "companyName": "王会社",
        },
        "children": [
          {
            "data": {
              "userid": "1",
              "username": "wang",
              "companyName": "王会社",
            }
          },
          {
            "data": {
              "userid": "1",
              "username": "wang",
              "companyName": "王会社",
            },
          }
        ],
      },
      {
        "data": {
          "userid": "1",
          "username": "wang",
          "companyName": "王会社",
        },
        "children": [
          {
            "data": {
              "userid": "1",
              "username": "wang",
              "companyName": "王会社",
            }
          },
          {
            "data": {
              "name": "intro.avi",
              "size": "500mb",
              "type": "Video"
            }
          }
        ]
      }
    ]

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
      , size: 'lg'
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
      , size: 'lg'
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
     * 代理店の新規ユーザーを呼び出し
     *
     * @param editTableDataModalContent     Id of the edit contact model.
     * @param row     The row which needs to be edited.
     */
  addRowTableDataModal(editTableNewDataModalContent, row) {
    this.selectedContact = Object.assign({}, row);
    this.addProxyModal = this.modal.open(editTableNewDataModalContent, {
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

    if (confirm("削除してもよろしいでしょうか")) {

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
    var flg = false;
    for (var selecteUser of this.userList) {
      if (selecteUser.isSelected) {
        this.selectedUserid.push({ "userid": selecteUser.userid });
        flg = true;
      }
    }
    if (!flg) {
      alert("プロダクトを選択してください");
      return
    }

    if (confirm("削除してもよろしいでしょうか")) {
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
            alert('削除成功です。');
          } else {
            alert('ユーザー情報は削除失敗です。');
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

    this.httpService.useRpPut('updateUser', query).then(item => {
      this.pageModel.result.retcode = '';
      this.pageModel.result.message = '';
      try {
        if (item.resultCode === "0000") {
          console.log('更新成功です。');
          console.log(item);
          this.ngOnInit();
          this.getResultMs(item);
          alert('更新成功です。');
          if (editUpdateForm.valid === true) {
            editUpdateForm.reset();
            this.updateModal.close(editUpdateForm.resetForm);
          }
          // editUpdateForm.reset();
          // this.editModal(editUpdateForm.resetForm);
        } else {
          this.getResultMs(item);
          alert('ユーザー情報は更新失敗です。');
        }
      } catch (e) {
        alert('ユーザー情報は更新失敗です。');
      }
    });
  }

  /**
   * ユーザー新規登録（自社新規）
   *
   * @param
   */
  addMyCompUser(addForm: NgForm) {
    var companyid = this.pageModel.loginUser.logincompanyid;
    var username = this.pageModel.adduserInfo.username;
    var role = this.pageModel.adduserInfo.role;
    var flg = true;

    if (flg && !username) {
      confirm(`ユーザー名を入力してください。`);
      flg = false;
    }

    if (flg && !role) {
      confirm(`新規種類を選択してください。`);
      flg = false;
    }

    if (flg) {
      var query = {
        "companyid": companyid,
        "username": username,
        "role": role,
      }
      this.registerUser(query, addForm);
    }
  }

  /**
   * ユーザー新規登録（他社新規・会社存在）
   *
   * @param 
   */
  addCompUser(addForm: NgForm) {
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
          "targetuserid": this.pageModel.adduserInfo.upperuserid,
        },

        "companyid": this.pageModel.adduserInfo.companyInfo.companyid,
        "username": this.pageModel.adduserInfo.username,
        "role": this.pageModel.adduserInfo.role,
      }
      this.registerUser(query, addForm);
    }
    // addForm.reset();
    // this.addModal.close(addForm.resetForm);

  }

  /**
   * ユーザー新規登録（他社新規・会社存在しない）
   * 
   */
  addNewCompUser(addForm: NgForm) {
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
          "targetuserid": this.pageModel.loginUser.loginuserid,
        },

        "username": this.pageModel.adduserInfo.username,
        "upperuserid": this.pageModel.loginUser.loginuserid,
        "corporatenumber": this.pageModel.adduserInfo.newCompanyInfo.corporatenumber,
        "role": this.pageModel.adduserInfo.role,
        "companyname": this.pageModel.adduserInfo.newCompanyInfo.companyname,
        "address": this.pageModel.adduserInfo.newCompanyInfo.address,
        "industry": this.pageModel.adduserInfo.newCompanyInfo.industry,
        "mail": this.pageModel.adduserInfo.newCompanyInfo.mail,
        "tel": this.pageModel.adduserInfo.newCompanyInfo.tel,
        "fax": this.pageModel.adduserInfo.newCompanyInfo.fax,
      };

      this.registerUser(query, addForm);
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
          alert('ユーザー情報は登録成功です。');
          if (addForm.valid === true) {
            addForm.reset();
            this.addModal.close(addForm.resetForm);
          }
        } else if (item.resultCode === "0013") {
          alert('管理者を追加するには、上位会社に依頼してください。');
        } else {
          alert('登録失敗です。');
        }
      } catch (e) {
        console.log('登録失敗です。');
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
          alert('ユーザー情報は登録成功です。');
          if (addForm.valid === true) {
            addForm.reset();
            this.addModal.close(addForm.resetForm);
          }
        } else if (item.resultCode === "0013") {
          alert('管理者を追加するには、上位会社に依頼してください。');
        } else {
          alert('登録失敗です。');
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
      "loginInfo": this.pageModel.userInfoParame.loginInfo,
      "targetUserInfo": {
        "targetuserid": this.pageModel.loginUser.loginuserid,
        "targetuserCompanyid": this.pageModel.loginUser.logincompanyid,
      },
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
            ));
            index++;
          });
          var list = [];
          // this.pageModel.jsonUserList[0].child = item;
          // this.pageModel.jsonUserList[0].parent = item[0];
          // this.pageModel.jsonUserList[0].child[0].parent = item[0];
          // this.pageModel.jsonUserList[0].child[0].child = item;
          // this.files1 = <TreeNode[]>this.pageModel.jsonUserList;
          // console.log("画面表示の一覧");
          // console.log(this.files);

          let parents = item.filter(value => value.upperuserid == 'undefined' || value.upperuserid == this.pageModel.loginUser.loginuserid);
          let childrens = item.filter(value => value.upperuserid !== 'undefined' && value.upperuserid != this.pageModel.loginUser.loginuserid);
          // var list = {parent:{}, child:[]};
          this.jsonUsers = this.translator(parents, childrens);
          console.log("==========取得JSONUSERS=============");
          console.log(this.jsonUsers);
          // var files = <TreeNode[]>this.jsonUsers;
          console.log("==========転換後のJSONUSERS=============");
          // console.log(files);
        }
        this.rows = [...this.rows];
        this.getTabledata();
        // }

      } catch (e) {
        console.log('失敗');
      }
    });
  }

  translator(parents, childrens) {
    var list = [];
    var data = { data: {}, child: [] };
    var data1 = {};
    if (parents) {
      parents.forEach(parent => {
        childrens.forEach((child, index) => {
          if (parent.userid == child.upperuserid) {
            let temp = JSON.parse(JSON.stringify(childrens));
            temp.childs = temp;
            temp.splice(index, 1);
            this.translator([child], temp);
            typeof parent.childrens !== "undefined" ?
              parent.Contact.push(child) : parent.Contact = [child];
          }
        });
      });
    }
    var userMap = { data: {}, children: [] };
    const copyList = childrens.slice(0)
    const tree = []
    for (let i = 0; i < copyList.length; i++) {
      // 找出每一项的父节点，并将其作为父节点的children
      for (let j = 0; j < copyList.length; j++) {
        if (copyList[i].userid === copyList[j].upperuserid) {
          if (copyList[j].children === undefined) {
            copyList[j].children = []
          }
          copyList[j].children.push(copyList[i])
        }
      }
      // 把根节点提取出来，parentId为null的就是根节点
      if (copyList[i].parentId === null) {
        tree.push(copyList[i])
      }
    }
    return parents;
  }


  fliterEvent(parents, childrens) {
    this.fliterEvent(parents, childrens);
    return parents;
  }

  /**
   * ユーザー一覧を取得する(上位管理者)
   * 
   */
  async getUnderUsers() {
    var query = {
      "loginInfo": this.pageModel.userInfoParame.loginInfo,
      "targetUserInfo": {
        "targetuserid": this.pageModel.loginUser.loginuserid,
        "targetuserCompanyid": this.pageModel.loginUser.logincompanyid,
      },
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
}
