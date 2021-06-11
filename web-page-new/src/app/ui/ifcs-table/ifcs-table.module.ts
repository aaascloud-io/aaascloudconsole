import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IfcsTableComponent} from './ifcs-table.component';
import {NgbPaginationModule} from "@ng-bootstrap/ng-bootstrap";
import {RouterModule} from "@angular/router";
import {UiSwitchModule} from "ngx-ui-switch";
import {IfcsSupperLinkModule} from "../ifcs-supper-link/ifcs-supper-link.module";


@NgModule({
    declarations: [IfcsTableComponent],
    imports: [CommonModule, FormsModule, NgbPaginationModule, RouterModule, UiSwitchModule, IfcsSupperLinkModule],
    exports: [FormsModule, IfcsTableComponent],
})
export class IfcsTableModule {
}
