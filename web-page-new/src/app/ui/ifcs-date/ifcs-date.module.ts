import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IfcsDateComponent} from "./ifcs-date.component";
import {FormsModule} from "@angular/forms";


@NgModule({
    declarations: [IfcsDateComponent],
    imports: [CommonModule, FormsModule],
    exports: [IfcsDateComponent],
})
export class IfcsDateModule { }
