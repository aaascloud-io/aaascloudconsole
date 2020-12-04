import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuHandler } from '../../../_common/_constant/menu.handler';
import { menuIF } from '../../../_common/_interface/commonIF';
import { SubjectService } from '../../../_shareModule/service/SubjectService';
import { Subscription } from 'rxjs';
import * as $ from 'jquery';
@Component({
  selector: 'main-sidebar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit, OnDestroy {

  constructor(private subjectService: SubjectService) { }

  pageModel = {
    menuList: new Array<menuIF>()
  }
  private subscription: Subscription;

  ngOnInit() {
    this.pageModel.menuList = MenuHandler.MENU;

    this.subscription = this.subjectService.getMessage().subscribe(menuId => {
      if (menuId.type === 'menu') {
        this.pageModel.menuList.forEach(meu => {
          if (meu.path === menuId.path) {
            meu.active = true;
          } else {
            meu.active = false;
          }
        })
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    console.log('subscription canceled');
  }

}
