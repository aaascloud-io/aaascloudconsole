import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BreadcrumbModule } from 'src/app/_layout/breadcrumb/breadcrumb.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { ErrorlistComponent } from './errorlist.component';

import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';



@NgModule({
  imports: [
    CommonModule,
    NgxDatatableModule,
    BreadcrumbModule,
    FormsModule,
    NgbModule,
    PerfectScrollbarModule,
    RouterModule.forChild([
      {
        path: '',
        component: ErrorlistComponent
      }
    ]),
    ToastModule,
    ButtonModule,
    RippleModule,
  ],
  providers: [
    MessageService,
  ],
  declarations: [ErrorlistComponent],
  exports: [RouterModule],
})
export class ErrorlistModule { }
