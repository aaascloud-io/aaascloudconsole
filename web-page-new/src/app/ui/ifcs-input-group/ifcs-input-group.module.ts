import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IfcsInputGroupComponent} from "./ifcs-input-group.component";
import {FormsModule} from "@angular/forms";
import {IfcsInputModule} from "../ifcs-input/ifcs-input.module";


@NgModule({
    declarations: [IfcsInputGroupComponent],
    imports: [CommonModule, FormsModule, IfcsInputModule],
    exports: [IfcsInputGroupComponent],
})
export class IfcsInputGroupModule {
}
