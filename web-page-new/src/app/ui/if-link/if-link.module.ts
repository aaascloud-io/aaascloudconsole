import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IfLinkComponent} from "./if-link.component";
import {RouterModule} from "@angular/router";


@NgModule({
    declarations: [IfLinkComponent],
    imports: [CommonModule, RouterModule],
    exports: [IfLinkComponent],
})
export class IfLinkModule {
}
