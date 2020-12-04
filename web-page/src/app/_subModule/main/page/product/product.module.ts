import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product.component';
import { CreateComponent } from './create/create.component';
import { DetailComponent } from './detail/detail.component';
import { ListComponent } from './list/list.component';
import { ModifyComponent } from './modify/modify.component';
import { FormsModule } from '@angular/forms';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { PageModule } from 'src/app/_subModule/main/page/page.module';
import { BlockUIModule } from 'ng-block-ui';

@NgModule({
  imports: [
    CommonModule,
    ProductRoutingModule,
    FormsModule,
    FlashMessagesModule.forRoot(),
    PageModule,
    BlockUIModule.forRoot(),
  ],
  declarations: [ProductComponent, CreateComponent, DetailComponent, ListComponent, ModifyComponent]
})
export class ProductModule { }
