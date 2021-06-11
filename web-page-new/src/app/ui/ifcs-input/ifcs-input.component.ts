import {
    Component,
    forwardRef,
    Input,
    OnInit, Optional,
    Output, Self
} from '@angular/core';
import {
    ControlValueAccessor,
    NG_VALUE_ACCESSOR,
    NgControl
} from "@angular/forms";
import {IfcsInputBaseComponent} from "../ifcs-base/ifcs-input.base.component";

@Component({
    selector: 'ifcs-input',
    templateUrl: './ifcs-input.component.html',
    styleUrls: ['./ifcs-input.component.css'],
    // providers: [
    //     {
    //         provide: NG_VALUE_ACCESSOR,
    //         multi: true,
    //         useExisting: forwardRef(() => IfcsInputComponent),
    //     },
    // ],
})
export class IfcsInputComponent extends IfcsInputBaseComponent implements OnInit {

    /**
     * インプット種類（text）
     */
    @Input() type: string;

    // /**
    //  * Id
    //  */
    // @Input() iid: string;

    /**
     * ヒント
     */
    @Input() placeholder: string;

    /**
     * 長さ
     */
    @Input() maxlength: number;


    constructor(@Self() @Optional() public control: NgControl) {
        super(control);
    }

    ngOnInit(): void {
        let type = this.type;
        if (!type) {
            this.type = "text";
        }
        // console.log(this.type);
    }

}
