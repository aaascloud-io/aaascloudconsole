import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output
} from '@angular/core';


@Component({
    selector: 'app-if-input-group',
    templateUrl: './if-input-group.component.html',
    styleUrls: ['./if-input-group.component.css']
})
export class IfInputGroupComponent implements OnInit {

    /**
     * ヒント
     */
    @Input() placeholder: string;

    /**
     * 長さ
     */
    @Input() maxlength: number;

    /**
     * 入力項目のスタイル
     */
    @Input() class: string | string[] | Set<string> | { [klass: string]: any; }
    @Input() style: string;

    /**
     * アイコン（前）表示／非表示
     */
    @Input() prepend: boolean;

    /**
     * アイコン（前）のスタイル
     */
    @Input() prependClass: string | string[] | Set<string> | { [klass: string]: any; };

    /**
     * アイコン（前）のラベル
     */
    @Input() prependLabel: string;

    /**
     * アイコン（後）表示／非表示
     */
    @Input() append: boolean;

    /**
     * アイコン（後）のスタイル
     */
    @Input() appendClass: string | string[] | Set<string> | { [klass: string]: any; };

    /**
     * アイコン（後）のラベル
     */
    @Input() appendLabel: string;

    /**
     * 入力項目値
     */
    @Input() value: string;

    /**
     * 入力項目値変更イベント
     */
    @Output() valueChange: EventEmitter<string> = new EventEmitter();

    /**
     * アイコン（前）クリックイベント
     */
    @Output() clickPrependEvent = new EventEmitter<MouseEvent>();

    /**
     * アイコン（後）クリックイベント
     */
    @Output() clickAppendEvent = new EventEmitter<MouseEvent>();

    /**
     * 入力値変更イベント
     */
    @Output() changeValueEvent = new EventEmitter<string>();


    constructor() {
    }

    ngOnInit(): void {
    }

    /**
     * アイコン（前）クリック処理
     * @param event イベント
     */
    onPrepend(event): void {
        this.clickPrependEvent.emit(event);
    }

    /**
     * アイコン（後）クリック処理
     * @param event イベント
     */
    onAppend(event): void {
        this.clickAppendEvent.emit(event);
    }

    /**
     * 入力値変更処理
     * @param event 変更値
     */
    onTextValueChange(event) {
        this.changeValueEvent.emit(event);
        this.valueChange.emit(this.value);
    }

}
