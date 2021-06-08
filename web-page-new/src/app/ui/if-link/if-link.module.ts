import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IfLinkComponent} from "./if-link.component";
import {FormsModule} from "@angular/forms";


@NgModule({
    declarations: [IfLinkComponent],
    imports: [CommonModule, FormsModule],
    exports: [IfLinkComponent],
})
export class IfLinkModule {
}
