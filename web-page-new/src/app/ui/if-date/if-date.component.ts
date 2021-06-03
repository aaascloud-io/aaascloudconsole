import {
    Component,
    forwardRef,
    Input,
    OnInit,
    Output
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
    selector: 'app-if-date',
    templateUrl: './if-date.component.html',
    styleUrls: ['./if-date.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: forwardRef(() => IfDateComponent),
        },
    ],
})
export class IfDateComponent implements OnInit, ControlValueAccessor {
    /**
     * イベント
     */
    private onTouchedCallback: () => void = () => {
    };

    /**
     * Changeイベント
     */
    private onChangeCallback: (_: any) => void = () => {
    };

    /**
     * ラベル
     */
    @Input() label: string;

    /**
     * Id
     */
    @Input() iid: string;

    /**
     * ヒント
     */
    @Input() placeholder: string;

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
    private _value: any;

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


    constructor() {
    }

    ngOnInit(): void {
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

}
