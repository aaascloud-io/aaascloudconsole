import {
    Component,
    Input,
    OnInit,
    Optional,
    Self
} from '@angular/core';
import {NgControl} from "@angular/forms";
import {IfcsInputBaseComponent} from "../ifcs-base/ifcs-input.base.component";

@Component({
    selector: 'ifcs-date',
    templateUrl: './ifcs-date.component.html',
    styleUrls: ['./ifcs-date.component.css'],
})
export class IfcsDateComponent extends IfcsInputBaseComponent implements OnInit {

    /**
     * Id
     */
    @Input() iid: string;

    // /**
    //  * ヒント
    //  */
    // @Input() placeholder: string;


    constructor(@Self() @Optional() public control: NgControl) {
        super(control);
    }

    ngOnInit(): void {
    }


}
