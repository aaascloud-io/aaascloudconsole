import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IfcsSelectComponent} from "./ifcs-select.component";
import {FormsModule} from "@angular/forms";


@NgModule({
    declarations: [IfcsSelectComponent],
    imports: [CommonModule, FormsModule],
    exports: [IfcsSelectComponent],
})
export class IfcsSelectModule {
}
