import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/_services/HttpService';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgForm, FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { DataFatoryService } from 'src/app/_services/DataFatoryService';
import { RouteIdIF } from 'src/app/_common/_Interface/RouteIdIF';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  page = {
    title: "プロジェクト管理"
  };
  editingItem: any = {};
  selectedItem:any;
  editModal:any;
  contactFlag:boolean;
  selectedContact: any;
  selected = [];


  protected pageModel = {
    USERCODE:null,
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
    userInfoParame: {}
  };
  rows: any[] = [];
  productTypes = [];
  public config: PerfectScrollbarConfigInterface = { };

  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective) directiveRef?: PerfectScrollbarDirective;
  newProjectForm: FormGroup;
  @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;

  constructor(private httpService: HttpService, 
    private _renderer: Renderer2,
    private dataFatoryService: DataFatoryService,
    private modal: NgbModal,) {}

  // firstRow = ['../../../assets/images/portrait/small/avatar-s-4.png',
  //   '../../../assets/images/portrait/small/avatar-s-5.png',
  //   '../../../assets/images/portrait/small/avatar-s-6.png'];
  // secondRow = ['../../../assets/images/portrait/small/avatar-s-7.png',
  //   '../../../assets/images/portrait/small/avatar-s-8.png'];
  // thirdRow = ['../../../assets/images/portrait/small/avatar-s-1.png',
  //   '../../../assets/images/portrait/small/avatar-s-2.png',
  //   '../../../assets/images/portrait/small/avatar-s-3.png'];
  // fourthRow = ['../../../assets/images/portrait/small/avatar-s-11.png',
  //   '../../../assets/images/portrait/small/avatar-s-12.png'];
  // fifthRow = ['../../../assets/images/portrait/small/avatar-s-6.png',
  //   '../../../assets/images/portrait/small/avatar-s-4.png'];
  // rows = [
  //   {
  //     'type': 'danger', 'value': 85, 'product': 'iPhone X',
  //     'image': this.firstRow, 'buttonname': 'Mobile', 'amount': '$ 1200.00', 'bagde': '+8 more'
  //   },
  //   {
  //     'type': 'success', 'value': 75, 'product': 'iPad',
  //     'image': this.secondRow, 'buttonname': 'Teblet', 'amount': '$ 1190.00', 'bagde': '+5 more'
  //   },
  //   {
  //     'type': 'danger', 'value': 65, 'product': 'OnePlus',
  //     'image': this.thirdRow, 'buttonname': 'Mobile', 'amount': '$ 999.00', 'bagde': '+3 more'
  //   },
  //   {
  //     'type': 'success', 'value': 55, 'product': 'ZenPad',
  //     'image': this.fourthRow, 'buttonname': 'Teblet', 'amount': '$ 1150.00'
  //   },
  //   {
  //     'type': 'danger', 'value': 45, 'product': 'Pixel 2',
  //     'image': this.fifthRow, 'buttonname': 'Mobile', 'amount': '$ 1180.00'
  //   }
  // ];

  ngOnInit(): void {
    let item: RouteIdIF = this.dataFatoryService.getRouteIdIF();
    console.log("这里是project的item数据");
    console.log(item);
    this.pageModel.loginUser.loginuserid = item.uid;
    this.pageModel.loginUser.loginusername = item.login_id;
    this.pageModel.loginUser.loginrole = item.role;

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
    console.log("这里是project的pageModel数据");
    console.log(this.pageModel.userInfoParame);
    
    this.initData();
  }

  async initData() {
    this.editingItem = {};
    // TODO userdata

    var res = await this.httpService.post("/getProjects", this.pageModel.userInfoParame);
    console.log("这里是project的res数据");
    console.log(res);
    // if (res.status == 200 && res.resultCode == "0000"){
    //   this.rows = res.data;
    // }
    let jsonItem = typeof res.data == 'string' ? JSON.parse(res.data) : res.data;
    console.log("这是jsonItem的值");
    console.log(jsonItem);
    jsonItem.forEach(element => {
      this.rows.push(element);
    });
    console.log("这是rows的data值");
    console.log(this.rows);
    this.rows = [...this.rows];


    // this.httpService.useGet('getProjects').then(item => {
    //   try {
    //     if (item) {
    //       this.productTypes = item;
    //       console.log(item);
    //       console.log("プロダクトタイプの取得は成功しました。");
    //     } else {
    //       console.log("プロダクトタイプの取得は失敗しました。");
    //     }
    //   } catch (e) {
    //     console.log("プロダクトタイプの取得は失敗しました。");
    //   }
    // });


  }

  addPageSlideIn(addNewDataModalContent,event): void {
    // const toggleIcon = document.getElementById('new-project-sidebar');
    // if (event.currentTarget.className === 'btn btn-sm btn-danger box-shadow-2 round btn-min-width pull-right font-color-white') {
    //   this._renderer.addClass(toggleIcon, 'show');
    // }; 

    this.editModal = this.modal.open(addNewDataModalContent, {
      windowClass: 'animated fadeInDown'
    });
    
  }

  setEditingItem(editTableDataModalContent,row): void{
    console.log("setEditingItem 内传入的 row 值");
    console.log(row);
    this.selectedContact = Object.assign({}, row);
    // 把选中的 row 对象内的东西全部给全局变量 selectedErrorItem
    this.selectedItem = Object.assign({},row);
    // 打开模态框
    this.editModal = this.modal.open(editTableDataModalContent, {
      windowClass: 'animated fadeInDown'
    });
    this.contactFlag = false;
    
    // this.editingItem.projectid = item.projectid;
    // this.editingItem.projectname = item.projectname;
    // this.editingItem.productid = item.productid;
    // this.editingItem.projectsummary = item.projectsummary;
    
  }

  cancelEdit(): void {
    this.editingItem = {};
  }

  async update(): Promise<void> {
    // TODO userinfo
    var userinfo = {
      "loginInfo": {
        "loginuserid": 12
      },
      "targetUserInfo": {
        "targetuserid": 12
      },
      "userid": 12,
    };
    var param = Object.assign({}, userinfo, this.editingItem);
    try {
      var res = await this.httpService.put("/updateProject", param);
      if (res.status == 200 && res.resultCode == "0000") {
        // TODO alert success
      } else {
        // TODO alert fail
      }
    } catch (error) {
      // TODO alert system error
    }
    this.initData();
  }

  async deleteItem(id: number){
    // TODO alert to confirm
    // TODO userinfo 
    var param = {
      "loginInfo": {
        "loginuserid": 12
      },
      "targetUserInfo": {
        "targetuserid": 12
      },
      "projectid": id,
      "userid": 12,
    };
    try {
      var res = await this.httpService.delete("/deleteProject", param);
      if (res.status == 200 && res.resultCode == "0000") {
        // TODO alert success
      }else{
        // TODO alert fail
      }
    } catch (error) {
      // TODO alert system error
    }
    this.initData();
  }

  onSelectContact({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

}
