import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VersionComponent } from './version.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BreadcrumbModule } from 'src/app/_layout/breadcrumb/breadcrumb.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import {ToastModule} from 'primeng/toast';  
import {MessageService} from 'primeng/api';  
import {ButtonModule} from 'primeng/button';  
import {RippleModule} from 'primeng/ripple';  
import {ConfirmDialogModule} from 'primeng/confirmdialog';  
import {ConfirmationService} from 'primeng/api';  


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
        component: VersionComponent
      }
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
  declarations: [VersionComponent],
  exports: [RouterModule]
})
export class VersionModule { }
