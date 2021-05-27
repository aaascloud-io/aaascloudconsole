import {
    Component,
    OnInit,
    Input,
    AfterViewInit,
    Output,
    EventEmitter,
} from '@angular/core';
import * as $ from 'jquery'
import {IfTableCustomItem} from './if-table.customItem';

/**
 * テーブルヘッダー（TH）
 */
interface HeaderItem {
    columnName: string;
    label: string;
    custom: boolean;
    // align: string;
}

/**
 * テーブル行（TR）
 */
interface RowItem {
    /** key: column name, value: cell value */
    selected: string | undefined;

    [key: string]: string | undefined;
}

@Component({
    selector: 'app-if-table',
    templateUrl: './if-table.component.html',
    styleUrls: ['./if-table.component.css']
})
export class IfTableComponent implements OnInit, AfterViewInit {
    // ヘッダー情報
    private _headerItems: HeaderItem[];
    // テーブルデータ
    private _list: RowItem[];
    // ページング可否
    private _pageable: boolean = false;
    // 行選択機能可否
    private _checkable: boolean = false;
    // カスタマイズカラム情報
    private _customItems: IfTableCustomItem[];

    // ページング関連
    _count: number = 0;
    _size: number = 10;
    _page: number = 1;
    _bigSize = true;

    // 行選択（全部）
    _allChecked = false;

    // @Input() pageable;

    /**
     * ヘッダー情報取得
     */
    get HeaderItems() {
        return this._headerItems;
    }

    /**
     * テーブルデータ属性
     * @param v 指定したデータ
     */
    @Input()
    set list(v: RowItem[]) {
        if (!v) {
            return;
        }
        this._list = v;
        this._count = this._list.length;
    }

    /**
     * テーブルデータ取得
     */
    get list() {
        if (!this._list) {
            return [];
        }
        if (!this._pageable) {
            return this._list;
        } else {
            return this._currentData();
        }
    }

    /**
     * ページング可否属性
     * @param v 指定したページング可否
     */
    @Input()
    set pageable(v: boolean) {
        this._pageable = v;
    }

    /**
     * ページング可否取得
     */
    get pageable() {
        return this._pageable;
    }

    /**
     * 行選択機能可否属性
     * @param v 指定した行選択機能可否
     */
    @Input()
    set checkable(v: boolean) {
        this._checkable = v;
    }

    /**
     * 行選択機能可否取得
     */
    get checkable() {
        return this._checkable;
    }

    /**
     * カスタマイズカラム属性
     * @param v 指定したカスタマイズカラム情報
     */
    @Input()
    set customItems(v: IfTableCustomItem[]) {
        this._customItems = v;
    }

    /**
     * カスタマイズカラム取得
     */
    get customItems() {
        return this._customItems;
    }

    /**
     * ページ（最初）
     */
    get startPage() {
        return this._start();
    }

    /**
     * ページ（最後）
     */
    get endPage() {
        return this._end();
    }

    /**
     * 行削除イベント定義
     */
    @Output() deleteRowEvent = new EventEmitter<RowItem>();
    
    /**
     * 行編集イベント定義
     */
    @Output() editRowEvent = new EventEmitter<RowItem>();


    constructor() {
    }

    ngOnInit(): void {
        this._headerItems = this._getHeaderItems();
    }

    ngAfterViewInit(): void {
    }

    /**
     * 行削除イベント処理
     * @param event イベント
     * @param row 行データ
     */
    onDeleteRow(event: MouseEvent, row: RowItem) {
        this.deleteRowEvent.emit(row);
    }

    /**
     * 行編集イベント処理
     * @param event イベント
     * @param row 行データ
     */
    onEditRow(event: MouseEvent, row: RowItem) {
        this.editRowEvent.emit(row);
    }

    /**
     * 全選択イベント処理
     * @param event イベント
     */
    onAllCheckChange(event) {
        this._currentData().forEach(item => item.selected = event.target.checked);
    }

    /**
     * 行選択イベント処理
     * @param event イベント
     * @param row 行データ
     */
    onCheckChange(event, row: RowItem) {
        row.selected = event.target.checked;
        this._allChecked = this._allCheckValue();
    }

    /**
     * ページングイベント処理
     * @param event イベント
     */
    onPageChange(event) {
        this._allChecked = this._allCheckValue();
    }

    /**
     * JQueryセレクター取得
     * @param selector
     * @private
     */
    private _find(selector: string): JQuery {
        return $(selector);
    }

    /**
     * テーブルヘッダー情報取得
     * @private
     */
    private _getHeaderItems(): HeaderItem[] {
        const $list = this._find(".ui-table-headerTemplate > ul > li");
        const headerItems: HeaderItem[] = [];
        $list.each((i: number, el: Element) => {
            headerItems.push({
                columnName: $(el).data('col'),
                label: $(el).data('text'),
                custom: $(el).data('custom') ? $(el).data('custom') : false,
            });

        });
        return headerItems;
    }

    /**
     * カレントページのデータ最初インデックス
     * @private
     */
    private _start(): number {
        if (this._count < this._size * this._page) {
            return this._page * this._size - this._size + 1;
        } else {
            return (this._page - 1) * this._size + 1;
        }
    }

    /**
     * * カレントページのデータ最後インデックス
     * @private
     */
    private _end(): number {
        if (this._count < this._size * this._page) {
            return this._count;
        } else {
            return this._page * this._size;
        }
    }

    /**
     * カレントページのデータ
     * @private
     */
    private _currentData(): RowItem[] {
        let s = this._start() - 1;
        let e = this._end();
        return this._list.slice(s, e);
    }

    /**
     * カレントページにより、全選択取得
     * @private
     */
    private _allCheckValue(): boolean {
        let allChecked = true;
        let uncheckList = this._currentData().filter(row => !row.selected);
        if (uncheckList.length > 0) {
            allChecked = false;
        }
        return allChecked;
    }

}
