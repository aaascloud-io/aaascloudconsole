import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IfDateComponent} from "./if-date.component";
import {FormsModule} from "@angular/forms";


@NgModule({
    declarations: [IfDateComponent],
    imports: [CommonModule, FormsModule],
    exports: [IfDateComponent],
})
export class IfDateModule { }
