import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IfInputComponent} from "./if-input.component";
import {FormsModule} from "@angular/forms";


@NgModule({
    declarations: [IfInputComponent],
    imports: [CommonModule, FormsModule],
    exports: [IfInputComponent],
})
export class IfInputModule { }
