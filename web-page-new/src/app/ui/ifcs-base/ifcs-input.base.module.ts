import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IfcsInputBaseComponent} from "./ifcs-input.base.component";
import {FormsModule} from "@angular/forms";


@NgModule({
    declarations: [IfcsInputBaseComponent],
    imports: [CommonModule, FormsModule],
    exports: [IfcsInputBaseComponent],
})
export class IfcsInputBaseModule { }
