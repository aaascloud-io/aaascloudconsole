import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IfcsTextareaComponent} from "./ifcs-textarea.component";
import {FormsModule} from "@angular/forms";


@NgModule({
    declarations: [IfcsTextareaComponent],
    imports: [CommonModule, FormsModule],
    exports: [IfcsTextareaComponent],
})
export class IfcsTextareaModule {
}
