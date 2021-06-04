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
import {IfInputBaseComponent} from "../if-base/if-input.base.component";

@Component({
    selector: 'app-if-input',
    templateUrl: './if-input.component.html',
    styleUrls: ['./if-input.component.css'],
    // providers: [
    //     {
    //         provide: NG_VALUE_ACCESSOR,
    //         multi: true,
    //         useExisting: forwardRef(() => IfInputComponent),
    //     },
    // ],
})
export class IfInputComponent extends IfInputBaseComponent implements OnInit {

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
