import {Injectable} from '@angular/core';
import {Subject} from "rxjs";


@Injectable()
export class IfcsTableService {

    // ページデータ
    private currentData = new Subject<any>();
    public currentDataCalled$ = this.currentData.asObservable();
    // 再描画
    private paint = new Subject<any>();
    public paintCalled$ = this.paint.asObservable();
    // ヘッダー
    private header = new Subject<any>();
    public headerCalled$ = this.header.asObservable();
    // 全選択取消
    private unselect = new Subject<any>();
    public unselectedCalled$ = this.unselect.asObservable();


    /**
     * 行データ
     * @param tblId テーブルId
     */
    public current(tblId: string): any {
        let param = {
            tblId: tblId,
            rows: []
        }
        this.currentData.next(param);
        return param.rows;
    }

    /**
     * 再描画
     * @param tblId テーブルId
     */
    public repaint(tblId: string): any {
        this.paint.next(tblId);
    }

    /**
     * ヘッダー
     * @param tblId テーブルId
     */
    public headers(tblId: string): { names: string[], labels: string[] } {
        let param = {
            tblId: tblId,
            header: {
                names: [],
                labels: []
            }
        }
        this.header.next(param);
        return param.header;
    }

    /**
     * 全選択取消
     * @param tblId テーブルId
     */
    public unselected(tblId: string): void {
        this.unselect.next(tblId);
    }


}
