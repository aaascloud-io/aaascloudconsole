import {Component, OnInit} from '@angular/core';
import {IfcsLinkComponent} from "../ifcs-link/ifcs-link.component";

@Component({
    selector: 'ifcs-badge',
    templateUrl: './ifcs-badge.component.html',
    styleUrls: ['./ifcs-badge.component.css']
})
export class IfcsBadgeComponent extends IfcsLinkComponent {

    constructor() {
        super();
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

}
