import { Component, OnInit, ViewChild, EventEmitter, Output, Renderer2 } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import * as XLSX from 'xlsx';
import { AlertService } from '../../_services/alert.service';
import { HttpService } from 'src/app/_services/HttpService';
import { DataFatoryService } from 'src/app/_services/DataFatoryService';
import { RouteIdIF } from 'src/app/_common/_Interface/RouteIdIF';
import { number } from 'ngx-custom-validators/src/app/number/validator';


class Contact {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public phone: string,
    public image: any,
    public isFavorite: boolean,
    public isActive: string
  ) { }
}
const formInputData = require('../../../assets/data/forms/form-elements/form-inputs.json');
const selectData = require('../../../assets/data/forms/form-elements/select.json');

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css']
})
export class DeviceComponent implements OnInit {
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

  public pageModel = {
    //Login情報
    LoginUser: {
      loginuserid: '',
      logincompanyid: '',
      loginrole: null,
      loginusername: '',
      loginupperuserid: '',
    },
    //一覧用
    deviceList: [],
    // 一括登録のデバイス定義リスト
    addDeviceDetailList:[],
    deviceDetail: {
      devicename: '',
      imei: '',
      iccid: '',
      sn: '',
      companyid: '',
      //todo
      // 暗号化通信
      // 暗号化キー
      // 接続サーバアドレス
      // 接続サーバポート番号
      // バンディング済みフラグ
      //業界
      productid: '',
      sim_imsi: '',
      sim_tel: '',
      sim_iccid: ''
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
  ) { }

  ngOnInit(): void {
    this.singlebasicSelected = this.singleSelectArray[0].item_text;
    this.Init(null);
  }
  // 新規
  insert(): void {
    let item: RouteIdIF = this.dataFatoryService.getRouteIdIF();
    if (item != null) {
      //to do ユーザー名で　ロケーションデータを取る
      // this.pageModel.addDeviceDetailList.push(this.pageModel.deviceObj);
      var param = {
        "loginInfo": {
          "loginuserid": item.uid,
          "loginusername": item.login_id,
          "loginrole": item.role,
          "logincompanyid": item.company
        },
        "targetUserInfo": {
          "targetuserid": item.uid,
          "targetuserCompanyid": item.company
        },
        "deviceDetail":this.pageModel.deviceDetail
      }
    }
    this.httpService.usePost('registerDevice', param).then(item => {
      let data = JSON.parse(item);
      try {
        if (data.result) {
          this.Init(null);
          // $("#addinfo").hide();
          // $('.modal-backdrop').remove();
          alert('デバイス情報を登録しました');
        }
      } catch (e) {
        console.log(e);
      }
    });
  }



  Init(pre: any) {
    let item: RouteIdIF = this.dataFatoryService.getRouteIdIF();
    if (item != null) {
      var param = {
        "loginInfo": {
          "loginuserid": item.uid,
          "loginusername": item.login_id,
          "loginrole": item.role,
          "logincompanyid": item.company
        },
        "targetUserInfo": {
          "targetuserid": item.uid,
          "targetuserCompanyid": item.company
        }
      }

      this.httpService.usePost('/getCompanyDevices', param).then(item => {
        try {

          if (item != null) {
            this.pageModel.deviceList = item;
          }

        } catch (e) {
          console.log('ユーザー数数を検索API エラー　発生しました。');
        }
      })
    }
  }
  /**
 * Add new contact
 *
 * @param addModalContent      Id of the add contact modal;
 */
  addLargeModal(addModalContent) {
    this.addModal = this.modal.open(addModalContent, {
      windowClass: 'animated fadeInDown'
      , size: 'lg'
    });
    this.contactFlag = true;
  }

  /**
* Add new contact
*
* @param addTableDataModalContent      Id of the add contact modal;
*/
  addMaxModal(addTableDataModalContent) {
    this.addModal = this.modal.open(addTableDataModalContent, {
      windowClass: 'animated fadeInDown modal-xl'
      , size: 'lg'
    });
    this.contactFlag = true;
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
   * New contact add to the table
   *
   * @param addForm     Add contact form
   */
  addNewContact(addForm: NgForm) {

    let item: RouteIdIF = this.dataFatoryService.getRouteIdIF();
    if (item != null) {
      //to do ユーザー名で　ロケーションデータを取る
      // this.pageModel.addDeviceDetailList.push(this.pageModel.deviceObj);
      var param = {
        "loginInfo": {
          "loginuserid": item.uid,
          "loginusername": item.login_id,
          "loginrole": item.role,
          "logincompanyid": item.company
        },
        "targetUserInfo": {
          "targetuserid": item.uid,
          "targetuserCompanyid": item.company
        },
        "deviceDetail":this.pageModel.addDeviceDetailList
      }
    }
    this.httpService.usePost('registerDevice', param).then(item => {
      let data = JSON.parse(item);
      try {
        if (data.result) {
          this.Init(null);
          // $("#addinfo").hide();
          // $('.modal-backdrop').remove();
          alert('デバイス情報を登録しました');
        }
      } catch (e) {
        console.log(e);
      }
    });
    /**
     * Add contact if valid addform value
     */
    if (addForm.valid === true) {

      addForm.reset();
      this.addModal.close(addForm.resetForm);
    }
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

  // /**
  //  * Search contact from contact table
  //  *
  //  * @param event     Convert value uppercase to lowercase;
  //  */
  // updateFilter(event) {
  //   const val = event.target.value.toLowerCase();
  //   this.rows = [...this.temp2];
  //   this.temp = [...this.rows];
  //   const temp = this.rows.filter(function (d) {
  //     return d.name.toLowerCase().indexOf(val) !== -1 || !val;
  //   });
  //   this.rows = temp;
  //   this.table.offset = 0;
  // }

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
    let index = 0;
    const temp = [...this.rows];
    for (const tempRow of temp) {
      if (tempRow.id === row.id) {
        temp.splice(index, 1);
        break;
      }
      index++;
    }
    this.rows = temp;
  }

  /**
   * Update contact details
   *
   * @param editForm      Edit form for values check
   * @param id      Id match to the selected row Id
   */
  onUpdate(editForm: NgForm, id) {
    for (const row of this.rows) {
      if (row.id === id && editForm.valid === true) {
        row.name = this.selectedContact['name'];
        row.email = this.selectedContact['email'];
        row.phone = this.selectedContact['phone'];
        this.editModal.close(editForm.resetForm);
        break;
      }
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
    link.download = "deviceInsert.xlsx";
    link.href = "assets/excel/deviceInsert.xlsx";
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
        this.pageModel.addDeviceDetailList = jsonData['rawData'];
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
}
