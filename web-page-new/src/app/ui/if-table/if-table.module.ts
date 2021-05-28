import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IfTableComponent} from './if-table.component';
import {NgbPaginationModule} from "@ng-bootstrap/ng-bootstrap";
import {RouterModule} from "@angular/router";
import {UiSwitchModule} from "ngx-ui-switch";
import {IfSupperLinkModule} from "../if-supper-link/if-supper-link.module";


@NgModule({
    declarations: [IfTableComponent],
    imports: [CommonModule, FormsModule, NgbPaginationModule, RouterModule, UiSwitchModule, IfSupperLinkModule],
    exports: [FormsModule, IfTableComponent],
})
export class IfTableModule {
}
