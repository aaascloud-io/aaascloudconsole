import { Component, OnInit, ViewChild, EventEmitter, Output, Renderer2, NgModule } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import * as XLSX from 'xlsx';
import { AlertService } from '../../_services/alert.service';
import { HttpService } from 'src/app/_services/HttpService';
import { UserInfo } from '../../_common/_interface/userInfo'
import { MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

class Contact {
  constructor(
    public id: number,
    public producttypename: any,
    public productid: any,
    public productcode: any,
    public productname: string,
    public model: string,
    public simflag: number,
    public version: string,
    public summary: string,
    public createusername: string,
    public createuserid: string,
  ) { }
}
const formInputData = require('../../../assets/data/forms/form-elements/form-inputs.json');
const selectData = require('../../../assets/data/forms/form-elements/select.json');

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers: [MessageService, ConfirmationService],
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
  productTypes = [{producttypename:"FACE"},{producttypename:"WATCH"},{producttypename:"TRACKUN"}];
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
      producttypename: '',
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
      producttypename: '',
      productcode: '',
      productName: '',
      model: '',
      version: '',
      sim: 0,
      summary: ''
    },
    query: {
      producttypename: '',
      productname: '',
      createusername: '',
    },
    sort: {
      producttypenameUp: false,
      producttypenameDown: false,
      productcodeUp: false,
      productcodeDown: false,
      productnameUp: false,
      productnameDown: false,
      modelUp: false,
      modelDown: false,
      simflagUp: false,
      simflagDown: false,
      versionUp: false,
      versionDown: false,
      createusernameUp: false,
      createusernameDown: false,
    }
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
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private confirmationService: ConfirmationService,
  ) {
    // this.getProductAll();
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.pageSize = 10;
    this.singlebasicSelected = this.singleSelectArray[0].item_text;
    this.userInfo = this.httpService.getLoginUser();

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
   * プロダクトを削除する
   * @param row
   */
  deleteRow(row) {
    this.confirmationService.confirm({
      message: row.productname + "を削除します。よろしいですか？",
      header: 'プロダクト削除確認',
      accept: () => {
        var query = {
          "productid": row.productid,
        }
        this.httpService.useRpDelete('deleteProduct', query).then(item => {
          try {
            if (item.resultCode === "0000") {

              this.searchMyProduct();
              this.showAlert("success", "プロジェクトを削除しました。");
            } else {
              this.showAlert("error", "削除失敗、ご確認してください。");
            }
          } catch (e) {
            this.showAlert("error", e);
          }
        });
      },
      reject: () => {
        this.showAlert("info", "削除操作を取消しました");
      },
    });
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
      this.showAlert("warn", "プロダクトを選択してください。");
      return
    }
    this.confirmationService.confirm({
      message: "選択したデーターを削除しますか",
      header: 'プロダクト削除確認',
      accept: () => {

        var query = {
          "productidlist": deleteCheckedids,
        }
        this.httpService.useRpDelete('deleteProducts', query).then(item => {
          try {
            if (item.resultCode === "0000") {
              this.searchMyProduct();
              this.showAlert("success", "選択したプロダクトを削除しました");
              this.productSelected = false;
            } else {
              this.showAlert("error", "削除失敗、ご確認してください。");
            }
          } catch (e) {
            this.showAlert("error", e);
          }
        });
      },
      reject: () => {
        this.showAlert("info", "削除操作を取消しました");
      },
    });
  }

  /**
   * プロダクト情報を更新する
   *
   * @param editForm      Edit form for values check
   * @param id      Id match to the selected row Id
   */
  onUpdate(editForm: NgForm) {

    var flg = true;
    if (flg && !this.selectedContact.productname) {
      this.showAlert("warn", "プロダクト名を入力してください。");
      flg = false;
    }

    if (flg) {
      this.selectedContact.simflag = this.simFlg === true ? 1 : 0;
      var query = {
        "productid": this.selectedContact.productid,
        "createuserid": this.selectedContact.createuserid,
        "producttypename": this.selectedContact.producttypename,
        "productcode": this.selectedContact.productcode,
        "productname": this.selectedContact.productname,
        "model": this.selectedContact.model,
        "version": this.selectedContact.version,
        "simflag": this.selectedContact.simflag,
        "summary": this.selectedContact.summary
      }

      this.httpService.useRpPut('updateProduct', query).then(item => {
        try {
          if (item.resultCode === "0000") {
            this.showAlert("success", "プロダクト情報を改修しました");
            this.searchMyProduct();
            if (editForm.valid === true) {
              editForm.reset();
              this.updateModal.close(editForm.resetForm);
            }
          } else {
            this.showAlert("error", "改修失敗、ご確認してください。");
          }
        } catch (e) {
          this.showAlert("error", e);
        }
      });
    }
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

    var producttypename = this.pageModel.addProduct.producttypename;
    var createuserid = this.pageModel.addProduct.createuserid;
    var productName = this.pageModel.addProduct.productName;
    var flg = true;

    if (flg && !producttypename) {
      this.showAlert("warn", "タイプを選択してください。");
      flg = false;
    }

    if (flg && !createuserid) {
      this.showAlert("warn", "利用者を選択してください。");
      flg = false;
    }

    if (flg && !productName) {
      this.showAlert("warn", "会社名を選択してください。");
      flg = false;
    }

    if (flg) {
      var sim = this.pageModel.addProduct.sim === true ? '1' : '0';
      var query = {
        "producttypename": this.pageModel.addProduct.producttypename,
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
            this.showAlert("success", "プロダクトを登録しました。");
            console.log('登録成功です。');
            console.log(item);
            if (editForm.valid === true) {
              editForm.reset();
              this.addModal.close(editForm.resetForm);
            }
            this.searchMyProduct();
          } else {
            this.showAlert("error", "登録失敗、ご確認してください。");
          }
        } catch (e) {
          this.showAlert("error", e);
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
      "producttypename": this.pageModel.query.producttypename,
      "productname": this.pageModel.query.productname,
      "createusername": this.pageModel.query.createusername,
    };

    this.httpService.usePost('searchMyProduct', query).then(item => {
      try {
        this.rows = [];
        console.log(item);
        var index = 1;
        if (item) {
          item.forEach((elem) => {
            var producttypename = ""
            this.rows.push(new Contact(
              index,
              elem.producttypename,
              elem.productid,
              elem.productcode,
              elem.productname,
              elem.model,
              elem.simflag,
              elem.version,
              elem.summary,
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
 * ユーザー一覧取得
 */
  protected async getUnderUsers() {
    var query = {
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
      this.productList.sort(this.alphabetically(false, nm));
      this.sortOn = 1;
    }

    this.pageModel.sort.producttypenameUp = false;
    this.pageModel.sort.producttypenameDown = false;
    this.pageModel.sort.productcodeUp = false;
    this.pageModel.sort.productcodeDown = false;
    this.pageModel.sort.productnameUp = false;
    this.pageModel.sort.productnameDown = false;

    this.pageModel.sort.modelUp = false;
    this.pageModel.sort.modelDown = false;

    this.pageModel.sort.simflagUp = false;
    this.pageModel.sort.simflagDown = false;
    this.pageModel.sort.versionUp = false;
    this.pageModel.sort.versionDown = false;
    this.pageModel.sort.createusernameUp = false;
    this.pageModel.sort.createusernameDown = false;

    switch (nm) {
      case 'producttypename':
        if (this.sortOn == 1) {
          this.pageModel.sort.producttypenameUp = true
        } else {
          this.pageModel.sort.producttypenameDown = true
        }
        break;
      case 'productcode':
        if (this.sortOn == 1) {
          this.pageModel.sort.productcodeUp = true
        } else {
          this.pageModel.sort.productcodeDown = true
        }
        break;
      case 'productname':
        if (this.sortOn == 1) {
          this.pageModel.sort.productnameUp = true
        } else {
          this.pageModel.sort.productnameDown = true
        }
        break;
      case 'model':
        if (this.sortOn == 1) {
          this.pageModel.sort.modelUp = true
        } else {
          this.pageModel.sort.modelDown = true
        }
        break;
      case 'simflag':
        if (this.sortOn == 1) {
          this.pageModel.sort.simflagUp = true
        } else {
          this.pageModel.sort.simflagDown = true
        }
        break;
      case 'version':
        if (this.sortOn == 1) {
          this.pageModel.sort.versionUp = true
        } else {
          this.pageModel.sort.versionDown = true
        }
        break;
      case 'createusername':
        if (this.sortOn == 1) {
          this.pageModel.sort.createusernameUp = true
        } else {
          this.pageModel.sort.createusernameDown = true
        }
        break;
      case 'createusername':
        if (this.sortOn == 1) {
          this.pageModel.sort.createusernameUp = true
        } else {
          this.pageModel.sort.createusernameDown = true
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
