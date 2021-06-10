import {
    Component,
    forwardRef,
    Input,
    OnInit,
    Optional,
    Output,
    Self,
    EventEmitter
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl} from "@angular/forms";
import {IfInputBaseComponent} from "../if-base/if-input.base.component";

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
})
export class IfSelectComponent extends IfInputBaseComponent implements OnInit {


    /**
     * Id
     */
    @Input() iid: string;

    // /**
    //  * ヒント
    //  */
    // @Input() placeholder: string;

    /**
     * 長さ
     */
    @Input() maxlength: number;

    /**
     * セレクターの表示内容
     */
    @Input() bindLabel: string;

    /**
     * セレクターの設定値
     */
    @Input() bindValue: string;

    /**
     * 値変更イベント
     */
    @Output() valueChange = new EventEmitter<any>();

    /**
     * 選択変更イベント
     */
    @Output() selectChangedEvent = new EventEmitter<any>();


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
        this.onChangeCallback(this._value);
        this.valueChange.emit(this._value);

        // 選択されたデータを取得する
        let selected = this._list.find((item) => item[this.bindValue] === text);
        if (!selected) {
            selected = null;
        }
        this.selectChangedEvent.emit(selected);
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


    constructor(@Self() @Optional() public control: NgControl) {
        super(control);
    }

    ngOnInit(): void {
    }


}
