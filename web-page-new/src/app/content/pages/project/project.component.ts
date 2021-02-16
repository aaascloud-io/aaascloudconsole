import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/_services/HttpService';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { NgForm, FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';

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

  public config: PerfectScrollbarConfigInterface = {};
  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective, { static: true }) directiveRef?: PerfectScrollbarDirective;
  newProjectForm: FormGroup;

  constructor(private httpService: HttpService, private _renderer: Renderer2) {}

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
  rows = [
    // {
    //   'type': 'danger', 'value': 85, 'product': 'iPhone X',
    //   'image': this.firstRow, 'buttonname': 'Mobile', 'amount': '$ 1200.00', 'bagde': '+8 more'
    // },
    // {
    //   'type': 'success', 'value': 75, 'product': 'iPad',
    //   'image': this.secondRow, 'buttonname': 'Teblet', 'amount': '$ 1190.00', 'bagde': '+5 more'
    // },
    // {
    //   'type': 'danger', 'value': 65, 'product': 'OnePlus',
    //   'image': this.thirdRow, 'buttonname': 'Mobile', 'amount': '$ 999.00', 'bagde': '+3 more'
    // },
    // {
    //   'type': 'success', 'value': 55, 'product': 'ZenPad',
    //   'image': this.fourthRow, 'buttonname': 'Teblet', 'amount': '$ 1150.00'
    // },
    // {
    //   'type': 'danger', 'value': 45, 'product': 'Pixel 2',
    //   'image': this.fifthRow, 'buttonname': 'Mobile', 'amount': '$ 1180.00'
    // }
  ];

  ngOnInit(): void {
    this.initData();
  }

  async initData() {
    this.editingItem = {};
    // TODO userdata
    var param = {
      "loginInfo": {
        "loginuserid": 12
      },
      "targetUserInfo": {
        "targetuserid": 12
      }
    };
    var res = await this.httpService.post("/getProjects", param);
    if (res.status == 200 && res.resultCode == "0000"){
      this.rows = res.data;
    }
  }

  addPageSlideIn(event): void {
    const toggleIcon = document.getElementById('new-project-sidebar');
    if (event.currentTarget.className === 'btn btn-sm btn-danger box-shadow-2 round btn-min-width pull-right font-color-white') {
      this._renderer.addClass(toggleIcon, 'show');
    } 
  }

  setEditingItem(item: any): void{
    this.editingItem.projectid = item.projectid;
    this.editingItem.projectname = item.projectname;
    this.editingItem.productid = item.productid;
    this.editingItem.projectsummary = item.projectsummary;
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

}
