import {
    AfterViewInit,
    Component, ElementRef,
    Injectable,
    OnInit,
    TemplateRef,
    ViewChild
} from '@angular/core';
import {ConfirmationService, MessageService, TreeNode} from 'primeng/api';
import {HttpService} from 'src/app/_services/HttpService';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {IfModalService} from "../../ui/if-modal/if-modal.service";
import {IfTableService} from "../../ui/if-table/if-table.service";


@Component({
    selector: 'app-simcard',
    templateUrl: './simcard.component.html',
    styleUrls: ['./simcard.component.css']
})

@Injectable()
export class SimcardComponent implements OnInit, AfterViewInit {
    @ViewChild('registerDeviceModal') public templateref: TemplateRef<any>;
    cardInfos: TreeNode[];

    pageModel = {
        simCard: {
            ukeirebi: '',
            hakkobi: '',
            riyokaishibi: '',
            kubun: '',
            imei: '',
            kanribango: '',
            tenwabango: '',
            hakkotanto: '',
            hakkosaki: '',
            hakkosakitantosha: '',
            renrakusen: '',
            riyomokuteki: '',
            gaiyo: '',
            biko: '',
        },
    }
    // 新規ダイアログのタイトル
    newCardModalTitle: string;
    // 新規ダイアログのOKボタン
    newCardModalOkButtonText: string;
    // optFlag: string;
    // 区分設定値
    selDivision = [{key: 'Tracker', val: '1'}, {key: 'SimCard', val: '2'}];

    // 定数定義
    TBL_LIST_ID = "tblListId";
    NEW_CARD_MODAL = "newCardModal";
    static DEL_CONFIRM_MSG = "を削除します。よろしいですか？";
    static DEL_CONFIRM_HER = 'SIMカードを削除確認';
    static DEL_INFO_MSG = "SIMカードを削除しました。";
    static DEL_ERR_MSG = "削除APIエラーを発生しました。";
    static DEL_CNL_MSG = "削除操作を取消しました";
    static MOD_EDIT_TITLE = '修正';
    static MOD_EDIT_OK_BUTTON = '変更';
    static MOD_NEW_TITLE = '新規';
    static MOD_NEW_OK_BUTTON = '登録';
    static NEW_INFO_MSG_1 = "SIMカードを";
    static NEW_INFO_MSG_2 = "しました。";
    static NEW_ERR_MSG = "APIエラーを発生しました。";
    static DEL_ALL_CONFIRM_MSG = "選択したSIMカードを削除します。よろしいですか？";


    constructor(
        private modal: NgbModal,
        private elementRef: ElementRef,
        private httpService: HttpService,
        private modalService: IfModalService,
        private tableService: IfTableService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
    ) {
    }

    ngOnInit(): void {
        this.getList();
    }

    ngAfterViewInit(): void {
    }

    /**
     * 削除イベント（単数）
     * @param row 指定した行
     */
    onDeleteRow(row): void {
        // 削除処理
        this.doProcessByConfirm(row.kanribango + SimcardComponent.DEL_CONFIRM_MSG,
            SimcardComponent.DEL_CONFIRM_HER,
            () => {
                this.httpService.usePostII('card/del', row).then((result) => {
                    if (result) {
                        this.getList();
                        this.showAlert("info", SimcardComponent.DEL_INFO_MSG);
                    } else {
                        this.showAlert("error", SimcardComponent.DEL_ERR_MSG);
                    }
                }).catch((err) => {
                    console.error(err);
                    this.showAlert("error", SimcardComponent.DEL_ERR_MSG);
                });
            },
            () => {
                this.showAlert("info", SimcardComponent.DEL_CNL_MSG);
            }
        );
    }

    /**
     * 編集ダイアログを開く
     * @param row 選択した行データ
     */
    onEditRow(row): void {
        // 選択したSIMカード情報を取得
        this.getCardInfo(row);
        // ダイアログのタイトルとボタン名を設定する
        this.newCardModalTitle = SimcardComponent.MOD_EDIT_TITLE;
        this.newCardModalOkButtonText = SimcardComponent.MOD_EDIT_OK_BUTTON;
        // 開く
        this.modalService.open(this.NEW_CARD_MODAL);
    }

    /**
     * 新規ダイアログを開く
     */
    openNewModal() {
        // ダイアログのタイトルとボタン名を設定する
        this.newCardModalTitle = SimcardComponent.MOD_NEW_TITLE;
        this.newCardModalOkButtonText = SimcardComponent.MOD_NEW_OK_BUTTON;
        // 開く
        this.modalService.open(this.NEW_CARD_MODAL);
    }

