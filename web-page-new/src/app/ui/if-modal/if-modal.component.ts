import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    TemplateRef,
    ViewChild
} from '@angular/core';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {IfModalService} from "./if-modal.service";


@Component({
    selector: 'app-if-modal',
    templateUrl: './if-modal.component.html',
    styleUrls: ['./if-modal.component.css']
})
export class IfModalComponent implements OnInit, AfterViewInit {

    @ViewChild('defaultModelContent') private defaultModelContent: TemplateRef<any>;

    /**
     * ダイアログId
     */
    @Input() modalId;

    /**
     * タイトル
     */
    @Input() title;

    /**
     * OKボタン表示内容
     */
    @Input() okBtnText;

    /**
     * Cancelボタン表示内容
     */
    @Input() cancelBtnText;

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
        private modalService: IfModalService,
    ) {
        // ダイアログIdにより、該当なダイアログを開く
        this.modalService.modalOpenCalled$.subscribe(
            (modalId) => {
                this.openModal(modalId);
            }
        );
        // ダイアログIdにより、該当なダイアログを閉じる
        this.modalService.modalCloseCalled$.subscribe((modalId) => {
            this.closeModal(modalId);
        })
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
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
    private openModal(modalId: string) {
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
    private closeModal(modalId: string) {
        if (this.modalId !== modalId) {
            return;
        }
        this.modal.dismissAll();
    }

}
