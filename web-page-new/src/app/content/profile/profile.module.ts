import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { RouterModule } from '@angular/router';
// import { ProfileRoutingModule } from './profile-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ToastModule} from 'primeng/toast';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {ConfirmDialogModule} from 'primeng/confirmdialog';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    ButtonModule,
    RippleModule,
    ConfirmDialogModule,
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
