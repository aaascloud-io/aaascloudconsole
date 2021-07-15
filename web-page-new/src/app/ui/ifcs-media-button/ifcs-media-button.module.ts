import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IfcsMediaButtonComponent} from "./ifcs-media-button.component";
import {RouterModule} from "@angular/router";


@NgModule({
    declarations: [IfcsMediaButtonComponent],
    imports: [CommonModule, RouterModule],
    exports: [IfcsMediaButtonComponent],
})
export class IfcsMediaButtonModule {
}
