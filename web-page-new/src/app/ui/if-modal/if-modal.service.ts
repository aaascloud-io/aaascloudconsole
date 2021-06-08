import {Injectable} from '@angular/core';
import {Subject} from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class IfModalService {

    // Observable string sources
    private modalOpenCallSource = new Subject<any>();
    private modalCloseCallSource = new Subject<any>();

    // Observable string streams
    public modalOpenCalled$ = this.modalOpenCallSource.asObservable();
    public modalCloseCalled$ = this.modalCloseCallSource.asObservable();

    // Service message commands
    /**
     * ダイアログを開く
     * @param modalId ダイアログId
     */
    public open(modalId: string): void {
        this.modalOpenCallSource.next(modalId);
    }

    /**
     * ダイアログを閉じる
     * @param modalId ダイアログId
     */
    public close(modalId: string): void {
        this.modalCloseCallSource.next(modalId);
    }

    // listenerFn: (e?: any) => any

}
