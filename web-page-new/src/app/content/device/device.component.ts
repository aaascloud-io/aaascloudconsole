import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output, Renderer2 } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { AlertService } from '../../_services/alert.service';
import { HttpService } from 'src/app/_services/HttpService';
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
  addsModal = null;
  deviceSelected = false;
  public companySelectArray = [];
  public productSelectArray = [];
  public underUsersSelectArray = [];

  selectedDevice: any;
  //page用
  dataCount: 0;
  pageSize: any;
  collectionSize: any;
  page = 1;
  TableData: any;
  sortOn: any;
  editProductSelected: {};
  editUserSelected: {};
  editClickFlg = false;

  OpenFileName = "";
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
      productid: '',
      sim_imsi: '',
      sim_tel: '',
      sim_iccid: '',
      userid: ''
    },
    deviceDetailEdit: {
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
      productid: '',
      sim_imsi: '',
      sim_tel: '',
      sim_iccid: '',
      userid: ''
    },
    sort: {
      snUp: false,
      snDown: false,
      imeiUp: false,
      imeiDown: false,
      iccidUp: false,
      iccidDown: false,
      devicenameUp: false,
      devicenameDown: false,
      companynameUp: false,
      companynameDown: false,
      productnameUp: false,
      productnameDown: false,
      projectnameUp: false,
      projectnameDown: false,
      groupnameUp: false,
      groupnameDown: false,
    },
    checkColumn: {
      imei: false,
    }
  }

  @ViewChild('registerForm') registerForm: ElementRef;
  @ViewChild('editForm') editForm: ElementRef;
  @ViewChild('registerdevicesForm') registerdevicesForm: ElementRef;
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
      var param = {};
      // this.getDropdownList(param);
      this.httpService.usePost('/getUnderUserDevices',param).then(item => {
        try {
          if (item != null) {
            this.pageModel.deviceList = item;
            this.dataCount = item.length;
            this.getTabledata();
          }
        } catch (e) {
          console.log('デバイスを検索APIエラー発生しました。');
        }
      })
  }

  serachDevices() {
    //sortクリア
    for (var prop in this.pageModel.sort) {
      if (this.pageModel.sort.hasOwnProperty(prop)) {
        this.pageModel.sort[prop] = false;
      }
    }
      var param = {
        // "loginInfo": {
        //   "loginuserid": item.uid,
        //   "loginusername": item.login_id,
        //   "loginrole": item.role,
        //   "logincompanyid": item.company
        // },
        // "targetUserInfo": {
        //   "targetuserid": item.uid,
        //   "targetuserCompanyid": item.company
        // },
        "imei": this.pageModel.query.querycode,
        "productname": this.pageModel.query.productname,
        "projectname": this.pageModel.query.projectname,
        "groupname": this.pageModel.query.group,
        "companyid": this.pageModel.query.companyid,
      }
      this.httpService.usePost('/searchUnderUserDevices', param).then(item => {
        try {
          if (item != null) {
            this.pageModel.deviceList = item;
            this.dataCount = item.length;
            this.getTabledata();
          }
        } catch (e) {
          console.log('デバイスを検索APIエラー発生しました。');
        }
      })
  }

  getDropdownList(param: any) {

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
    });

    this.httpService.usePost('/getUnderUsers', param).then(item => {
      try {
        if (item != null) {
          this.underUsersSelectArray = item;
        }
      } catch (e) {
        console.log('プロダクト一覧を取得API エラー　発生しました。');
      }
    });


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
    this.addsModal = this.modal.open(registerExcelModal, {
      windowClass: 'animated fadeInDown modal-xl'
      , size: 'lg'
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
    this.selectedDevice.sslChecked = this.selectedDevice["encryptedcommunications"] == 0 ? false : true;
    this.selectedDevice.bindingflagChecked = this.selectedDevice["bindingflag"] == 0 ? false : true;
    this.editModal = this.modal.open(editDeviceModel, {
      windowClass: 'animated fadeInDown'
      , size: 'lg'
    });
    this.editProductSelected = row;
    this.editUserSelected = row;
  }

  /**
   * New contact add to the table
   *
   * @param addDeviceForm     Add contact form
   */
  registerDeviceDetail(addDeviceForm: NgForm, registerForm: ElementRef) {

    if (this.pageModel.deviceDetail.sn == '' 
    || this.pageModel.deviceDetail.imei == '' 
    || this.pageModel.deviceDetail.userid == null 
    || this.pageModel.deviceDetail.userid == '' 
    || this.pageModel.deviceDetail.productid == null
    || this.pageModel.deviceDetail.productid == '') {
      return;
    }
    //tel number 位数チェック　 value, name, templateForm: ElementRef
    if (this.pageModel.deviceDetail.sim_tel != null) {
      if (this.pageModel.deviceDetail.sim_tel.length > 0 && this.pageModel.deviceDetail.sim_tel.length < 10) {
        alert("SIMカード電話番号：ハイフンなしの10桁または11桁の半角数字で入力してください");
        this.setFocus('simtel', registerForm)
        return;
      }
    }
      this.pageModel.deviceDetail.encryptedcommunications = this.pageModel.deviceDetail.sslChecked == false ? 0 : 1;
      this.pageModel.deviceDetail.bindingflag = this.pageModel.deviceDetail.bindingflagChecked == false ? 0 : 1;
      var param = {
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
            } else if (item.resultCode == "0003") {
              this.setFocus(item.resultData, registerForm)
              alert(item.resultMsg);
            } else {
              alert('登録失敗しました');
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
 * @param editDeviceForm     Add contact form
 * @param deviceid      Id match to the selected row Id
 * 
 */
  editDeviceDetail(editDeviceForm: NgForm, deviceid, editForm: ElementRef) {
    if(this.editProductSelected==null || this.editUserSelected==null){
      return;
    }
    if (this.editProductSelected["productid"] == null || this.editUserSelected["userid"] == null) {
      return;
    }
    //tel number 位数チェック　 value, name, templateForm: ElementRef
    if (this.selectedDevice['sim_tel'].length > 0 && this.selectedDevice['sim_tel'].length < 10) {
      alert("SIMカード電話番号：ハイフンなしの10桁または11桁の半角数字で入力してください");
      this.setFocus('simtel', editForm)
      return;
    }
      this.pageModel.deviceDetailEdit.deviceid = deviceid
      this.pageModel.deviceDetailEdit.devicename = this.selectedDevice['devicename'];
      this.pageModel.deviceDetailEdit.sim_iccid = this.selectedDevice['sim_iccid'];
      this.pageModel.deviceDetailEdit.productid = this.editProductSelected["productid"];
      this.pageModel.deviceDetailEdit.sim_imsi = this.selectedDevice['sim_imsi'];
      this.pageModel.deviceDetailEdit.sim_tel = this.selectedDevice['sim_tel'];
      this.pageModel.deviceDetailEdit.userid = this.editUserSelected['userid'];
      this.pageModel.deviceDetailEdit.encryptedkey = this.selectedDevice['encryptedkey'];
      this.pageModel.deviceDetailEdit.encryptedcommunications = this.selectedDevice['sslChecked'] == false ? 0 : 1;
      this.pageModel.deviceDetailEdit.connectserverurl = this.selectedDevice['connectserverurl'];
      this.pageModel.deviceDetailEdit.connectserverport = this.selectedDevice['connectserverport'];
      this.pageModel.deviceDetailEdit.bindingflag = this.selectedDevice['bindingflagChecked'] == false ? 0 : 1;
      this.pageModel.deviceDetailEdit.fmlastestversion = this.selectedDevice['fmlastestversion'];
      this.pageModel.deviceDetailEdit.versioncomfirmtime = this.selectedDevice['versioncomfirmtime'];
      var param = {
        "deviceDetail": this.pageModel.deviceDetailEdit
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
            for (var prop in this.pageModel.deviceDetailEdit) {
              if (this.pageModel.deviceDetailEdit.hasOwnProperty(prop)) {
                this.pageModel.deviceDetailEdit[prop] = '';
              }
            }
          } else if (item.resultCode == "0002") {
            alert('権限なし');
          } else if (item.resultCode == "0101") {
            alert('更新失敗しました。');
          } else if (item.resultCode == "0003") {
            this.setFocus(item.resultCode, editForm)
            alert(item.resultMsg);
          } else {
            alert('更新失敗しました。');
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
  registerDevices(addExeclForm: NgForm, registerdevicesForm: ElementRef) {
      var param = {
        "deviceDetailList": this.pageModel.addDeviceDetailList
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
            this.addsModal.close(addExeclForm.resetForm);
          }
        } else if (item.resultCode == "0002") {
          alert(item.resultMsg);
          this.pageModel.addDeviceDetailList = JSON.parse(item.data);
        } else if (item.resultCode == "0003") {
          alert(item.resultMsg + " エラーデータを参考して添付ファイルを修正ください。");
          // this.pageModel.checkColumn[item.resultMsg] = true;
          this.pageModel.addDeviceDetailList = JSON.parse(item.data);
          // this.setUnavailable("deviceSubmit", registerdevicesForm)
        } else if (item.resultCode == "0007") {
          alert(item.resultMsg);
          this.pageModel.addDeviceDetailList = JSON.parse(item.data);
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
        var param = {
          "deviceid": row.deviceid
        }
        this.httpService.useRpDelete('deleteDevice', param).then(item => {
          try {
            if (item.resultCode == "0000") {
              this.Init();
              // $("#addinfo").hide();
              // $('.modal-backdrop').remove();
              alert('デバイスを削除しました');
            } else {
              alert('権限なし');
            }
          } catch (e) {
            console.log(e);
          }
        }
        );
      
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
        var param = {
          "deviceidlist": removedIndex
        }
        this.httpService.useRpDelete('deleteDevices', param).then(item => {
          try {
            if (item.resultCode == "0000") {
              alert('選択したデバイスを削除しました');
              this.Init();
            } else {
              alert('権限なし');
            }
          } catch (e) {
            console.log(e);
          }
        }
        );
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
    this.OpenFileName = file.name;
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
      // fileInput.nativeElement.value = '';

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
    this.pageModel.sort.devicenameUp = false;
    this.pageModel.sort.devicenameDown = false;
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
      case 'devicename':
        if (this.sortOn == 1) {
          this.pageModel.sort.devicenameUp = true
        } else {
          this.pageModel.sort.devicenameDown = true
        }
        break;
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

  // setUnavailable(name, templateForm: ElementRef) {
  //   const ctrls = Object.keys(templateForm);
  //   for (let key = 0; key < ctrls.length; key++) {
  //     var keystr = key.toString();
  //     if (keystr == ctrls[key]) {
  //       if (templateForm[key].name == name) {
  //         const control = templateForm[key];
  //         control.ariaDisabled=true;
  //       }
  //     }
  //   }
  // }

  /**
* Remove overlay when open sidebar
*
* @param NgForm    Content overlay
*/
  cancleModel(openForm: NgForm) {
    if (this.addModal != null) {
        openForm.reset();
        this.addModal.close(openForm.resetForm);
        this.addModal=null;
    }
    if (this.editModal != null) {
        openForm.reset();
        this.editModal.close(openForm.resetForm);
        this.editModal=null;
    }
    if (this.addsModal != null) {
        openForm.reset();
        this.addsModal.close(openForm.resetForm);
        this.addsModal=null;
    }


    // @ViewChild('registerForm') registerForm: ElementRef;
    // @ViewChild('editForm') editForm: ElementRef;
    // @ViewChild('registerdevicesForm') registerdevicesForm: ElementRef;
    // @ViewChild('registerDeviceForm') registerDeviceForm: NgForm;
    
    this.registerForm=null
    this.editForm=null
    this.registerdevicesForm=null

    this.registerDeviceForm=null



  }
}
