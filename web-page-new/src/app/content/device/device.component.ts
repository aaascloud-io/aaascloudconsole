import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output, Renderer2 } from '@angular/core';
import { NgForm, Validators, FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import * as XLSX from 'xlsx';
import { AlertService } from '../../_services/alert.service';
import { HttpService } from 'src/app/_services/HttpService';
import { DataFatoryService } from 'src/app/_services/DataFatoryService';
import { RouteIdIF } from 'src/app/_common/_Interface/RouteIdIF';
import { UserInfo } from 'src/app/_common/_Interface/UserInfo';
import { number } from 'ngx-custom-validators/src/app/number/validator';
// import * as _ from 'lodash';
import { map, startWith } from 'rxjs/operators';
import { NgBlockUI, BlockUI } from 'ng-block-ui';

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
  contactImage: any;
  contactFavorite: boolean;
  contactactive: string;
  rows: any[] = [];
  name = 'Angular';
  public imagePath;
  imgURL: any;
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
  deviceSelected = false;
  show = false;
  public config: PerfectScrollbarConfigInterface = {};
  multipleMultiSelect: any;
  public multipleSelectArray = formInputData.multipleSelectArray;
  public singleSelectArray = selectData.singleSelectArray;
  //所有者
  public companySelectArray = [];
  //所有者
  public productSelectArray = [];
  //暗号化
  // public sslSelectArray = [
  //   {
  //     "item_id": 0, "item_text": "OFF"
  //   },
  //   {
  //     "item_id": 1, "item_text": "ON"
  //   }
  // ]
  // sslSelected: any;
  // sslChecked:any;
  //
  selectedDevice: any;

  pageSize: any;
  collectionSize: any;
  PERSON: any;
  page = 1;
  TableData: any;
  sortOn: any;

  checkOn: 1;
  simtel: any;
  public pageModel = {
    //Login情報
    LoginUser: {
      loginuserid: '',
      logincompanyid: '',
      loginrole: null,
      loginusername: '',
      loginupperuserid: '',
    },
    query: {
      querycode: '',
      productname: '',
      projectname: '',
      group: '',
      conpanySelected: {},
      companyid: '',
      industry: '',
    },
    //一覧用
    deviceList: [],
    // 一括登録のデバイス定義リスト
    addDeviceDetailList: [],
    deviceDetail: {
      deviceid: '',
      devicename: '',
      imei: '',
      sn: '',
      companySelected: {},
      companyid: '',
      // sslSelected: {},
      sslChecked: false,
      encryptedCommunications: 0,
      encryptedKey: '',
      connectserverurl: '',
      connectserverport: '',
      bindingflag: '',
      fmlastestversion: '',
      versioncomfirmtime: '',
      productSelected: {},
      productid: '',
      sim_imsi: '',
      sim_tel: '',
      sim_iccid: ''
    },
    sort: {
      snUp: false,
      snDown: false,
      imeiUp: false,
      imeiDown: false,
      iccidUp: false,
      iccidDown: false,
      // devicenameUp: false,
      // devicenameDown: false,
      companynameUp: false,
      companynameDown: false,
      productnameUp: false,
      productnameDown: false,
      projectnameUp: false,
      projectnameDown: false,
      groupnameUp: false,
      groupnameDown: false,
    }

  }

  @ViewChild('registerForm') registerForm: ElementRef;
  @ViewChild('editForm') editForm: ElementRef;
  @ViewChild('registerDeviceForm') registerDeviceForm: NgForm;
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
    this.pageSize = 10
    this.Init(null);
  }

  Init(pre: any) {
    let item: UserInfo = this.dataFatoryService.getUserInfo();
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
      this.getDropdownList(param);

      this.httpService.usePost('/getCompanyDevices', param).then(item => {
        try {
          if (item != null) {
            this.pageModel.deviceList = item;

            this.getTabledata();
          }
        } catch (e) {
          console.log('ユーザー数数を検索API エラー　発生しました。');
        }
      })
    }
  }

  serachDevices() {
    this.pageModel.query.companyid = this.pageModel.query.conpanySelected !== null ? this.pageModel.query.conpanySelected["companyid"] : '';
    let item: UserInfo = this.dataFatoryService.getUserInfo();
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
        },
        "imei": this.pageModel.query.querycode,
        "productname": this.pageModel.query.productname,
        "projectname": this.pageModel.query.projectname,
        "group": this.pageModel.query.group,
        "companyid": this.pageModel.query.companyid,
        "industry": this.pageModel.query.industry,
      }
      this.httpService.usePost('/searchCompanyDevices', param).then(item => {
        try {

          if (item != null) {
            this.pageModel.deviceList = item;
            this.getTabledata();
          }

        } catch (e) {
          console.log('ユーザー数数を検索API エラー　発生しました。');
        }
      })
    }
  }

  getDropdownList(param: any) {
    // let item: UserInfo = this.dataFatoryService.getUserInfo();
    // var param = {
    //   {"loginuserid": item.uid}
    // };
    this.httpService.usePost('/getUnderCompanies', { "loginuserid": param.loginInfo.loginuserid }).then(item => {
      try {
        if (item != null) {
          this.companySelectArray = item;
        }
      } catch (e) {
        console.log('配下会社一覧を取得API エラー　発生しました。');
      }
    })

    this.httpService.usePost('/getProductAll', param).then(item => {
      try {
        if (item != null) {
          this.productSelectArray = item;
        }
      } catch (e) {
        console.log('プロダクト一覧を取得API エラー　発生しました。');
      }
    })
  }

  /**
 * Add new contact
 *
 * @param registerDeviceModal      Id of the add contact modal;
 */
  openRegisterModal(registerDeviceModal) {
    this.addModal = this.modal.open(registerDeviceModal, {
      windowClass: 'animated fadeInDown'
      , size: 'lg'
    });
    // this.pageModel.deviceDetail;
  }

  /**
  * Add new contact
  *
  * @param registerExcelModal      Id of the add contact modal;
  */
  openExcelModal(registerExcelModal) {
    this.addModal = this.modal.open(registerExcelModal, {
      windowClass: 'animated fadeInDown modal-xl'
      , size: 'lg'
    });
  }

  /**
* Add new contact
*
* @param addTableDataModalContent      Id of the add contact modal;
*/
  openSelectGroupModal(addTableDataModalContent) {
    this.addModal = this.modal.open(addTableDataModalContent, {
      windowClass: 'animated fadeInDown'
    });
  }

  /**
   * Edit selected row.
   *
   * @param editDeviceModel     Id of the edit contact model.
   * @param row     The row which needs to be edited.
   */
  openEditModal(editDeviceModel, row) {
    this.selectedDevice = Object.assign({}, row);
    this.editModal = this.modal.open(editDeviceModel, {
      windowClass: 'animated fadeInDown'
      , size: 'lg'
    });
    this.pageModel.deviceDetail.productSelected = row;
    // this.singlebasicSelected = this.singleSelectArray[0].item_text;
  }

  /**
   * New contact add to the table
   *
   * @param addDeviceForm     Add contact form
   */
  registerDeviceDetail(addDeviceForm: NgForm, registerForm: ElementRef) {

    if (this.pageModel.deviceDetail.sn == '' || this.pageModel.deviceDetail.imei == '' || this.pageModel.deviceDetail.productid == '') {
      return;
    }
    let routeif: UserInfo = this.dataFatoryService.getUserInfo();
    if (routeif != null) {
      this.pageModel.deviceDetail.encryptedCommunications = this.pageModel.deviceDetail.sslChecked == false ? 0 : 1;

      var param = {
        "loginInfo": {
          "loginuserid": routeif.uid,
          "loginusername": routeif.login_id,
          "loginrole": routeif.role,
          "logincompanyid": routeif.company
        },
        "targetUserInfo": {
          "targetuserid": routeif.uid,
          "targetuserCompanyid": routeif.company
        },
        "deviceDetail": this.pageModel.deviceDetail
      }
    }
    this.httpService.useRpPost('registerDevice', param).then(item => {
      try {
        if (item.resultCode == "0000") {

          this.Init(null);
          // $("#addinfo").hide();
          // $('.modal-backdrop').remove();
          alert('デバイス情報を登録しました');

          if (addDeviceForm.valid === true) {

            addDeviceForm.reset();
            this.addModal.close(addDeviceForm.resetForm);
          }
        } else if (item.resultCode == "0002") {
          alert('権限ないです、登録失敗しました');
        } else {
          this.setFocus(item.resultCode, registerForm)
          alert(item.resultMsg);
        }
      } catch (e) {
        console.log(e);
      }
    });
  }

  /**
 * New contact add to the table
 *
 * @param editDeviceForm     Add contact form
 * @param deviceid      Id match to the selected row Id
 * 
 */
  editDeviceDetail(editDeviceForm: NgForm, deviceid) {

    if(this.pageModel.deviceDetail.productSelected == null ){
      return;
    }

    let routeif: UserInfo = this.dataFatoryService.getUserInfo();
    if (routeif != null) {
      this.pageModel.deviceDetail.deviceid = deviceid
      this.pageModel.deviceDetail.devicename = this.selectedDevice['devicename'];
      this.pageModel.deviceDetail.sim_iccid = this.selectedDevice['sim_iccid'];

      // this.pageModel.deviceDetail.sn = this.selectedDevice['sn'];
      // this.pageModel.deviceDetail.productid = this.selectedDevice['productid'];
      this.pageModel.deviceDetail.productid = this.pageModel.deviceDetail.productSelected["productid"];
      this.pageModel.deviceDetail.sim_imsi = this.selectedDevice['sim_imsi'];
      this.pageModel.deviceDetail.sim_tel = this.selectedDevice['sim_tel'];

      var param = {
        "loginInfo": {
          "loginuserid": routeif.uid,
          "loginusername": routeif.login_id,
          "loginrole": routeif.role,
          "logincompanyid": routeif.company
        },
        "targetUserInfo": {
          "targetuserid": routeif.uid,
          "targetuserCompanyid": routeif.company
        },
        "deviceDetail": this.pageModel.deviceDetail
        // "deviceid": deviceid,
        // "devicename":  this.selectedDevice['devicename'],
        // "sn": this.selectedDevice['sn'],
        // "productid": this.selectedDevice['productid'],
        // "sim_imsi":this.selectedDevice['sim_imsi'],
        // "sim_tel": this.selectedDevice['sim_tel'],
        // "sim_iccid":this.selectedDevice['sim_iccid'],
      }
    }
    this.httpService.useRpPut('updateDevice', param).then(item => {
      try {
        if (item.resultCode == "0000") {

          this.Init(null);
          // $("#addinfo").hide();
          // $('.modal-backdrop').remove();
          alert('デバイス情報を改修しました');

          /**
           * Add contact if valid addform value
           */
          if (editDeviceForm.valid === true) {

            editDeviceForm.reset();
            this.editModal.close(editDeviceForm.resetForm);
          }
        }
      } catch (e) {
        console.log(e);
      }
    });
  }

  /**
 * New contact add to the table
 *
 * @param addExeclForm     Add contact form
 */
  registerDevices(addExeclForm: NgForm) {
    let routeif: UserInfo = this.dataFatoryService.getUserInfo();
    if (routeif != null) {
      //to do ユーザー名で　ロケーションデータを取る
      // this.pageModel.addDeviceDetailList.push(this.pageModel.deviceObj);

      var param = {
        "loginInfo": {
          "loginuserid": routeif.uid,
          "loginusername": routeif.login_id,
          "loginrole": routeif.role,
          "logincompanyid": routeif.company
        },
        "targetUserInfo": {
          "targetuserid": routeif.uid,
          "targetuserCompanyid": routeif.company
        },
        "deviceDetailList": this.pageModel.addDeviceDetailList
      }
    }
    this.httpService.useRpPost('registerDevices', param).then(item => {
      try {
        if (item.resultCode == "0000") {

          this.Init(null);
          // $("#addinfo").hide();
          // $('.modal-backdrop').remove();
          alert('一括登録を成功しました');
          /**
 * Add contact if valid addform value
 */
          if (addExeclForm.valid === true) {

            addExeclForm.reset();
            this.addModal.close(addExeclForm.resetForm);
          }
        }
      } catch (e) {
        console.log(e);
      }
    });
  }

  /**
 * New contact add to the table
 *
 * @param addForm     Add contact form
 */
  groupSelect(addForm: NgForm) {

    let item: UserInfo = this.dataFatoryService.getUserInfo();
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
        "deviceDetail": this.pageModel.addDeviceDetailList
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
          /**
 * Add contact if valid addform value
 */
          if (addForm.valid === true) {

            addForm.reset();
            this.addModal.close(addForm.resetForm);
          }
        }
      } catch (e) {
        console.log(e);
      }
    });
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
    if (confirm(row.devicename + "を削除します。よろしいですか？")) {
      let item: UserInfo = this.dataFatoryService.getUserInfo();
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
          "deviceid": row.deviceid
        }
      }
      this.httpService.useRpDelete('deleteDevice', param).then(item => {
        try {
          if (item.resultCode == "0000") {

            this.Init(null);
            // $("#addinfo").hide();
            // $('.modal-backdrop').remove();
            alert('デバイスを削除しました');
          }
        } catch (e) {
          console.log(e);
        }
      }
      );
    }
  }

  /**
 * Delete selected contact
 */
  deleteCheckedRow() {
    if (confirm("選択したデバイスを全削除します。よろしいですか？")) {
      let index = 0;
      const removedIndex = [];
      const temp = [...this.pageModel.deviceList];

      for (const row of temp) {
        if (row.isSelected == true) {
          removedIndex.push(row.deviceid);
        }
        index++;
      }

      for (const row of temp) {
        for (const selectedRow of this.selected) {
          if (row.deviceid === selectedRow.deviceid) {
            removedIndex.push(row.deviceid);
          }
        }
        index++;
      }

      this.selected = [];

      let item: UserInfo = this.dataFatoryService.getUserInfo();
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
          "deviceidlist": removedIndex
        }
      }
      this.httpService.useRpDelete('deleteDevices', param).then(item => {
        try {
          if (item.resultCode == "0000") {

            this.Init(null);
            // $("#addinfo").hide();
            // $('.modal-backdrop').remove();
            alert('選択したデバイスを削除しました');
          }
        } catch (e) {
          console.log(e);
        }
      }
      );
    }
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
        row.name = this.selectedDevice['name'];
        row.email = this.selectedDevice['email'];
        row.phone = this.selectedDevice['phone'];
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

  lengthCheck(value, name, templateForm: ElementRef) {
    if (value.length > 0 && value.length < 11) {
      alert("Tel Numberを11桁を入力してください。");
      this.setFocus(name, templateForm)
    }
  }
  /**
   * Set the phone number format
   */
  editTelFormat() {
    const no = this.onFormatFn(this.selectedDevice['sim_tel']);
    this.selectedDevice['sim_tel'] = no;
  }

  registerTelFormat() {
    const no = this.onFormatFn(this.pageModel.deviceDetail['sim_tel']);
    this.pageModel.deviceDetail['sim_tel'] = no;
  }

  /**
   * Set the phone number format
   */
  onFormatFn(phonenm) {
    let country, city, number;
    switch (phonenm.length) {
      case 6:
        country = 1;
        city = phonenm.slice(0, 3);
        number = phonenm.slice(3);
        break;

      case 7:
        country = phonenm[0];
        city = phonenm.slice(1, 4);
        number = phonenm.slice(4);
        break;

      case 8:
        country = phonenm.slice(0, 3);
        city = phonenm.slice(3, 5);
        number = phonenm.slice(5);
        break;

      default:
        // country = phonenm.slice(0, 3);
        // city = phonenm.slice(3, 5);
        // number = phonenm.slice(6);
        break;
      // return phonenm;
    }
    if (country === 1) {
      country = '';
    }
    number = number.slice(0, 3) + '-' + number.slice(3);
    const no = '(' + city + ')' + '-' + number;
    return no;
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


  getTabledata() {
    this.PERSON = this.pageModel.deviceList;
    this.collectionSize = this.PERSON.length;
    this.PERSON.forEach(x => x.isSelected = false)
    this.PaginationData();
  }
  /**
 * Pagination table
 */
  get PaginationData() {
    if (this.PERSON) {
      // if (this.pageSize > 0) {
      // } else {
      //   if (this.PERSON.length > 100) {
      //     this.pageSize = 20
      //   } else {
      //     this.pageSize = 10
      //   }
      // }
      return this.PERSON.map((person, i) => ({ deviceid: i + 1, ...person }))
        .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    }
  }

  sortData(nm) {
    if (this.sortOn == 1) {
      this.PERSON.sort((b, a) => a[nm].localeCompare(b[nm]));
      this.sortOn = 2;
    } else {
      this.PERSON.sort((a, b) => a[nm].localeCompare(b[nm]));
      this.sortOn = 1;
    }
    this.pageModel.sort.snUp = false;
    this.pageModel.sort.snDown = false;
    this.pageModel.sort.imeiUp = false;
    this.pageModel.sort.imeiDown = false;
    this.pageModel.sort.iccidUp = false;
    this.pageModel.sort.iccidDown = false;
    // this.pageModel.sort.devicenameUp = false;
    // this.pageModel.sort.devicenameDown = false;
    this.pageModel.sort.companynameUp = false;
    this.pageModel.sort.companynameDown = false;
    this.pageModel.sort.productnameUp = false;
    this.pageModel.sort.productnameDown = false;
    this.pageModel.sort.projectnameUp = false;
    this.pageModel.sort.projectnameDown = false;
    this.pageModel.sort.groupnameUp = false;
    this.pageModel.sort.groupnameDown = false;

    switch (nm) {
      case 'sn':
        if (this.sortOn == 1) {
          this.pageModel.sort.snUp = true
        } else {
          this.pageModel.sort.snDown = true
        }
        break;
      case 'imei':
        if (this.sortOn == 1) {
          this.pageModel.sort.imeiUp = true
        } else {
          this.pageModel.sort.imeiDown = true
        }
        break;
      case 'sim_iccid':
        if (this.sortOn == 1) {
          this.pageModel.sort.iccidUp = true
        } else {
          this.pageModel.sort.iccidDown = true
        }
        break;
      // case 'devicename':
      //   if (this.sortOn == 1) {
      //     this.pageModel.sort.devicenameUp = true
      //   } else {
      //     this.pageModel.sort.devicenameDown = true
      //   }
      //   break;
      case 'companyname':
        if (this.sortOn == 1) {
          this.pageModel.sort.companynameUp = true
        } else {
          this.pageModel.sort.companynameDown = true
        }
        break;
      case 'productname':
        if (this.sortOn == 1) {
          this.pageModel.sort.productnameUp = true
        } else {
          this.pageModel.sort.productnameDown = true
        }
        break;
      case 'projectname':
        if (this.sortOn == 1) {
          this.pageModel.sort.projectnameUp = true
        } else {
          this.pageModel.sort.projectnameDown = true
        }
        break;
      case 'groupname':
        if (this.sortOn == 1) {
          this.pageModel.sort.groupnameUp = true
        } else {
          this.pageModel.sort.groupnameDown = true
        }
        break;
    }
  }

  checkAll(ev) {
    this.PERSON.forEach(x => x.isSelected = ev.target.checked)
    this.deviceSelected = ev.target.checked;
  }

  checkChange(ev, selectDevice) {
    this.PERSON.forEach(function (device) {
      if (device.deviceid === selectDevice['deviceid']) { device.isSelected = ev.target.checked }
    });

    // this.selected.splice(0, this.selected.length);
    // this.selected.push(...selected);
  }
  setFocus(name, templateForm: ElementRef) {
    const ctrls = Object.keys(templateForm);
    for (let key = 0; key < ctrls.length; key++) {
      var keystr = key.toString();
      if (keystr == ctrls[key]) {
        if (templateForm[key].name == name) {
          const control = templateForm[key];
          control.focus();
          control.select();
        }
      }
    }
  }

  /**
* Remove overlay when open sidebar
*
* @param NgForm    Content overlay
*/
  cancleModel(openForm: NgForm) {
    openForm.reset();
    if (this.addModal != null) {
      this.addModal.close(openForm.resetForm);
    }
    if (this.editModal != null) {
      this.editModal.close(openForm.resetForm);
    }
  }
}
