import {Component, Input, OnInit} from '@angular/core';
import {IfcsLinkComponent} from "../ifcs-link/ifcs-link.component";

@Component({
    selector: 'ifcs-badge',
    templateUrl: './ifcs-badge.component.html',
    styleUrls: ['./ifcs-badge.component.css']
})
export class IfcsBadgeComponent extends IfcsLinkComponent {

    /**
     * ラベルスタイル
     */
    @Input() labelClass: string | string[] | Set<string> | { [klass: string]: any; }
    @Input() labelStyle: string;

    @Input() tooltip: string;


    constructor() {
        super();
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

}
