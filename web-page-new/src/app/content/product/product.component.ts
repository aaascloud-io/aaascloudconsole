import { Component, OnInit, ViewChild, EventEmitter, Output, Renderer2, NgModule } from '@angular/core';
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
// import { USERCODE } from '../../_common/_utils/codes-utils';

class Contact {
  constructor(
    public id: number,
    public producttypeid: any,
    public productid: any,
    public productcode: any,
    public productname: string,
    public model: string,
    public simflag: number,
    public version: string,
    public summary: string,
    public producttypename: string,
    public createusername: string,
    public createuserid: string
  ) { }
}
const formInputData = require('../../../assets/data/forms/form-elements/form-inputs.json');
const selectData = require('../../../assets/data/forms/form-elements/select.json');

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  userInfo: UserInfo;

  columns: any = [];

  contactFavorite: boolean;
  contactactive: string;
  rows: any[] = [];
  selectedContact: any;
  contactFlag: boolean;
  addContact: any;
  placement = 'bottom-right';
  addModal = null;
  updateModal = null;
  loadingIndicator: true;
  selected = [];
  temp = [];
  temp2 = this.rows;
  singlebasicSelected: any;
  productSelected = false;
  productTypes = [];
  users = [];
  show = false;
  simFlg = false;

  public config: PerfectScrollbarConfigInterface = {};
  multipleMultiSelect: any;
  public multipleSelectArray = formInputData.multipleSelectArray;
  public singleSelectArray = selectData.singleSelectArray;

  pageSize: any;
  collectionSize: any;
  productList: any;
  page = 1;
  TableData: any;
  sortOn: any;
  checkOn: 1;

  pageModel = {
    USERCODE: null,
    addList: [],
    dataAll: [],
    productList: [],
    addProduct: {
      productTypeId: null,
      createuserid: null,
      productcode: '',
      productName: '',
      model: '',
      version: '',
      sim: false,
      summary: ''
    },
    updataProduct: {
      productId: 0,
      productTypeId: 0,
      productcode: '',
      productName: '',
      model: '',
      version: '',
      sim: 0,
      summary: ''
    },
    loginUser: {
      loginuserid: null,
      loginusername: '',
      loginrole: null,
      logincompanyid: '',
    },
    userInfoParame: {},
    query: {
      producttypename: '',
      productname: '',
      createusername: '',
    },
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
  ) {
    // this.getProductAll();
  }

  ngOnInit(): void {
    this.pageSize = 10;
    this.singlebasicSelected = this.singleSelectArray[0].item_text;
    let item: RouteIdIF = this.dataFatoryService.getRouteIdIF();

    //to do ユーザー名で　ロケーションデータを取る
    this.pageModel.loginUser.loginuserid = item.uid;
    this.pageModel.loginUser.loginusername = item.login_id;
    this.pageModel.loginUser.loginrole = item.role;
    this.pageModel.loginUser.logincompanyid = item.company;

    this.pageModel.userInfoParame = {
      "loginInfo": {
        "loginuserid": this.pageModel.loginUser.loginuserid,
        "loginusername": this.pageModel.loginUser.loginusername,
        "loginrole": this.pageModel.loginUser.loginrole,
        "logincompanyid": this.pageModel.loginUser.logincompanyid
      },
      "targetUserInfo": {
        "targetuserid": this.pageModel.loginUser.loginuserid,
        "targetuserCompanyid": this.pageModel.loginUser.logincompanyid
      }
    }
    this.getProductTypes();
    this.getUnderUsers();
    this.searchMyProduct();
  }

  /**
 * Add new contact
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
     * Edit selected contact row.
     *
     * @param editTableDataModalContent     Id of the edit contact model.
     * @param row     The row which needs to be edited.
     */
  editTableDataModal(editTableDataModalContent, row) {
    this.selectedContact = Object.assign({}, row);
    this.updateModal = this.modal.open(editTableDataModalContent, {
      windowClass: 'animated fadeInDown'
      , size: 'lg'
    });
    this.contactFlag = false;
    this.simFlg = this.selectedContact.simflag === 1 ? true : false;
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
   * Delete contact row
   * @param row     Selected row for delete contact
   */
  deleteRow(row) {
    if (confirm("削除してもよろしいでしょうか")) {
      var query = {
        "loginInfo": this.pageModel.loginUser,
        "targetUserInfo": {
          "targetuserid": this.pageModel.loginUser.loginuserid,
        },
        "productid": row.productid,
      }
      this.httpService.delete('deleteProduct', query).then(item => {
        try {
          if (item.body.resultCode === "0000") {

            this.searchMyProduct();
            alert('削除成功です。');
          } else {
            console.log('削除失敗です。');
          }
        } catch (e) {
          console.log('削除失敗です。');
        }
      });
    }
  }

  /**
   * 選択されたプロダクトを削除する
   */
  deleteCheckedRow() {
    var deleteCheckedids = [];
    var flg = false;
    for (var row of this.rows) {
      if (row.isSelected) {
        deleteCheckedids.push(row.productid);
        flg = true;
        console.log(flg);
      }
    }
    if (!flg) {
      alert("プロダクトを選択してください");
      return
    }
    if (confirm("選択したデーターを削除しますか")) {
      var query = {
        "loginInfo": this.pageModel.loginUser,
        "targetUserInfo": {
          "targetuserid": this.pageModel.loginUser.loginuserid,
        },
        "productidlist": deleteCheckedids,
      }
      this.httpService.delete('deleteProducts', query).then(item => {
        try {
          if (item.body.resultCode === "0000") {
            this.searchMyProduct();
            alert('削除成功です。');
            this.productSelected = false;
          } else {
            alert('削除失敗です。');
          }
        } catch (e) {
          console.log('削除失敗です。');
        }
      });
    }
  }

  /**
   * プロダクト情報を更新する
   *
   * @param editForm      Edit form for values check
   * @param id      Id match to the selected row Id
   */
  onUpdate(editForm: NgForm) {

    this.selectedContact.simflag = this.simFlg === true ? 1 : 0;
    var query = {
      "loginInfo": {
        "loginuserid": this.pageModel.loginUser.loginuserid,
        "logincompanyid": this.pageModel.loginUser.logincompanyid
      },
      "targetUserInfo": {
        "targetuserid": this.pageModel.loginUser.loginuserid,
      },

      "productid": this.selectedContact.productid,
      "createuserid": this.selectedContact.createuserid,
      "producttypeid": this.selectedContact.producttypeid,
      "productcode": this.selectedContact.productcode,
      "productname": this.selectedContact.productname,
      "model": this.selectedContact.model,
      "version": this.selectedContact.version,
      "simflag": this.selectedContact.simflag,
      "summary": this.selectedContact.summary
    }

    this.httpService.put('updateProduct', query).then(item => {
      try {
        if (item.body.resultCode === "0000") {
          console.log('更新成功です。');
          console.log(item);
          alert('更新成功です。');
          this.searchMyProduct();
          if (editForm.valid === true) {
            editForm.reset();
            this.updateModal.close(editForm.resetForm);
          }
        } else {
          alert('更新失敗です。');
        }
      } catch (e) {
        alert('更新失敗です。');
      }
    });
  }

  /**
   * Contact changed to favorite or non-favorite
   *
   * @param row     Row of the favorite contact
   */
  favoriteChange(row) {
    if (row.isFavorite) {
      row.isFavorite = row.isFavorite ? false : true;
    } else {
      row.isFavorite = true;
    }
  }


  /**
   * favorite set when add contact
   *
   * @param event     favorite set on click event
   */
  addFavoriteImage(event) {
    if (event.target.checked === true) {
      this.contactFavorite = true;
    } else {
      this.contactFavorite = false;
    }
  }

  /**
   * New contact add to the table
   *
   * @param addForm     Add contact form
   */
  addNewContact(editForm: NgForm) {
    // if (this.contactactive === undefined) {
    //   this.contactactive = 'away';
    // } else {
    //   this.contactactive = this.contactactive;
    // }

    var productTypeId = this.pageModel.addProduct.productTypeId;
    var createuserid = this.pageModel.addProduct.createuserid;
    var productName = this.pageModel.addProduct.productName;
    var flg = true;

    if (flg && !productTypeId) {
      confirm(`タイプを選択してください。`);
      flg = false;
    }

    if (flg && !createuserid) {
      confirm(`作成者を選択してください。`);
      flg = false;
    }

    if (flg && !productName) {
      confirm(`会社名を入力してください。`);
      flg = false;
    }

    if (flg) {
      var sim = this.pageModel.addProduct.sim === true ? '1' : '0';
      var query = {
        "loginInfo": this.pageModel.loginUser,
        "targetUserInfo": {
          "targetuserid": this.pageModel.addProduct.createuserid,
        },

        "producttypeid": this.pageModel.addProduct.productTypeId,
        "createuserid": this.pageModel.addProduct.createuserid,
        "productcode": this.pageModel.addProduct.productcode,
        "productname": this.pageModel.addProduct.productName,
        "model": this.pageModel.addProduct.model,
        "version": this.pageModel.addProduct.version,
        "simflag": sim,
        "summary": this.pageModel.addProduct.summary
      }

      this.httpService.useRpPost('registerProduct', query).then(item => {
        try {
          if (item.resultCode === "0000") {
            console.log('登録成功です。');
            console.log(item);
            if (editForm.valid === true) {
              editForm.reset();
              this.addModal.close(editForm.resetForm);
            }
            alert('登録成功です。');
            this.searchMyProduct();
          } else {
            alert('登録失敗です。');
          }
        } catch (e) {
          alert('登録失敗です。');
        }
      });
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
  * プロダクトの条件より、取得する
  */
  async searchMyProduct() {

    var query = {
      "loginInfo": this.pageModel.loginUser,
      "targetUserInfo": {
        "targetuserid": this.pageModel.loginUser.loginuserid,
      },
      "producttypename": this.pageModel.query.producttypename,
      "productname": this.pageModel.query.productname,
      "createusername": this.pageModel.query.createusername,

    };

    this.httpService.usePost('searchMyProduct', query).then(item => {
      try {
        this.rows = [];
        console.log(item);
        var index = 1;
        // this.pageModel.productList = item;
        if (item != null) {
          item.forEach((elem) => {
            var producttypename = ""
            // プロダクトタイプ名の検索
            for (const productType of this.productTypes) {
              if (productType.producttypeid === elem.producttypeid) {
                producttypename = productType.producttypename;
              }
            }
            this.rows.push(new Contact(
              index,
              elem.producttypeid,
              elem.productid,
              elem.productcode,
              elem.productname,
              elem.model,
              elem.simflag,
              elem.version,
              elem.summary,
              producttypename,
              elem.createusername,
              elem.createuserid
            ));
            index++;
          });
          this.rows = [...this.rows];
          this.getTabledata();
        }

      } catch (e) {
        console.log('ユーザー数数を検索API エラー　発生しました。');
      }
    });
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
        }
      } catch (e) {
        console.log("プロダクトタイプの取得は失敗しました。");
      }
    });
  }

  /**
 * ユーザー一覧取得
 */
  protected async getUnderUsers() {
    var query = {
      "loginInfo": this.pageModel.loginUser,
      "targetUserInfo": {
        "targetuserid": this.pageModel.loginUser.loginuserid,
      },
    };
    this.httpService.usePost('getUnderUsers', query).then(item => {
      try {
        if (item) {
          this.users = item;
          console.log(item);
          console.log("すべてのユーザーの取得は成功しました。");
        } else {
          console.log("すべてのユーザーの取得は0件。");
        }
      } catch (e) {
        console.log("すべてのユーザーの取得は失敗しました。");
      }
    });
  }

  sortData(nm) {
    if (this.sortOn == 1) {
      this.productList.sort(this.alphabetically(true, nm));
      this.sortOn = 2;
    } else {
      this.productList.sort(this.alphabetically(true, nm));
      this.sortOn = 1;
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
    this.productList.forEach(x => x.isSelected = ev.target.checked)
    this.productSelected = ev.target.checked;
  }

  checkChange(ev, selected) {
    this.productList.forEach(function (product) {
      if (product.productid === selected['productid']) { product.isSelected = ev.target.checked }
    });
  }

  isAllChecked() {
    // return this.productList.every(_ => _.productSelected);
    // this.productSelected=true;

  }

  getTabledata() {
    this.productList = this.rows;
    this.collectionSize = this.productList.length;
    this.productList.forEach(x => x.isSelected = false)
    this.PaginationData;
  }

  /**
* Pagination table
*/
  get PaginationData() {
    if (this.productList) {
      return this.productList.map((person, i) => ({ productid: i + 1, ...person }))
        .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    }
  }

  /**
   * 取消ボタンを押下
   * 
   */
  cancleModel(openForm: NgForm) {
    // if (openForm.valid === true) {
    // openForm.reset();
    if (this.addModal != null) {
      openForm.reset();
      this.addModal.close(openForm.resetForm);
    }
    if (this.updateModal != null) {
      this.updateModal.close(openForm.resetForm);
    }
    // }
  }
}
