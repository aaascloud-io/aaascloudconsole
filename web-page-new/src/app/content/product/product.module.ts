import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductComponent } from './product.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProductRoutingModule } from './product-routing.module';

import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BreadcrumbModule } from 'src/app/_layout/breadcrumb/breadcrumb.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { UiSwitchModule } from 'ngx-ui-switch';

import {ToastModule} from 'primeng/toast'; // 右角のERRメッセージ
import {MessageService} from 'primeng/api'; // 右角のERRメッセージ
import {ButtonModule} from 'primeng/button';  // primgng ボタン様式
import {RippleModule} from 'primeng/ripple'; // primgng ボタンの水様式
import {ConfirmDialogModule} from 'primeng/confirmdialog'; // confirm ダイアログ
import {ConfirmationService} from 'primeng/api'; // confirm ダイアログ 


@NgModule({
  imports: [
    CommonModule,
    ProductRoutingModule,
    NgxDatatableModule,
    BreadcrumbModule,
    FormsModule,
    NgbModule,
    PerfectScrollbarModule,
    NgSelectModule,
    UiSwitchModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProductComponent
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
  declarations: [ProductComponent],
  exports: [RouterModule]

})
export class ProductModule { }
