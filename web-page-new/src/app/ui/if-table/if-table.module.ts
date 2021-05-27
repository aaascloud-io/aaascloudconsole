import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IfTableComponent} from './if-table.component';
import {NgbPaginationModule} from "@ng-bootstrap/ng-bootstrap";
import {RouterModule} from "@angular/router";


@NgModule({
    declarations: [IfTableComponent],
    imports: [CommonModule, FormsModule, NgbPaginationModule, RouterModule],
    exports: [FormsModule, IfTableComponent],
})
export class IfTableModule {
}
