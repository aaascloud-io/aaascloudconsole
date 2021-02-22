import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { UserRoutingModule } from './user-routing.module';

import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BreadcrumbModule } from 'src/app/_layout/breadcrumb/breadcrumb.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    NgxDatatableModule,
    BreadcrumbModule,
    FormsModule,
    NgbModule,
    PerfectScrollbarModule,
    NgSelectModule,
    RouterModule.forChild([
      {
        path: '',
        component: UserComponent
      },
    ])
  ],
  declarations: [UserComponent],
  exports: [RouterModule]

})
export class UserModule { }
