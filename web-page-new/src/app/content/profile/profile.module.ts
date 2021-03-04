import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProfileComponent} from './profile.component';
import { RouterModule } from '@angular/router';
// import { ProfileRoutingModule } from './profile-routing.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProfileComponent
      },
    ])
  ],
  declarations: [ProfileComponent],
  exports: [RouterModule]
})
export class ProfileModule { }
