import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import * as $ from 'jquery'
import {IfcsTableColumnCustom} from './ifcs-table.columnCustom';
import {IfcsTableColumnSupperLink} from "./ifcs-table.columnSupperLink";
import {IfcsTableService} from "./ifcs-table.service";
import {Subscription} from "rxjs";


/**
 * テーブルヘッダー（TH）
 */
interface HeaderItem {
    columnName: string;
    label: string;
    type: string;
    // align: string;
    ascending: boolean;
    sortable: boolean;
}

/**
 * テーブル行（TR）
 */
interface RowItem {
    /** key: column name, value: cell value */
    selected: string | undefined;

    [key: string]: string | undefined;
}

/**
 * 該当行（TR）
 */
interface CurrentInfo {
    tblId: string;
    rows: RowItem[];
}

/**
 * ヘッダー（TH）
 */
interface HeaderInfo {
    tblId: string;
    header: {
        names: string[];
        labels: string[];
    }
}

/**
 * カラム種類
 */
class ItemType {
    // 普通
    public static NORMAL: string = "normal";
    // カスタマイズ（編集・削除ボタンを付ける）
    public static CUSTOM: string = "custom";
    // 選択項目
    public static SWITCH: string = "switch";
    // スーパー項目
    public static SUPPER: string = "supper";
}

@Component({
    selector: 'ifcs-table',
    templateUrl: './ifcs-table.component.html',
    styleUrls: ['./ifcs-table.component.css']
})
export class IfcsTableComponent implements OnInit, AfterViewInit, OnDestroy {
    private subscriptions: Array<Subscription> = [];

    // ヘッダー情報
    private _headerItems: HeaderItem[];
    // テーブルデータ
    private _list: RowItem[];
    // ページング可否
    private _pageable: boolean = false;
    // 行選択機能可否
    private _checkable: boolean = false;
    // カスタマイズカラム情報
    private _columnCustoms: IfcsTableColumnCustom[];
    // スーパーカラム情報
    private _columnSuppers: IfcsTableColumnSupperLink[];

    // ページング関連
    private _pageData: RowItem[][] = [];
    private _size: number = 10;
    _count: number = 0;
    _page: number = 1;
    _bigSize = true;

    // 行選択（全部）
    _allChecked = false;


    // @Input() pageable;
    /**
     * テーブルId
     */
    @Input() tblId: string;

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

        // ページサイズによって、ページ毎にデータを設定する
        this.pageData();
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
    set columnCustoms(v: IfcsTableColumnCustom[]) {
        this._columnCustoms = v;
    }

    /**
     * カスタマイズカラム取得
     */
    get columnCustoms() {
        return this._columnCustoms;
    }

    /**
     * スーパーカラム属性
     * @param v 指定したスーパーカラム情報
     */
    @Input()
    set columnSuppers(v: IfcsTableColumnSupperLink[]) {
        this._columnSuppers = v;
    }

    /**
     * ページサイズ設定
     * @param v 設定値
     */
    set size(v: number) {
        this._size = v;
        this.pageData();
    }

    /**
     * ページサイズ取得
     */
    get size(): number {
        return this._size;
    }

