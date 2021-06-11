import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IfcsInputComponent} from "./ifcs-input.component";
import {FormsModule} from "@angular/forms";


@NgModule({
    declarations: [IfcsInputComponent],
    imports: [CommonModule, FormsModule],
    exports: [IfcsInputComponent],
})
export class IfcsInputModule { }
