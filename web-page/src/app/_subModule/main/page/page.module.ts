import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageRoutingModule } from './page-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageComponent } from './page.component';
import { UserManagerComponent } from './user-manager/user-manager.component';
import { NextPageComponent } from './pagination/page.component';
import { VersionComponent } from './version/version.component';
@NgModule({
  imports: [
    CommonModule,
    PageRoutingModule,
    FormsModule,
  ],
  declarations: [DashboardComponent, PageComponent, UserManagerComponent, NextPageComponent, VersionComponent],
  exports: [NextPageComponent]
})
export class PageModule { }
