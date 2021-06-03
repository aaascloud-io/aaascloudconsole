import {
    Component,
    forwardRef,
    Input,
    OnInit,
    Output
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

/**
 * セレクターアイテム種類
 */
interface SelectItem {
    /** key: column name, value: cell value */

    [key: string]: string | undefined;
}

@Component({
    selector: 'app-if-select',
    templateUrl: './if-select.component.html',
    styleUrls: ['./if-select.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: forwardRef(() => IfSelectComponent),
        },
    ],
})
export class IfSelectComponent implements OnInit, ControlValueAccessor {

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

    // /**
    //  * ヒント
    //  */
    // @Input() placeholder: string;

    /**
     * 必須可否
     */
    @Input() required: boolean;

    /**
     * 長さ
     */
    @Input() maxlength: number;

    /**
     * スタイル
     */
    @Input() class: string | string[] | Set<string> | { [klass: string]: any; }

    /**
     * セレクターの表示内容
     */
    @Input() bindLabel: string;

    /**
     * セレクターの設定値
     */
    @Input() bindValue: string;

    /**
     * 入力値
     */
    private _value: any;

    /**
     * セレクターデータ
     */
    private _list: SelectItem[];

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
        let selected = this._list.find((item) => item[this.bindValue] === text);
        this.onChangeCallback(selected);
    }

    /**
     * セレクターデータ設定
     * @param v セレクターデータ
     */
    @Input()
    set list(v: SelectItem[]) {
        if (!v) {
            return;
        }
        this._list = v;
    }

    /**
     * セレクターデータ取得
     */
    get list() {
        if (!this._list) {
            return [];
        }
        return this._list;
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
