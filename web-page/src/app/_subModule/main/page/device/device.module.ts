import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DeviceRoutingModule } from './device-routing.module';
import { DeivceComponent } from './deivce.component';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { ModifyComponent } from './modify/modify.component';
import { DetailComponent } from './detail/detail.component';
import { CommandComponent } from './command/command.component';
import { ShowcommandComponent } from './command/showcommand/showcommand.component';
import { PageModule } from 'src/app/_subModule/main/page/page.module';
@NgModule({
  imports: [
    CommonModule,
    DeviceRoutingModule,
    FormsModule,
    PageModule,
  ],
  declarations: [DeivceComponent
    , ListComponent
    , CreateComponent
    , ModifyComponent
    , DetailComponent
    , CommandComponent
    , ShowcommandComponent]
})

export class DeviceModule { }
