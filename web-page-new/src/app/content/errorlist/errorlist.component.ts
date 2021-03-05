import { Component, OnInit, ViewChild, EventEmitter, Output, Renderer2 } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { HttpService } from 'src/app/_services/HttpService';
import { HttpClient } from '@angular/common/http';
import { DataFatoryService } from 'src/app/_services/DataFatoryService';
import { RouteIdIF } from 'src/app/_common/_Interface/RouteIdIF';
import { UserInfo } from 'src/app/_common/_Interface/UserInfo';

@Component({
  selector: 'app-errorlist',
  templateUrl: './errorlist.component.html',
  styleUrls: ['./errorlist.component.css']
})
export class ErrorlistComponent implements OnInit {

  //　errorlist 
  rows: any[] = [];
  tableDisplayData:any;
  collectionSize: any;
  page = 1;
  pageSize =10;
  selectedErrorItem:any;
  editModal = null;
  contactFlag: boolean;


  public config: PerfectScrollbarConfigInterface = { };

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
    private _httpClient: HttpClient,
    private httpService: HttpService,
    private dataFatoryService: DataFatoryService,
    ) { 
    }

    protected pageModel = {
      loginInfo:{},
      targetUserInfo:{},
    }
    /**
     * OnInit
     */
  ngOnInit() {
    let item: RouteIdIF = this.dataFatoryService.getRouteIdIF();
    this.pageModel.loginInfo = {
        "loginuserid": item.uid,
        "loginusername": item.login_id,
        "loginrole": item.role,
        "logincompanyid": item.company,
      },
    this.pageModel.targetUserInfo = {
      "targetuserid": item.uid,
      "targetuserCompanyid": item.company,
    };

    this.initData();
  }

  // errorlist データ取得
  async initData(){
    var param = {
      "loginInfo":this.pageModel.loginInfo,
      "targetUserInfo":this.pageModel.targetUserInfo,
      "username": this.pageModel.loginInfo["loginusername"],
    };
    this.rows = [];
    var res = await this.httpService.post("/getErrlogList",param);
    let jsonItem = typeof res.data == 'string' ? JSON.parse(res.data) : res.data;
    jsonItem.forEach(element => {
      this.rows.push(element);
    });
    this.rows = [...this.rows];
    this.getTabledata();
  }

  getTabledata() {
    this.tableDisplayData = this.rows;
    // 获取当前页码
    this.collectionSize = this.tableDisplayData.length;
    // 每个元素添加了 isSelected 属性
    this.tableDisplayData.forEach(x => x.isSelected = false)
    // this.tableDisplayData = this.PaginationData();
  }
  /**
 * Pagination table
 */
  get PaginationData() {
    if (this.tableDisplayData) {
      return this.tableDisplayData.map((tabledisplaydata, i) => ({ projectid: i + 1, ...tabledisplaydata }))
        .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    }
  }

  editTableDataModal(editTableDataModalContent, row) {
    // 把选中的 row 对象内的东西全部给全局变量 selectedErrorItem
    this.selectedErrorItem = Object.assign({},row);
    // 打开模态框
    this.editModal = this.modal.open(editTableDataModalContent, {
      windowClass: 'animated fadeInDown'
    });
    this.contactFlag = false;
  }




  /**
   * Add new contact
   *
   * @param addTableDataModalContent      Id of the add contact modal;
   */
  // addTableDataModal(addTableDataModalContent) {
  //   this.addModal = this.modal.open(addTableDataModalContent, {
  //     windowClass: 'animated fadeInDown'
  //   });
  //   this.contactFlag = true;
  // }

  /**
   * Edit selected contact row.
   *
   * @param editTableDataModalContent     Id of the edit contact model.
   * @param row     The row which needs to be edited.
   */
  // editTableDataModal(editTableDataModalContent, row) {
  //   console.log("模态框导入row");
  //   console.log(row);
  //   this.pageModel.selectedData = Object.assign({},row)
  //   console.log("模态框导入selectedData");
  //   console.log(this.pageModel.selectedData);
  //   this.editModal = this.modal.open(editTableDataModalContent, {
  //     windowClass: 'animated fadeInDown'
  //   });
  //   this.contactFlag = false;
  // }

  /**
   * Selected contact
   *
   * @param selected      Selected contact;
   */
  // onSelectContact({ selected }) {
  //   this.selected.splice(0, this.selected.length);
  //   this.selected.push(...selected);
  // }

  /**
   * Search contact from contact table
   *
   * @param event     Convert value uppercase to lowercase;
   */
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
   * Delete contact row
   * @param row     Selected row for delete contact
   */
  // deleteRow(row) {
  //   let index = 0;
  //   const temp = [...this.rows];
  //   for (const tempRow of temp) {
  //     if (tempRow.id === row.id) {
  //       temp.splice(index, 1);
  //       break;
  //     }
  //     index++;
  //   }
  //   this.rows = temp;
  // }

  /**
   * Update contact details
   *
   * @param editForm      Edit form for values check
   * @param id      Id match to the selected row Id
   */
  // onUpdate(editForm: NgForm, id) {
  //   for (const row of this.rows) {
  //     if (row.id === id && editForm.valid === true) {
  //       row.name = this.selectedContact['name'];
  //       row.email = this.selectedContact['email'];
  //       row.phone = this.selectedContact['phone'];
  //       this.editModal.close(editForm.resetForm);
  //       break;
  //     }
  //   }
  // }

  /**
   * Delete selected contact
   */
  // deleteCheckedRow() {
  //   let index = 0;
  //   const removedIndex = [];
  //   const temp = [...this.rows];
  //   for (const row of temp) {
  //     for (const selectedRow of this.selected) {
  //       if (row.id === selectedRow.id) {
  //         removedIndex.push(index);
  //       }
  //     }
  //     index++;
  //   }
  //   for (let i = removedIndex.length - 1; i >= 0; i--) {
  //     temp.splice(removedIndex[i], 1);
  //   }
  //   this.rows = temp;
  //   this.selected = [];
  // }

  /**
   * New contact add to the table
   *
   * @param addForm     Add contact form
   */
  // addNewContact(addForm: NgForm) {
  //   if (this.contactImage == null) {
  //     this.contactImage = '../../../assets/images/portrait/small/default.png';
  //   } else {
  //     this.contactImage = this.contactImage;
  //   }

  //   if (this.contactactive === undefined) {
  //     this.contactactive = 'away';
  //   } else {
  //     this.contactactive = this.contactactive;
  //   }
  //   if (addForm.valid === true) {
  //     this.rows.push(
  //       new Contact(
  //         this.rows.length + 1,
  //         this.contactName,
  //         this.contactEmail,
  //         this.contactPhone,
  //         this.contactImage,
  //         this.contactFavorite,
  //         this.contactactive
  //       )
  //     );
  //     this.rows = [...this.rows];
  //     addForm.reset();
  //     this.addModal.close(addForm.resetForm);
  //   }
  // }

  /**
   * Sidebar open/close in responsive
   *
   * @param event     Sidebar open/close
   */
  // sidebar(event) {
  //   const toggleIcon = document.getElementById('sidebar-left');
  //   const toggle = document.getElementById('content-overlay');
  //   if (event.currentTarget.className === 'sidebar-toggle d-block d-lg-none') {
  //     this._renderer.addClass(toggleIcon, 'show');
  //     this._renderer.addClass(toggle, 'show');
  //   }
  // }

  /**
   * Overlay add/remove fuction in responsive
   *
   * @param event     Overlay click event
   */
  // contentOverlay(event) {
  //   const toggleIcon = document.getElementById('sidebar-left');
  //   const toggle = document.getElementById('content-overlay');
  //   if (event.currentTarget.className === 'content-overlay show') {
  //     this._renderer.removeClass(toggleIcon, 'show');
  //     this._renderer.removeClass(toggle, 'show');
  //   }
  // }
}
