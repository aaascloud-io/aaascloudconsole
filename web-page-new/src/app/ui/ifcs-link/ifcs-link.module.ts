import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IfcsLinkComponent} from "./ifcs-link.component";
import {RouterModule} from "@angular/router";


@NgModule({
    declarations: [IfcsLinkComponent],
    imports: [CommonModule, RouterModule],
    exports: [IfcsLinkComponent],
})
export class IfcsLinkModule {
}
