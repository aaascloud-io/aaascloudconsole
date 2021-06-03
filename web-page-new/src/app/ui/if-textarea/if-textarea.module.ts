import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IfTextareaComponent} from "./if-textarea.component";
import {FormsModule} from "@angular/forms";


@NgModule({
    declarations: [IfTextareaComponent],
    imports: [CommonModule, FormsModule],
    exports: [IfTextareaComponent],
})
export class IfTextareaModule {
}
