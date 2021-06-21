import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IfcsBadgeComponent} from "./ifcs-badge.component";
import {RouterModule} from "@angular/router";


@NgModule({
    declarations: [IfcsBadgeComponent],
    imports: [CommonModule, RouterModule],
    exports: [IfcsBadgeComponent],
})
export class IfcsBadgeModule {
}
