import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectComponent } from './project.component';
import { RouterModule } from '@angular/router';
import { ShareModuleModule } from 'src/app/share-module/share-module.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [ProjectComponent],
  imports: [
    CommonModule,
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
