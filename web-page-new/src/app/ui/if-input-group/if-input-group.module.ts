import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IfInputGroupComponent} from "./if-input-group.component";
import {FormsModule} from "@angular/forms";
import {IfInputModule} from "../if-input/if-input.module";


@NgModule({
    declarations: [IfInputGroupComponent],
    imports: [CommonModule, FormsModule, IfInputModule],
    exports: [IfInputGroupComponent],
})
export class IfInputGroupModule {
}
