import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectComponent } from './project.component';
import { RouterModule } from '@angular/router';
import { ShareModuleModule } from 'src/app/share-module/share-module.module';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';



@NgModule({
  declarations: [ProjectComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    NgxDatatableModule,
    PerfectScrollbarModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProjectComponent
      }
    ]),
    ShareModuleModule.forRoot(),
  ]
})
export class ProjectModule { }
