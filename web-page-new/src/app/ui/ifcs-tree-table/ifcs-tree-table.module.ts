import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IfcsTreeTableComponent} from "./ifcs-tree-table.component";
import {RouterModule} from "@angular/router";
import {TreeTableModule} from "primeng/treetable";
import { IfcsTreeTableTogglerCustomizedComponent } from './ifcs-tree-table-toggler-customized/ifcs-tree-table-toggler-customized.component';


@NgModule({
    declarations: [IfcsTreeTableComponent, IfcsTreeTableTogglerCustomizedComponent],
    imports: [CommonModule, RouterModule, TreeTableModule],
    exports: [IfcsTreeTableComponent],
})
export class IfcsTreeTableModule {
}
