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

class Contact {
  constructor(
    public groupid: any,
    public groupname: string,
    public projectid: any,
    public projectname: string,
    public summary: string,
    public devicecount: any,
  ) { }
}
const formInputData = require('../../../assets/data/forms/form-elements/form-inputs.json');
const selectData = require('../../../assets/data/forms/form-elements/select.json');

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  userInfo: UserInfo;

  columns: any = [];

  contactFavorite: boolean;
  contactactive: string;
  rows: any[] = [];
  selectedContact: any;
  groupDeviceSelected: any;
  contactFlag: boolean;
  addContact: any;
  placement = 'bottom-right';
  addModal = null;
  updateModal = null;
  addDeviceModal = null;
  deleteDeviceModal = null;
  deviceInfoModal = null;
  loadingIndicator: true;
  selected = [];
  temp = [];
  temp2 = this.rows;
  singlebasicSelected: any;
  groupSelected = false;
  projects = [];
  show = false;

  public config: PerfectScrollbarConfigInterface = {};
  multipleMultiSelect: any;
  public multipleSelectArray = formInputData.multipleSelectArray;
  public singleSelectArray = selectData.singleSelectArray;

  pageSize: any;
  collectionSize: any;
  groupList: any;
  // deviceList: any;
  addDeviceList: any;
  groupDeviceList: any;
  page = 1;
  TableData: any;
  sortOn: any;
  checkOn: 1;

  pageModel = {
    USERCODE: null,
    addList: [],
    dataAll: [],
    addGroup: {
      projectid: null,
      groupname: '',
      summary: ''
    },
    updataGroup: {
      projectid: null,
      groupname: '',
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
      projectname: '',
      groupname: '',
    },

    devices: [],
    groups: [],
    projects: [],
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
    this.getProjects();
    this.searchGroups();
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
   * グループデーターを削除する(単一)
   * @param row     Selected row for delete contact
   */
  deleteRow(row) {
    if (confirm("削除してもよろしいでしょうか")) {
      var query = {
        "loginInfo": this.pageModel.loginUser,
        "targetUserInfo": {
          "targetuserid": this.pageModel.loginUser.loginuserid,
        },
        "groupid": row.groupid,
      }
      this.httpService.delete('deleteGroup', query).then(item => {
        try {
          if (item.body.resultCode === "0000") {

            this.searchGroups();
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
   * 選択されたグループデーターを削除する（複数）
   */
  deleteCheckedRow() {
    var deleteCheckedids = [];
    var flg = false;
    for (var row of this.rows) {
      if (row.isSelected) {
        deleteCheckedids.push(row.groupid);
        flg = true;
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
        "groupidList": deleteCheckedids,
      }
      this.httpService.delete('deleteGroups', query).then(item => {
        try {
          if (item.body.resultCode === "0000") {
            this.searchGroups();
            alert('削除成功です。');
            this.groupSelected = false;
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
   * グループ情報を更新する
   *
   * @param editForm      Edit form for values check
   * @param id      Id match to the selected row Id
   */
  onUpdate(editForm: NgForm) {
    var query = {
      "loginInfo": {
        "loginuserid": this.pageModel.loginUser.loginuserid,
        "logincompanyid": this.pageModel.loginUser.logincompanyid
      },
      "targetUserInfo": {
        "targetuserid": this.pageModel.loginUser.loginuserid,
      },

      "projectid": this.selectedContact.projectid,
      "groupid": this.selectedContact.groupid,
      "groupname": this.selectedContact.groupname,
      "summary": this.selectedContact.summary
    }

    this.httpService.usePost('updateGroup', query).then(item => {
      try {
        console.log('更新成功です。');
        console.log(item);
        alert('更新成功です。');
        this.searchGroups();
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
    var projectid = this.pageModel.addGroup.projectid;
    var groupname = this.pageModel.addGroup.groupname;
    var flg = true;

    if (flg && !projectid) {
      confirm(`プロジェクを指定してください。`);
      flg = false;
    }

    if (flg && !groupname) {
      confirm(`グループ名を入力してください。`);
      flg = false;
    }

    if (flg) {
      var query = {
        "loginInfo": this.pageModel.userInfoParame,
        "targetUserInfo": {
          "targetuserid": this.pageModel.loginUser.loginuserid,
        },

        "projectid": this.pageModel.addGroup.projectid,
        "groupname": this.pageModel.addGroup.groupname,
        "summary": this.pageModel.addGroup.summary
      }

      this.httpService.useRpPost('registerGroup', query).then(item => {
        try {
          if (item.resultCode === "0000") {
            console.log('登録成功です。');
            console.log(item);
            if (editForm.valid === true) {
              editForm.reset();
              this.addModal.close(editForm.resetForm);
            }
            alert('登録成功です。');
            this.searchGroups();
          }
        } catch (e) {
          console.log('登録失敗です。');
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
  * グループの条件より、取得する
  */
  async searchGroups() {

    var query = {
      "loginInfo": this.pageModel.loginUser,
      "targetUserInfo": {
        "targetuserid": this.pageModel.loginUser.loginuserid,
      },
      "projectname": this.pageModel.query.projectname,
      "groupname": this.pageModel.query.groupname,

    };

    this.httpService.usePost('searchGroups', query).then(item => {
      try {
        this.rows = [];
        console.log("グループデーターの取得：");
        console.log(JSON.stringify(item));
        if (item) {
          item.forEach((elem) => {
            console.log(elem);
            var projectname = ""
            // プロダクトタイプ名の検索
            for (const project of this.projects) {
              if (project.projectid === elem.projectid) {
                projectname = project.projectname;
              }
            }
            this.rows.push(new Contact(
              elem.groupid,
              elem.groupname,
              elem.projectid,
              projectname,
              elem.summary,
              elem.groupDeviceCounts,
            ));
          });
          this.rows = [...this.rows];
          this.getTabledata();
        } else {
          console.log("グループ取得：0件です。");
        }

      } catch (e) {
        console.log('ユーザー数数を検索API エラー　発生しました。');
      }
    });
  }

  /**
 * プロジェクト一覧取得
 */
  protected async getProjects() {
    var query = {
      "loginInfo": this.pageModel.loginUser,
      "targetUserInfo": {
        "targetuserid": this.pageModel.loginUser.loginuserid,
      },
    };
    this.httpService.usePost('getProjects', query).then(item => {
      try {
        if (item) {
          this.projects = item;
          console.log(item);
          console.log("すべてのプロジェクトの取得は成功しました。");
        } else {
          console.log("すべてのプロジェクトの取得は0件。");
        }
      } catch (e) {
        console.log("すべてのプロジェクトの取得は失敗しました。");
      }
    });
  }

  sortData(nm) {
    if (this.sortOn == 1) {
      this.groupList.sort((b, a) => a[nm].localeCompare(b[nm]));
      this.sortOn = 2;
    } else {
      this.groupList.sort((a, b) => a[nm].localeCompare(b[nm]));
      this.sortOn = 1;
    }
  }

  checkAll(ev) {
    this.groupList.forEach(x => x.isSelected = ev.target.checked)
    this.groupSelected = ev.target.checked;
  }

  checkChange(ev, selected) {
    this.groupList.forEach(function (group) {
      if (group.groupid === selected['groupid']) { group.isSelected = ev.target.checked }
    });
  }

  isAllChecked() {
  }

  getTabledata() {
    this.groupList = this.rows;
    this.collectionSize = this.groupList.length;
    this.groupList.forEach(x => x.isSelected = false)
    this.groupList();
  }

  /**
* Pagination table
*/
  get PaginationData() {
    if (this.groupList) {
      return this.groupList.map((person, i) => ({ groupid: i + 1, ...person }))
        .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    }
  }

  /**
   * 取消ボタンを押下 
   * 
   */
  cancleModel(openForm: NgForm) {

    // 新規ダイアログを閉じる
    if (this.addModal != null) {
      openForm.reset();
      this.addModal.close(openForm.resetForm);
    }
    // 編集ダイアログを閉じる
    if (this.updateModal != null) {
      this.updateModal.close(openForm.resetForm);
    }
    // デバイス追加ダイアログを閉じる
    if (this.addDeviceModal != null) {
      this.addDeviceModal.close(openForm.resetForm);
    }
    // デバイス削除ダイアログを閉じる
    if (this.deleteDeviceModal != null) {
      this.deleteDeviceModal.close(openForm.resetForm);
    }
    // デバイス詳細ダイアログを閉じる
    if (this.deviceInfoModal != null) {
      this.deviceInfoModal.close(openForm.resetForm);
    }

    // }
  }

  /*=======================グループのデバイス追加連携↓================================*/
  /**
 * デバイス追加のダイアログを開ける
 * @param deviceLinkAddModalContent 
 * @param row 
 */
  deviceLinkAddModal(deviceLinkAddModalContent, row) {
    this.getUsableDeviceList();
    this.groupDeviceSelected = Object.assign({}, row);
    this.addDeviceModal = this.modal.open(deviceLinkAddModalContent, {
      windowClass: 'animated fadeInDown',
      size: 'lg'
    });
  }

  /**
   * グループのデバイス一覧（追加）
   */
  protected async getUsableDeviceList() {
    var query = {
      "loginInfo": this.pageModel.loginUser,
      "targetUserInfo": {
        "targetuserid": this.pageModel.loginUser.loginuserid,
        "targetuserCompanyid": this.pageModel.loginUser.logincompanyid,
      },
    };
    this.httpService.usePost("/getMySelectableDevices", query).then(item => {
      try {
        this.addDeviceList = item;
        console.log("デバイス連携一覧取得");
        console.log(JSON.stringify(item));

      } catch (e) {
        console.log();
      }
    });
  }

  checkAllUsableDevice(ev) {
    this.addDeviceList.forEach(x => x.isSelected = ev.target.checked)
  }

  checkChangeUsableDevice(ev, element) {
    this.addDeviceList.forEach(function (device) {
      if (device.deviceid === element['deviceid']) { device.isSelected = ev.target.checked }
    });
  }

  /**
   * グループにデバイスを追加する
   */
  groupDeviceDataUpdate(groupDeviceForm) {

    var deleteCheckedids = [];
    var flg = false;
    var selectedDevice = [];
    for (var item of this.addDeviceList) {
      if (item.isSelected) {
        selectedDevice.push(item);
        flg = true;
      }
    }
    if (!flg) {
      alert("プロダクトを選択してください");
      return
    }
    if (confirm("選択したデバイスをプロジェクトに連携しますか")) {

      var query = {
        "loginInfo": this.pageModel.loginUser,
        "targetUserInfo": {
          "targetuserid": this.pageModel.loginUser.loginuserid,
          "targetuserCompanyid": this.pageModel.loginUser.logincompanyid,
        },
        "groupid": this.groupDeviceSelected.groupid,
        "projectid": this.groupDeviceSelected.projectid,
        "deviceList": selectedDevice,
      };

      this.httpService.useRpPut('addGroupDevices', query).then(item => {
        try {
          if (item.resultCode == "0000") {
            alert('選択したデバイスを追加しました。');
            if (groupDeviceForm.valid === true) {
              groupDeviceForm.reset();
              this.addDeviceModal.close(groupDeviceForm.resetForm);
            }
          }
          this.ngOnInit();
        } catch (e) {
          console.log(e);
          this.ngOnInit();
        };
      });
    }

    this.ngOnInit();
  }

  /*=======================グループのデバイス削除連携↓================================*/
  /**
 * デバイス削除のダイアログを開ける
 * @param deviceLinkDeleteModalContent 
 * @param row 
 */
  deviceLinkdeletModal(deviceLinkDeleteModalContent, row) {
    this.getMyGroupDeviceList(row);
    this.groupDeviceSelected = Object.assign({}, row);
    this.deleteDeviceModal = this.modal.open(deviceLinkDeleteModalContent, {
      windowClass: 'animated fadeInDown',
      size: 'lg'
    });
  }

  /**
   * グループのデバイス一覧（削除）
   */
  protected async getMyGroupDeviceList(row) {
    var query = {
      "loginInfo": this.pageModel.loginUser,
      "targetUserInfo": {
        "targetuserid": this.pageModel.loginUser.loginuserid,
        "targetuserCompanyid": this.pageModel.loginUser.logincompanyid,
      },
      "groupid": row.groupid,
      "projectid": row.projectid,
    };
    this.httpService.usePost("/getGroupDevices", query).then(item => {
      try {
        this.groupDeviceList = item;
        console.log("デバイス削除連携一覧取得");
        console.log(JSON.stringify(item));

      } catch (e) {
        console.log();
      }
    });
  }

  checkAllGroupDevice(ev) {
    this.groupDeviceList.forEach(x => x.isSelected = ev.target.checked)
  }

  checkChangeGroupDevice(ev, element) {
    this.groupDeviceList.forEach(function (device) {
      if (device.deviceid === element['deviceid']) { device.isSelected = ev.target.checked }
    });
  }

  /**
   * グループのデバイスを削除する
   */
  groupLinkedDeviceDataUpdate(groupDeviceForm) {

    var flg = false;
    var selectedDevice = [];
    for (var item of this.groupDeviceList) {
      if (item.isSelected) {
        selectedDevice.push(item);
        flg = true;
      }
    }
    if (!flg) {
      alert("デバイスを選択してください");
      return
    }
    if (confirm("選択したデバイスをグループに追加しますか")) {

      var query = {
        "loginInfo": this.pageModel.loginUser,
        "targetUserInfo": {
          "targetuserid": this.pageModel.loginUser.loginuserid,
          "targetuserCompanyid": this.pageModel.loginUser.logincompanyid,
        },
        "groupid": this.groupDeviceSelected.groupid,
        "projectid": this.groupDeviceSelected.projectid,
        "deviceList": selectedDevice,
      };

      this.httpService.useRpPut('deleteGroupDevices', query).then(item => {
        try {
          if (item.resultCode == "0000") {
            alert('選択したデバイスを削除しました。');
            if (groupDeviceForm.valid === true) {
              groupDeviceForm.reset();
              this.deleteDeviceModal.close(groupDeviceForm.resetForm);
            }
          }
          this.ngOnInit();
        } catch (e) {
          console.log(e);
          this.ngOnInit();
        };
      });
    }

    this.ngOnInit();
  }

  /*=======================グループのデバイス詳細↓================================*/
  /**
 * デバイス削除のダイアログを開ける
 * @param deviceLinkDeleteModalContent 
 * @param row 
 */
  groupDeviceInfo(groupDeviceInfoModal, row) {
    this.getMyGroupDeviceList(row);
    this.groupDeviceSelected = Object.assign({}, row);
    this.deviceInfoModal = this.modal.open(groupDeviceInfoModal, {
      windowClass: 'animated fadeInDown',
      size: 'lg'
    });
  }

  getGroupDeviceInfo(openForm: NgForm) {
    if (this.deviceInfoModal != null) {
      this.deviceInfoModal.close(openForm.resetForm);
    }
  }
}
