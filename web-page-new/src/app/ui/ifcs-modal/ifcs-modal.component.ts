import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    TemplateRef,
    ViewChild
} from '@angular/core';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {IfcsModalService} from "./ifcs-modal.service";
import {Subscription} from "rxjs";


@Component({
    selector: 'ifcs-modal',
    templateUrl: './ifcs-modal.component.html',
    styleUrls: ['./ifcs-modal.component.css']
})
export class IfcsModalComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('defaultModelContent') private defaultModelContent: TemplateRef<any>;
    private subscriptions: Array<Subscription> = [];

    /**
     * ダイアログId
     */
    @Input() modalId: string;

    /**
     * タイトル
     */
    @Input() title: string;

    /**
     * スタイル
     */
    @Input() class: string | string[] | Set<string> | { [klass: string]: any; }

    /**
     * OKボタン表示内容
     */
    @Input() okBtnText: string;

    /**
     * Cancelボタン表示内容
     */
    @Input() cancelBtnText: string;

    /**
     * OKボタン種類（ディフォルト：button）
     */
    @Input() okBtnType: string;

    /**
     * OKボタン活性／非活性（ディフォルト：false）
     */
    @Input() okBtnDisabled: boolean;

    /**
     * OKボタンクリックイベント処理
     */
    @Output() okClick = new EventEmitter<MouseEvent>();

    /**
     * 閉じる／キャンセルボタンがクリックされるイベント処理
     */
    @Output() cancelClicked = new EventEmitter<void>();


    constructor(
        private modal: NgbModal,
        private modalService: IfcsModalService,
    ) {
        // subscribe設定
        this.doSubscribe();
    }

    ngOnInit(): void {
        if (!this.okBtnType) {
            this.okBtnType = "button";
        }
    }

    ngAfterViewInit(): void {
    }

    ngOnDestroy(): void {
        // subscribe解除
        this.doUnsubscribe();
    }

    /**
     * OKボタンクリックイベント
     * @param event イベント
     */
    onClick(event) {
        this.okClick.emit(event);
    }

    /**
     * ダイアログを開く
     * @param modalId ダイアログId
     */
    private openModal(modalId: string): void {
        if (this.modalId !== modalId) {
            return;
        }
        this.modal.open(this.defaultModelContent, {
            windowClass: 'animated fadeInDown'
            , size: 'lg'
        }).result.then((result) => {
            // Close modal
            // console.log(result);
            this.cancelClicked.emit();
        }, (reason) => {
            // Cross click
            // console.log(reason);
        });
    }

    /**
     * ダイアログを閉じる
     * @param modalId ダイアログId
     */
    private closeModal(modalId: string): void {
        if (this.modalId !== modalId) {
            return;
        }
        this.modal.dismissAll();
    }

    /**
     * subscribe設定
     */
    private doSubscribe(): void {
        // ダイアログIdにより、該当なダイアログを開く
        this.subscriptions.push(this.modalService.modalOpenCalled$.subscribe(
            (modalId) => {
                this.openModal(modalId);
            }
        ));
        // ダイアログIdにより、該当なダイアログを閉じる
        this.subscriptions.push(this.modalService.modalCloseCalled$.subscribe((modalId) => {
            this.closeModal(modalId);
        }));
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
