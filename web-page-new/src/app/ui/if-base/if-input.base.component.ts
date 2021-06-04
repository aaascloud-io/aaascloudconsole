import {
    ControlValueAccessor,
    NgControl,
    ValidationErrors
} from "@angular/forms";
import {
    Component,
    Input,
    Optional,
    Self
} from "@angular/core";

@Component({
    template: ''
})
export class IfInputBaseComponent implements ControlValueAccessor {

    /**
     * イベント
     */
    protected onTouchedCallback: () => void = () => {
    };

    /**
     * Changeイベント
     */
    protected onChangeCallback: (_: any) => void = () => {
    };


    /**
     * ラベル
     */
    @Input() label: string;

    /**
     * 必須可否
     */
    @Input() required: boolean;

    /**
     * スタイル
     */
    @Input() class: string | string[] | Set<string> | { [klass: string]: any; }


    /**
     * 入力値
     */
    protected _value: any;

    /**
     * 入力値取得
     */
    get value(): string {
        return this._value;
    }

    /**
     * 入力値設定
     * @param text 指定した値
     */
    @Input('value')
    set value(text: string) {
        if (this._value === text) {
            return;
        }
        this._value = text;
        this.onChangeCallback(text);
    }

    /**
     * イベントレジスター
     * @param fn イベント処理関数
     */
    registerOnChange(fn: any): void {
        this.onChangeCallback = fn;
    }

    /**
     * イベントレジスター
     * @param fn イベント処理関数
     */
    registerOnTouched(fn: any): void {
        this.onTouchedCallback = fn;
    }

    /**
     * 入力値書き込み
     * @param obj 入力値
     */
    writeValue(obj: any): void {
        if (obj !== this.value) {
            this.value = obj;
        }
    }


    constructor(@Self() @Optional() public control: NgControl) {
        this.control && (this.control.valueAccessor = this);
        // this.defaultMessage();
    }

    get errors(): ValidationErrors | null {
        if (!this.control) {
            return [];
        }
        return this.control.errors;
    }

    get hasError(): boolean {
        if (!this.control) {
            return false;
        }
        const {dirty, touched} = this.control;
        return this.control.invalid ? (dirty || touched) : false;
    }


    ///////////////////////////////////  削 除 可   ///////////////////////////////
    // public get showError(): boolean {
    //     if (!this.control) {
    //         return false;
    //     }
    //
    //     const {dirty, touched} = this.control;
    //
    //     return this.invalid ? (dirty || touched) : false;
    // }
    //
    // public get errors_bk(): Array<string> {
    //     if (!this.control) {
    //         return [];
    //     }
    //
    //     const {errors} = this.control;
    //     return Object.keys(errors).map(key => this.errorMessages.has(key) ? this.errorMessages.get(key)() : <string>errors[key] || key);
    // }
    //
    // errorMessages = new Map<string, any>();
    //
    // private defaultMessage(): void {
    //     this.errorMessages.set('required', () => `${this.label} is required.`);
    //     // this.errorMessages.set('minlength', () => `The no. of characters should not be less than ${this.minlength}.`);
    // }
    //
    // private get invalid(): boolean {
    //     return this.control ? this.control.invalid : false;
    // }


//
//     <ng-container *ngIf="inputIPinfo.invalid && (inputIPinfo.touched || inputIPinfo.dirty)">
//     <p>
//         <span *ngIf="inputIPinfo.hasError('required')">required</span>
//     <span *ngIf="inputIPinfo.hasError('phonenumber')">please 000-0000-0000</span>
// </p>
// </ng-container>
//
// <div *ngIf="inputIPinfo.invalid && (inputIPinfo.touched || inputIPinfo.dirty)" class="invalid-feedback">
//     <div *ngIf="inputIPinfo.errors.required">SNを入力してください</div>
//         </div>
//
//     #inputIPinfo="ngModel"
//     <div *ngIf="inputIPinfo.errors" class="invalid-feedback d-block">
//     <div *ngIf="inputIPinfo.errors.required">新規メールを入力してください</div>
//     <div *ngIf="inputIPinfo.errors.email">入力されたメールアドレスは有効ではありません</div>
//     </div>
//
//     <div *ngIf="showError" class="invalid-feedback d-block">
//         <div>{{errors[0]}}</div>
// </div>

    ///////////////////////////////////  削 除 可   ///////////////////////////////

}