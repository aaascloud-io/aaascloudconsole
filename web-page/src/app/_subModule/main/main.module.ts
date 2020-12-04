import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MainRoutingModule } from './main-routing.module';
import { SideBarComponent } from './side-bar/side-bar.component';
import { MainComponent } from './main.component';


@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
    FormsModule
  ],
  declarations: [SideBarComponent, MainComponent]

})
export class MainModule { }
