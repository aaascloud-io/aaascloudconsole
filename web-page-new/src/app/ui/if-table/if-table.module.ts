import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IfTableComponent} from './if-table.component';
import {NgbPaginationModule} from "@ng-bootstrap/ng-bootstrap";
import {RouterModule} from "@angular/router";
import {UiSwitchModule} from "ngx-ui-switch";


@NgModule({
    declarations: [IfTableComponent],
    imports: [CommonModule, FormsModule, NgbPaginationModule, RouterModule, UiSwitchModule],
    exports: [FormsModule, IfTableComponent],
})
export class IfTableModule {
}
