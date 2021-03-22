import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { UserRoutingModule } from './user-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BreadcrumbModule } from 'src/app/_layout/breadcrumb/breadcrumb.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { UiSwitchModule } from 'ngx-ui-switch';

import { TreeTableModule } from 'primeng/treetable';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { ContextMenuModule } from 'primeng/contextmenu';

import { ToastModule } from 'primeng/toast'; // 右角のERRメッセージ
import { MessageService } from 'primeng/api'; // 右角のERRメッセージ
import { ButtonModule } from 'primeng/button';  // primgng ボタン様式
import { RippleModule } from 'primeng/ripple'; // primgng ボタンの水様式
import { ConfirmDialogModule } from 'primeng/confirmdialog'; // confirm ダイアログ
import { ConfirmationService } from 'primeng/api'; // confirm ダイアログ 

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    NgxDatatableModule,
    BreadcrumbModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    PerfectScrollbarModule,
    NgSelectModule,
    UiSwitchModule,
    TreeTableModule,
    ToastModule,
    DialogModule,
    ButtonModule,
    MultiSelectModule,
    InputTextModule,
    ContextMenuModule,
    RouterModule.forChild([
      {
        path: '',
        component: UserComponent
      },
    ]),
    ToastModule,
    ButtonModule,
    RippleModule,
    ConfirmDialogModule,
  ],
  providers: [
    MessageService,
    ConfirmationService,
  ],
  declarations: [UserComponent],
  exports: [RouterModule]

})
export class UserModule { }
