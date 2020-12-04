import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserManagerRoutingModule } from './user-manager-routing.module';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { DetailComponent } from './detail/detail.component';
import { ModifyComponent } from './modify/modify.component';
import { FormsModule } from '@angular/forms';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { PageModule } from 'src/app/_subModule/main/page/page.module';
import { BlockUIModule } from 'ng-block-ui';

@NgModule({
  imports: [
    CommonModule,
    UserManagerRoutingModule,
    FormsModule,
    FlashMessagesModule.forRoot(),
    PageModule,
    BlockUIModule.forRoot(),
  ],
  declarations: [ListComponent, CreateComponent, DetailComponent, ModifyComponent]
})
export class UserManagerModule { }