    /**
     * 削除イベント（複数）
     */
    onDeleteSelectedAll() {
        // 削除データ取得
        let rows = this.tableService.current(this.TBL_LIST_ID);
        // 選択した行データ
        let checkedList = rows.filter(row => row.selected);
        // 削除処理
        this.doProcessByConfirm(SimcardComponent.DEL_ALL_CONFIRM_MSG, SimcardComponent.DEL_CONFIRM_HER,
            () => {
                this.httpService.usePostII('card/delAll', checkedList).then((result) => {
                    console.log(result);
                    if (result) {
                        this.getList();
                        this.showAlert("info", SimcardComponent.DEL_INFO_MSG);
                    } else {
                        this.showAlert("error", SimcardComponent.DEL_ERR_MSG);
                    }
                }).catch((err) => {
                    console.error(err);
                    this.showAlert("error", SimcardComponent.DEL_ERR_MSG);
                });
            },
            () => {
                this.showAlert("info", SimcardComponent.DEL_CNL_MSG);
            }
        );

    }

    /**
     * 新規イベント
     * @param event イベント
     */
    onAddDialogOKClick(event) {
        // 入力したSIMカード情報を取得
        let param = this.pageModel.simCard;
        // 新規追加処理
        this.httpService.usePostII('card/add', param).then((result) => {
            console.log(result);
            if (result) {
                this.clear();
                this.modalService.close(this.NEW_CARD_MODAL);
                this.getList();
                this.showAlert("info", SimcardComponent.NEW_INFO_MSG_1 + this.newCardModalTitle + SimcardComponent.NEW_INFO_MSG_2);
            } else {
                this.showAlert("error", SimcardComponent.NEW_ERR_MSG);
            }
        }).catch((err) => {
            console.error(err);
            this.showAlert("error", SimcardComponent.NEW_ERR_MSG);
        });

        // this.test();
    }

    /**
     * キャンセルイベント
     */
    onAddDialogCloseClick() {
        this.clear();
    }

    /**
     * 一覧取得
     */
    private getList(): void {
        let param = {};
        this.httpService.usePostII('card/list', param).then((result) => {
            this.cardInfos = result;
        }).catch((err) => {
            console.error(err);
        });
    }

    /**
     * SIMカード情報取得
     * @param param 行データ
     */
    private getCardInfo(param): void {
        this.httpService.usePostII('card/info', param).then((result) => {
            this.pageModel.simCard = result;
        }).catch((err) => {
            console.error(err);
        });
    }

    /**
     * 削除操作を確認して、削除処理を行う
     * @param message メッセージ
     * @param header タイトル
     * @param accept 削除処理
     * @param reject 取消処理
     */
    private doProcessByConfirm(message: string, header: string, accept: Function, reject: Function): void {
        this.confirmationService.confirm({
            message: message,
            header: header,
            accept: accept,
            reject: reject,
        });
    }

    /**
     * クリア
     */
    private clear(): void {
        for (let key in this.pageModel.simCard) {
            this.pageModel.simCard[key] = null;
        }
    }

    /**
     * 確認ダイアログを開く
     * @param alertType 種類
     * @param alertDetail メッセージ
     */
    private showAlert(alertType, alertDetail): void {
        let lifeValue = 2000;
        let summary: string = alertType === "error" ? "エラー" : (alertType === "info" ? "情報" : "");
        this.messageService.add({
            key: 'alertModal',
            severity: alertType,
            summary: summary,
            detail: alertDetail,
            life: lifeValue
        });
    }

    openExcelModal() {
        this.modalService.open("modalB");
    }

    onExcelDialogOKClick(event) {
        this.modalService.close("modalB");
    }

    onTextValueChange(event) {
        console.log("onTextValueChange " + event);
    }

    onSelValueChange(event) {
        console.log("onSelValueChange " + event);
    }

    onModelChange(event) {
        console.log("onModelChange " + event);
    }


    /////////////////////////////////////////////////////////////

    onTest(event, row, option) {
        alert(option);
        console.log(event);
        console.log(row);
        console.log(option);
    }

    test() {
        // const control = document.querySelector("app-if-input[name='imei']");
        const control = document.querySelector("#imei").querySelector("input");
        const input: HTMLInputElement = control as HTMLInputElement;
        input.focus();
        // input.select();

        // imei
        if (this.pageModel.simCard.imei === "123456") {
            this.modalService.close(this.NEW_CARD_MODAL);
        }

        // setTimeout(()=>{ // this will make the execution after the above boolean has changed
        //     this.test2F.nativeElement.focus();
        // },0);
    }

    /////////////////////////////////////////////////////////////


    // private testData(): void {
    //     this.cardInfos = [
    //         {
    //             data: {
    //                 no: '1', ukeirebi: '2021-05-24',
    //                 kubun: '1', imei: 'imei',
    //                 kanribango: '01', tenwabango: '08012345678',
    //                 hakkotanto: '01', hakkobi: '2021-05-24',
    //                 hakkosaki: '01', hakkosakitantosha: 'A01',
    //                 renrakusen: 'test', riyokaishibi: '2021-05-24'
    //             },
    //         },
    //         {
    //             data: {
    //                 no: '2', ukeirebi: '2021-05-24',
    //                 kubun: '1', imei: 'imei2',
    //                 kanribango: '02', tenwabango: '08012345678',
    //                 hakkotanto: '02', hakkobi: '2021-05-24',
    //                 hakkosaki: '02', hakkosakitantosha: 'A02',
    //                 renrakusen: 'test02', riyokaishibi: '2021-05-24'
    //             },
    //         },
    //     ];
    // }


}
