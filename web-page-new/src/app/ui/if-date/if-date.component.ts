import {
    Component,
    Input,
    OnInit,
    Optional,
    Self
} from '@angular/core';
import {NgControl} from "@angular/forms";
import {IfInputBaseComponent} from "../if-base/if-input.base.component";

@Component({
    selector: 'app-if-date',
    templateUrl: './if-date.component.html',
    styleUrls: ['./if-date.component.css'],
})
export class IfDateComponent extends IfInputBaseComponent implements OnInit {

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
