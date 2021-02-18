import { Component, OnInit, ViewChild, EventEmitter, Output, Renderer2 } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import * as XLSX from 'xlsx';
import { AlertService } from '../../_services/alert.service';
import { HttpService } from 'src/app/_services/HttpService';
import { UserInfo } from '../../_common/_interface/userInfo'

class Contact {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public phone: string,
    public productTypeId: any,
    public productid: any,
    public productcode: any,
    public productname: string,
    public model: string,
    public simflag: number,
    public version: string,
    public summary: string,
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
  editModal = null;
  value: any;
  loadingIndicator: true;
  selected = [];
  temp = [];
  temp2 = this.rows;
  singlebasicSelected: any;

  public config: PerfectScrollbarConfigInterface = {};
  multipleMultiSelect: any;
  public multipleSelectArray = formInputData.multipleSelectArray;
  public singleSelectArray = selectData.singleSelectArray;

  protected pageModel = {
    // 一括登録のデバイス定義リスト
    addList: [],
    dataAll: [],
    productList: [],
    addProduct: {
      productTypeId: 0,
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
  ) {
    this.getProductAll();
  }

  ngOnInit(): void {

    // this.rows.push(new Contact(1, 'Scott Marsh', 'scott@gmail.com', '(954)-654-5641',
    //   '../../assets/images/portrait/small/avatar-s-5.png', false, 'online'));
    // this.rows.push(new Contact(2, 'Russell Bry', 'russell@gmail.com', '(235)-654-5642',
    //   '../../assets/images/portrait/small/avatar-s-3.png', false, 'busy'));
    // this.rows.push(new Contact(3, 'james john', 'john@gmail.com', '(125)-654-5643',
    //   '../../assets/images/portrait/small/avatar-s-1.png', true, 'away'));
    // this.rows.push(new Contact(4, 'Cynth Tuck', 'tuck@gmail.com', '(974)-654-5644',
    //   '../../assets/images/portrait/small/avatar-s-4.png', false, 'busy'));
    // this.rows.push(new Contact(5, 'Margi Govan', 'govan@gmail.com', '(954)-654-5645',
    //   '../../assets/images/portrait/small/avatar-s-6.png', true, 'online'));
    // this.rows.push(new Contact(6, 'Eugene Wood', 'wood@gmail.com', '(987)-654-5646',
    //   '../../assets/images/portrait/small/avatar-s-9.png', false, 'busy'));
    // this.rows.push(new Contact(7, 'Eric Marshall', 'eric@gmail.com', '(545)-654-5647',
    //   '../../assets/images/portrait/small/avatar-s-7.png', false, 'online'));
    this.singlebasicSelected = this.singleSelectArray[0].item_text;

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
    this.editModal = this.modal.open(editTableDataModalContent, {
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
    var query = {
      "loginInfo": {
        "loginuserid": 100,
        "logincompanyid": 1
      },
      "productid": row.productid,
    }
    this.httpService.delete('deleteProduct', query).then(item => {
      try {
        if (item.body.resultCode === "0000") {

          this.getProductAll();
        } else {
          console.log('削除失敗です。');
        }
      } catch (e) {
        console.log('削除失敗です。');
      }
    });
  }

  /**
   * Update contact details
   *
   * @param editForm      Edit form for values check
   * @param id      Id match to the selected row Id
   */
  onUpdate() {
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
        "loginuserid": 1,
        "logincompanyid": 1
      },
      "targetUserInfo": {
        "targetuserid": 3
      },

      "productid": this.selectedContact.productid,
      "producttypeid": this.selectedContact.productTypeId,
      "productcode": this.selectedContact.productcode,
      "productname": this.selectedContact.productname,
      "model": this.selectedContact.model,
      "version": this.selectedContact.version,
      "simflag": this.selectedContact.sim,
      "summary": this.selectedContact.summary
    }

    this.httpService.put('updateProduct', query).then(item => {
      try {
        console.log('更新成功です。');
        console.log(item);
        this.getProductAll();
      } catch (e) {
        console.log('更新失敗です。');
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
   * Delete selected contact
   */
  deleteCheckedRow() {
    let index = 0;
    const removedIndex = [];
    const temp = [...this.rows];
    for (const row of temp) {
      for (const selectedRow of this.selected) {
        if (row.id === selectedRow.id) {
          removedIndex.push(index);
        }
      }
      index++;
    }
    for (let i = removedIndex.length - 1; i >= 0; i--) {
      temp.splice(removedIndex[i], 1);
    }
    this.rows = temp;
    this.selected = [];
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
  addNewContact() {
    // if (this.contactactive === undefined) {
    //   this.contactactive = 'away';
    // } else {
    //   this.contactactive = this.contactactive;
    // }

    var query = {
      "loginInfo": {
        "loginuserid": 1,
        "logincompanyid": 1
      },
      "targetUserInfo": {
        "targetuserid": 3
      },

      "producttypeid": this.pageModel.addProduct.productTypeId,
      "productcode": this.pageModel.addProduct.productcode,
      "productname": this.pageModel.addProduct.productName,
      "model": this.pageModel.addProduct.model,
      "version": this.pageModel.addProduct.version,
      "simflag": this.pageModel.addProduct.sim,
      "summary": this.pageModel.addProduct.summary
    }

    this.httpService.usePost('registerProduct', query).then(item => {
      try {
        console.log('登録成功です。');
        console.log(item);
        this.getProductAll();
      } catch (e) {
        console.log('登録失敗です。');
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
   * 一括登録用ファイルのロード(画面より)
   * 
   * @param event 
   */
  protected async changeTarget(event) {
    var obj = this;
    var file = event.target.files[0];
    // Logger.info(this, `got target file. name:[${file.name}]`);
    if (file) {
      var reader = new FileReader();
      reader.onload = (event) => {
        const data = reader.result;
        var workBook = XLSX.read(data, { type: 'binary' });
        var jsonData = workBook.SheetNames.reduce((initial, name) => {
          const sheet = workBook.Sheets[name];
          initial[name] = XLSX.utils.sheet_to_json(sheet);
          return initial;
        }, {});
        this.pageModel.dataAll = jsonData['rawData'];
        // Logger.info(this, `loaded. size:[${this.pageModel.dataAll.length}]`);
      }
      reader.onerror = (event) => {
        // obj.alert.danger("ファイル読み込み失敗しました");
        this.alertService.error("ファイル読み込み失敗しました");

      }
      ///読み込み実施
      reader.readAsBinaryString(file);
    }
  }

  /**
   * プロダクト一覧取得
   */
  protected async getProductAll() {
    this.httpService.usePost('getProductAll', {}).then(item => {
      try {
        this.rows = [];
        console.log(item);
        var index = 1;
        this.pageModel.productList = item;
        if (item != null) {
          item.forEach((elem) => {
            this.rows.push(new Contact(
              index,
              elem.productname,
              "EMAIL",
              "080-0000-000",
              elem.producttypeid,
              elem.productid,
              elem.productcode,
              elem.productname,
              elem.model,
              elem.simflag,
              elem.version,
              elem.summary
            ));
            index++;
          });
          this.rows = [...this.rows];

          // this.pageModel.products = item.productList;
          // this.pageModel.productLength = item.productCount;
          // this.pageModel.userList = item.userList;
          // this.pageModel.userLength = item.userCount;
          // this.pageModel.products = item.productList;
          // this.pageModel.errlogList = item.errlogList;
          // this.pageModel.errlogLength = item.errlogCount;

          // this.pageModel.projectLength = item.projectCount;
          // this.pageModel.deciveLength = item.deviceCount;
          // this.pageModel.deviceOnlLength = 0;


          // this.pageModel.products=[{productid:1,productcode:"code004",productname:"テスト用プロダクト",model:"モデム",version:"Ver0001",simflag:1,summary:"テスト",alive:0},{productid:2,productcode:"code004",productname:"テスト用プロダクト2",model:"モデム",version:"Ver0001",simflag:1,summary:"テスト",alive:0}];
          //  this.pageModel.productLength = 0;  
          // ユーザー数を検索
          // this.getUserListLengthApi(this.UserInfo.role, this.UserInfo.uid)
        }

      } catch (e) {
        console.log('ユーザー数数を検索API エラー　発生しました。');
      }
    });
  }
}