    /**
     * スーパーカラム取得
     */
    get columnSuppers() {
        return this._columnSuppers;
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

    /**
     * 行クリックイベント
     */
    @Output() rowClickEvent = new EventEmitter<RowItem>();

    /**
     * 行のチェックボックスイベント
     */
    @Output() rowCheckboxChangedEvent = new EventEmitter<RowItem>();


    constructor(
        private tableService: IfcsTableService,
    ) {
        // subscribe設定
        this.doSubscribe();
    }

    ngOnInit(): void {
        this._headerItems = this._getHeaderItems();
    }

    ngAfterViewInit(): void {
    }

    ngOnDestroy(): void {
        // subscribe解除
        this.doUnsubscribe();
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

        // 行のチェックボックスイベント
        this.rowCheckboxChangedEvent.emit(row);
    }

    /**
     * ページングイベント処理
     * @param event イベント
     */
    onPageChange(event) {
        this._allChecked = this._allCheckValue();
    }

    /**
     * 行クリックイベント処理
     * @param event イベント
     * @param row 行データ
     */
    onRowClick(event, row: RowItem) {
        this.rowClickEvent.emit(row);
    }

    /**
     * チェックボックスクリックイベント
     * @param event イベント
     */
    onCheckboxClick(event) {
        // イベント中止
        event.stopPropagation();
    }

    /**
     * ヘッダークリックイベント（ソート処理）
     * @param event イベント
     * @param header クリックされたヘッダー
     */
    onHeaderClick(event, header: HeaderItem) {
        // ソート機能なしの場合
        if (!header.sortable) {
            return;
        }
        // テーブルデータなしの場合
        if (!this._list) {
            return;
        }

        // 自身以外の状態をクリアする
        this._headerItems.filter(h => h.columnName !== header.columnName)
            .forEach(h => h.ascending = null);
        // ソート処理
        header.ascending = !header.ascending;
        this._list.sort((a, b) => {
            let col = header.columnName;
            let ascending = header.ascending;
            if (!a[col] && !b[col]) {
                return 0;
            }
            if (a[col] === b[col]) {
                return 0;
            }
            if (ascending) {
                return a[col] < b[col] ? -1 : 1;
            } else {
                return a[col] < b[col] ? 1 : -1;
            }
        });
        // ページデータ再作成
        this.pageData();
    }

    /**
     * カレントページのデータ
     * @param tblId
     */
    public getCurrentData(tblId: string): RowItem[] {
        if (this.tblId !== tblId) {
            return [];
        }
        return this._currentData();
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
        // Idによって、ヘッダー情報を取得する
        let header = this._find("." + this.tblId + " > li");
        // 取得しなかった場合、class従って、再取得する
        if (!header || header.length <= 0) {
            header = this._find(".ui-table-headerTemplate > ul > li");
        }
        // ヘッダー情報を解析する
        const $list = header;
        const headerItems: HeaderItem[] = [];
        $list.each((i: number, el: Element) => {
            headerItems.push({
                columnName: $(el).data('col'),
                label: $(el).data('text'),
                type: $(el).data('type') ? $(el).data('type') : ItemType.NORMAL,
                ascending: null,
                sortable: $(el).data('sortable') ? $(el).data('sortable') : false,
            });

        });
        return headerItems;
    }

    /**
     * カレントページのデータ最初インデックス
     * @private
     */
    private _start(): number {
        return this._startByPage(this._page);
    }

    /**
     * * カレントページのデータ最後インデックス
     * @private
     */
    private _end(): number {
        return this._endByPage(this._page);
    }

    /**
     * カレントページのデータ
     * @private
     */
    private _currentData(): RowItem[] {
        if (!this._list) {
            return [];
        }

        let s = this._start();
        let e = this._end();
        return this._list.slice(s, e);

        // // ページ数によって、ページデータからデータを取得する
        // return this._pageData[this._page - 1];
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

    /**
     * カレントページのデータ
     * @param param 該当行データのパラメータ
     */
    private current(param: CurrentInfo): void {
        if (this.tblId !== param.tblId) {
            // param.rows = [];
            return;
        }
        let rows = this._currentData();
        param.rows = rows;
    }

    /**
     * 再描画
     * @param tblId 該当テーブルId
     */
    private repaint(tblId: string): void {
        if (this.tblId !== tblId) {
            return;
        }
        this.ngOnInit();
    }

    /**
     * ヘッダー取得
     * @param param 該当テーブルのパラメータ
     */
    private headers(param: HeaderInfo): void {
        if (this.tblId !== param.tblId) {
            // param.header.names = [];
            // param.header.labels = [];
            return;
        }
        let items: HeaderItem[] = this._getHeaderItems();
        param.header.names = items.map((v, i, a) => v.columnName);
        param.header.labels = items.map(v => v.label);
    }

    /**
     * ページサイズによって、ページ毎にデータを設定する
     */
    private pageData(): void {
        this._pageData = [];
        let p = (this._count + this._size) / this._size;
        for (let idx = 0; idx < p; idx++) {
            let s = this._startByPage(idx + 1);
            let e = this._endByPage(idx + 1);
            let d = this._list.slice(s, e);
            this._pageData.push(d);
        }
    }

    /**
     * ページの開始データインデックス取得
     * @param p ページ
     * @private
     */
    private _startByPage(p: number): number {
        if (this._count < this._size * p) {
            return p * this._size - this._size;
        } else {
            return (p - 1) * this._size;
        }
    }

    /**
     * ページの終了データインデックス取得
     * @param p ページ
     * @private
     */
    private _endByPage(p: number): number {
        if (this._count < this._size * p) {
            return this._count;
        } else {
            return p * this._size;
        }
    }

    /**
     * subscribe設定
     */
    private doSubscribe(): void {
        // テーブルIdにより、該当なページのデータを取得
        this.subscriptions.push(this.tableService.currentDataCalled$.subscribe(
            (param: CurrentInfo) => {
                this.current(param);
            }
        ));
        // テーブルIdにより、該当なテーブルを再描画する
        this.subscriptions.push(this.tableService.paintCalled$.subscribe(
            (tblId: string) => {
                this.repaint(tblId);
            }
        ));
        // テーブルIdにより、該当なテーブルのヘッダーを取得
        this.subscriptions.push(this.tableService.headerCalled$.subscribe(
            (param: HeaderInfo) => {
                this.headers(param);
            }
        ));
    }

    /**
     * subscribe解除
     */
    private doUnsubscribe(): void {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        });
    }

}
