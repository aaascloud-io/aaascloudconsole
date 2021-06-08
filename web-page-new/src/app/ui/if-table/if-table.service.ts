import {Injectable} from '@angular/core';
import {Subject} from "rxjs";


@Injectable()
export class IfTableService {

    // ページデータ
    private currentData = new Subject<any>();
    public currentDataCalled$ = this.currentData.asObservable();
    // 再描画
    private paint = new Subject<any>();
    public paintCalled$ = this.paint.asObservable();


    /**
     * 行データ
     * @param modalId テーブルId
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


}
