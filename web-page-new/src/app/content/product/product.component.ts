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
    public phone: string,
    public producttypeid: any,
    public productid: any,
    public productcode: any,
    public productname: string,
    public model: string,
    public simflag: number,
    public version: string,
    public summary: string,
    public producttypename: string,
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
  temp = [];
  temp2 = this.rows;
  singlebasicSelected: any;
  productTypes = [];

  public config: PerfectScrollbarConfigInterface = {};
  multipleMultiSelect: any;
  public multipleSelectArray = formInputData.multipleSelectArray;
  public singleSelectArray = selectData.singleSelectArray;

  pageModel = {
    USERCODE: null,
    addList: [],
    dataAll: [],
    productList: [],
    addProduct: {
      productTypeId: null,
      productcode: '',
      productName: '',
      model: '',
      version: '',
      sim: 0,
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
    query:{
      producttypeid: null,
      productname:'',
      sakuseiuserid: null,
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
    this.getProductTypes();
    // this.getProductAll();
  }

  ngOnInit(): void {
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
    this.getProductAll();
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

            this.getProductAll();
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

    this.rows;
    if (confirm("選択したデーターを削除しますか")) {

      var deleteCheckedids = [];
      for (var selecteInfo of this.selected) {
        deleteCheckedids.push(selecteInfo.productid);
      }
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
            this.getProductAll();
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
   * Update contact details
   *
   * @param editForm      Edit form for values check
   * @param id      Id match to the selected row Id
   */
  onUpdate(editForm: NgForm) {
    // for (const row of this.rows) {
    //   if (row.id === id && editForm.valid === true) {
    //     row.name = this.selectedContact['name'];
    //     row.email = this.selectedContact['email'];
    //     row.phone = this.selectedContact['phone'];
    //     row.phone = this.selectedContact['phone'];
    //     this.editModal.close(editForm.resetForm);
    //     break;
    //   }
    // }

    var query = {
      "loginInfo": {
        "loginuserid": this.pageModel.loginUser.loginuserid,
        "logincompanyid": this.pageModel.loginUser.logincompanyid
      },
      "targetUserInfo": {
        "targetuserid": this.pageModel.loginUser.loginuserid,
      },

      "productid": this.selectedContact.productid,
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
        console.log('更新成功です。');
        console.log(item);
        alert('更新成功です。');
        this.getProductAll();
        if (editForm.valid === true) {
          editForm.reset();
          this.updateModal.close(editForm.resetForm);
        }
      } catch (e) {
        console.log('更新失敗です。');
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

    var query = {
      "loginInfo": this.pageModel.loginUser,
      "targetUserInfo": {
        "targetuserid": this.pageModel.loginUser.loginuserid,
      },

      "producttypeid": this.pageModel.addProduct.productTypeId,
      "productcode": this.pageModel.addProduct.productcode,
      "productname": this.pageModel.addProduct.productName,
      "model": this.pageModel.addProduct.model,
      "version": this.pageModel.addProduct.version,
      "simflag": this.pageModel.addProduct.sim,
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
          this.getProductAll();
        }
      } catch (e) {
        console.log('登録失敗です。');
        alert('登録失敗です。');
      }
    });

    // addForm.reset();
    // this.addModal.close(addForm.resetForm);

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
 * 一括登録用サンプルのダウンロード(画面より)
 * 
 */
  protected downloadSampleFiles() {
    let link = document.createElement("a");
    link.download = "productInsert.xlsx";
    link.href = "assets/excel/productInsert.xlsx";
    link.click();
  }

  /**
   * プロダクト一覧取得
   */
  protected async getProductAll() {
    var query = this.pageModel.userInfoParame;

    this.httpService.usePost('getProductAll', query).then(item => {
      try {
        this.rows = [];
        console.log(item);
        var index = 1;
        this.pageModel.productList = item;
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
              elem.productname,
              elem.producttypeid,
              elem.productid,
              elem.productcode,
              elem.productname,
              elem.model,
              elem.simflag,
              elem.version,
              elem.summary,
              producttypename,
            ));
            index++;
          });
          this.rows = [...this.rows];
        }

      } catch (e) {
        console.log('ユーザー数数を検索API エラー　発生しました。');
      }
    });
  }

   /**
   * プロダクトの条件より、取得する
   */
  async searchMyProducts() {
    
    var query = {
      "loginInfo": this.pageModel.loginUser,
      "targetUserInfo": {
        "targetuserid": this.pageModel.loginUser.loginuserid,
      },
      "producttypeid": this.pageModel.query.producttypeid,
      "productname": this.pageModel.query.productname,
      "sakuseiuserid": this.pageModel.query.sakuseiuserid,

    };


    this.httpService.usePost('searchMyProduct', query).then(item => {
      try {
        this.rows = [];
        console.log(item);
        var index = 1;
        this.pageModel.productList = item;
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
              elem.productname,
              elem.producttypeid,
              elem.productid,
              elem.productcode,
              elem.productname,
              elem.model,
              elem.simflag,
              elem.version,
              elem.summary,
              producttypename,
            ));
            index++;
          });
          this.rows = [...this.rows];
        }

      } catch (e) {
        console.log('ユーザー数数を検索API エラー　発生しました。');
      }
    });
  }

  /**
   * プロダクト一覧取得
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

}
