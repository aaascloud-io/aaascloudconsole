import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IfInputBaseComponent} from "./if-input.base.component";
import {FormsModule} from "@angular/forms";


@NgModule({
    declarations: [IfInputBaseComponent],
    imports: [CommonModule, FormsModule],
    exports: [IfInputBaseComponent],
})
export class IfInputBaseModule { }
