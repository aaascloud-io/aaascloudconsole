import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output, Renderer2 } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { AlertService } from '../../_services/alert.service';
import { HttpService } from 'src/app/_services/HttpService';
import { RouteIdIF } from 'src/app/_common/_Interface/RouteIdIF';
import { UserInfo } from 'src/app/_common/_Interface/UserInfo';
import { number } from 'ngx-custom-validators/src/app/number/validator';
// import * as _ from 'lodash';
import { map, startWith } from 'rxjs/operators';
import { NgBlockUI, BlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css']
})
export class DeviceComponent implements OnInit {
  show = false;　 //条件検索表示flg
  addModal = null;
  editModal = null;
  deviceSelected = false;
  public companySelectArray = [];
  public productSelectArray = [];
  selectedDevice: any;
  //page用
  pageSize: any;
  collectionSize: any;
  page = 1;
  TableData: any;
  sortOn: any;

  public pageModel = {
    //Loginユーザー情報
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
      sslChecked: false,
      encryptedcommunications: 0,
      encryptedkey: '',
      connectserverurl: '',
      connectserverport: '',
      bindingflagChecked: false,
      bindingflag: 0,
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
  @Output() closeModalEvent = new EventEmitter<boolean>();

  /**
   * Constructor
   *
   * @param NgbModal  modal;
   */
  constructor(
    private modal: NgbModal,
    private alertService: AlertService,
    private httpService: HttpService,
  ) { }

  ngOnInit(): void {
    this.pageSize = 10
    this.Init();
  }

  Init() {
    let item: UserInfo = this.httpService.getLoginUser();
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
          console.log('デバイスを検索APIエラー発生しました。');
        }
      })
    } else {

    }
  }

  serachDevices() {
    this.pageModel.query.companyid = this.pageModel.query.conpanySelected !== null ? this.pageModel.query.conpanySelected["companyid"] : '';
    let item: UserInfo = this.httpService.getLoginUser();
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
          console.log('デバイスを検索APIエラー発生しました。');
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
 * Open registerDeviceModal
 *
 * @param registerDeviceModal      Id of the add contact modal;
 */
  openRegisterModal(registerDeviceModal) {
    this.addModal = this.modal.open(registerDeviceModal, {
      windowClass: 'animated fadeInDown'
      , size: 'lg'
    });
  }

  /**
  * Open registerExcelModal
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
   * open editDeviceModel
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
  }

  /**
   * New contact add to the table
   *
   * @param addDeviceForm     Add contact form
   */
  registerDeviceDetail(addDeviceForm: NgForm, registerForm: ElementRef) {
    if (this.pageModel.deviceDetail.sn == '' || this.pageModel.deviceDetail.imei == '' || this.pageModel.deviceDetail.productid == '') {
      alert("必須項目を入力してください。");
      return;
    }
    //tel number 位数チェック　 value, name, templateForm: ElementRef
    if (this.pageModel.deviceDetail.sim_tel.length > 0 && this.pageModel.deviceDetail.sim_tel.length < 11) {
      alert("Tel Numberを11桁を入力してください。");
      this.setFocus('simtel', registerForm)
      return;
    }
    let routeif: UserInfo = this.httpService.getLoginUser();
    if (routeif != null) {
      this.pageModel.deviceDetail.encryptedcommunications = this.pageModel.deviceDetail.sslChecked == false ? 0 : 1;
      this.pageModel.deviceDetail.bindingflag = this.pageModel.deviceDetail.bindingflagChecked == false ? 0 : 1;
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
      this.httpService.useRpPost('registerDevice', param).then(item => {
        try {
          if (item != null) {
            if (item.resultCode == "0000") {
              // $("#addinfo").hide();
              // $('.modal-backdrop').remove();
              alert('デバイス情報を登録しました');
              if (addDeviceForm.valid === true) {
                addDeviceForm.reset();
                this.addModal.close(addDeviceForm.resetForm);
              }
              //deviceDetailクリア
              for (var prop in this.pageModel.deviceDetail) {
                if (this.pageModel.deviceDetail.hasOwnProperty(prop)) {
                  this.pageModel.deviceDetail[prop] = '';
                }
              }
              this.Init();
            } else if (item.resultCode == "0002") {
              alert('権限ないです、登録失敗しました');
            } else if (item.resultCode == "0100") {
              alert('登録失敗しました');
            } else {
              this.setFocus(item.resultCode, registerForm)
              alert(item.resultMsg);
            }
          }
        } catch (e) {
          console.log(e);
        }
      });
    }
  }

  /**
 * New contact add to the table
 *
 * @param editDeviceForm     Add contact form
 * @param deviceid      Id match to the selected row Id
 * 
 */
  editDeviceDetail(editDeviceForm: NgForm, deviceid) {
    if (this.pageModel.deviceDetail.productSelected["productid"] == null) {
      return;
    }
    let routeif: UserInfo = this.httpService.getLoginUser();
    if (routeif != null) {
      this.pageModel.deviceDetail.deviceid = deviceid
      this.pageModel.deviceDetail.devicename = this.selectedDevice['devicename'];
      this.pageModel.deviceDetail.sim_iccid = this.selectedDevice['sim_iccid'];
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
      }
      this.httpService.useRpPut('updateDevice', param).then(item => {
        try {
          if (item.resultCode == "0000") {
            this.Init();
            // $("#addinfo").hide();
            // $('.modal-backdrop').remove();
            alert('デバイス情報を改修しました');

            if (editDeviceForm.valid === true) {
              editDeviceForm.reset();
              this.editModal.close(editDeviceForm.resetForm);
            }
            //deviceDetailクリア
            for (var prop in this.pageModel.deviceDetail) {
              if (this.pageModel.deviceDetail.hasOwnProperty(prop)) {
                this.pageModel.deviceDetail[prop] = '';
              }
            }
          }else if(item.resultCode == "0002"){
            alert('権限なし');
          }else if(item.resultCode == "0101"){
            alert('更新失敗しました。');
          }
        } catch (e) {
          console.log(e);
        }
      });
    }
  }

  /**
 * New contact add to the table
 *
 * @param addExeclForm     Add contact form
 */
  registerDevices(addExeclForm: NgForm) {
    let routeif: UserInfo = this.httpService.getLoginUser();
    if (routeif != null) {
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

          this.Init();
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
        }else if(item.resultCode == "0002"){
          alert('権限なし');
        }
      } catch (e) {
        console.log(e);
      }
    });
  }

  /**
   * Delete contact row
   * @param row     Selected row for delete contact
   */
  deleteRow(row) {
    if (confirm(row.devicename + "を削除します。よろしいですか？")) {
      let item: UserInfo = this.httpService.getLoginUser();
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
          "deviceid": row.deviceid
        }
        this.httpService.useRpDelete('deleteDevice', param).then(item => {
          try {
            if (item.resultCode == "0000") {
              this.Init();
              // $("#addinfo").hide();
              // $('.modal-backdrop').remove();
              alert('デバイスを削除しました');
            }else{
              alert('権限なし');
            }
          } catch (e) {
            console.log(e);
          }
        }
        );
      }
    }
  }

  /**
 * Delete selected device
 */
  deleteCheckedRow() {
    let index = 0;
    const removedIndex = [];
    const temp = [...this.pageModel.deviceList];
    for (const row of temp) {
      if (row.isSelected == true) {
        removedIndex.push(row.deviceid);
        index++;
      }
    }
    if (index === 0) {
      alert('デバイスを選択してください。');
      return
    }
    if (confirm("選択したデバイスを全削除します。よろしいですか？")) {
      let item: UserInfo = this.httpService.getLoginUser();
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
          "deviceidlist": removedIndex
        }
        this.httpService.useRpDelete('deleteDevices', param).then(item => {
          try {
            if (item.resultCode == "0000") {
              alert('選択したデバイスを削除しました');
              this.Init();
            }else {
              alert('権限なし');
            }
          } catch (e) {
            console.log(e);
          }
        }
        );
      }
    }
  }

  lengthCheck(value, name, templateForm: ElementRef) {
    if (value.length > 0 && value.length < 11) {
      alert("Tel Numberを11桁を入力してください。");
      this.setFocus(name, templateForm)
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
    this.collectionSize = this.pageModel.deviceList.length;
    this.pageModel.deviceList.forEach(x => x.isSelected = false)
    this.PaginationData;
  }
  /**
 * Pagination table
 */
  get PaginationData() {
    if (this.pageModel.deviceList) {
      return this.pageModel.deviceList.map((device, i) => ({ deviceid: i + 1, ...device }))
        .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    }
  }

  sortData(nm) {
    if (this.sortOn == 1) {
      this.pageModel.deviceList.sort(this.alphabetically(true, nm));
      this.sortOn = 2;
    } else {
      this.pageModel.deviceList.sort(this.alphabetically(false, nm));
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

  alphabetically(ascending, nm) {
    return function (a, b) {
      // equal items sort equally
      if (a[nm] === b[nm]) {
        return 0;
      }
      // nulls sort after anything else
      else if (a[nm] === null) {
        return 1;
      }
      else if (b[nm] === null) {
        return -1;
      }
      // otherwise, if we're ascending, lowest sorts first
      else if (ascending) {
        return a[nm] < b[nm] ? -1 : 1;
      }
      // if descending, highest sorts first
      else {
        return a[nm] < b[nm] ? 1 : -1;
      }
    };
  }

  checkAll(ev) {
    this.pageModel.deviceList.forEach(x => x.isSelected = ev.target.checked)
    this.deviceSelected = ev.target.checked;
  }

  checkChange(ev, selectDevice) {
    this.pageModel.deviceList.forEach(function (device) {
      if (device.deviceid === selectDevice['deviceid']) { device.isSelected = ev.target.checked }
    });
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
