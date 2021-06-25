import {Component, Input, OnInit, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import * as $ from 'jquery'
import {TreeNode} from "primeng/api";


/**
 * テーブルヘッダー（TH）
 */
interface HeaderItem {
    // 列
    field: string;
    // 列名
    header: string;
    // グループ開始
    node: boolean;
    // 列拡張
    ext: boolean;
}

interface ColExtension {
    [key: string]: any | undefined;
}


@Component({
    selector: 'ifcs-tree-table',
    templateUrl: './ifcs-tree-table.component.html',
    styleUrls: ['./ifcs-tree-table.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class IfcsTreeTableComponent implements OnInit {
    @ViewChild('treeTableToggler') private treeTableToggler: TemplateRef<any>;

    // ヘッダー情報
    private _headerItems: HeaderItem[];
    // テーブルデータ
    private _list: TreeNode[];
    // 親行のTD結合数
    private _colspanNum: number;


    /**
     * テーブルId
     */
    @Input() tblId: string;

    /**
     * 拡張可否
     */
    @Input() parentExtension: boolean;

    /**
     * テンプレート情報
     */
    @Input() parentOutTemplate: TemplateRef<HTMLElement>;

    /**
     * 親行のTD結合可否
     */
    @Input() colspan: boolean;

    /**
     * 列拡張可否
     */
    @Input() colExtension: ColExtension;


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
    set list(v: TreeNode[]) {
        if (!v) {
            return;
        }
        this._list = v;
    }

    /**
     * テーブルデータ取得
     */
    get list() {
        if (!this._list) {
            return [];
        }
        return this._list;
    }

    /**
     * 親行のTD結合属性
     * @param v 指定した列数
     */
    @Input()
    set colspanNum(v: number) {
        this._colspanNum = v;
    }

    /**
     * 親行のTD結合数取得
     */
    get colspanNum(): number {
        if (!this._colspanNum) {
            return this._headerItems.length;
        }
        return this._colspanNum;
    }


    constructor() {
    }

    ngOnInit(): void {
        this._headerItems = this._getHeaderItems();
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
                field: $(el).data('col'),
                header: $(el).data('text'),
                node: $(el).data('node') ? $(el).data('node') : false,
                ext: $(el).data('ext') ? $(el).data('ext') : false,
            });

        });
        return headerItems;
    }

}
