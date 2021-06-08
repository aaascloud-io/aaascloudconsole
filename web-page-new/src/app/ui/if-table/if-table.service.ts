import {Injectable} from '@angular/core';
import {Subject} from "rxjs";


@Injectable()
export class IfTableService {

    private currentData = new Subject<any>();
    public currentDataCalled$ = this.currentData.asObservable();


    /**
     * 行データ
     * @param modalId ダイアログId
     */
    public current(tblId: string): any {
        let param = {
            tblId: tblId,
            rows: []
        }
        this.currentData.next(param);
        return param.rows;
    }


}
