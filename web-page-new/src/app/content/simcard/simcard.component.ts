import {
    AfterViewInit,
    Component, ElementRef,
    Injectable,
    OnInit, TemplateRef, ViewChild
} from '@angular/core';
import {ConfirmationService, MessageService, TreeNode} from 'primeng/api';
import {HttpService} from 'src/app/_services/HttpService';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {IfModalService} from "../../ui/if-modal/if-modal.service";

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
    selected: { key: string, val: string };


    constructor(
        private modal: NgbModal,
        private elementRef: ElementRef,
        private httpService: HttpService,
        private modalService: IfModalService,
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
     * 削除イベント
     * @param row 指定した行
     */
    onDeleteRow(row): void {
        this.confirmationService.confirm({
            message: row.kanribango + "を削除します。よろしいですか？",
            header: 'SIMカードを削除確認',
            accept: () => {
                this.httpService.usePostII('card/del', row).then((result) => {
                    console.log(result);
                    if (result) {
                        this.getList();
                        this.showAlert("info", "SIMカードを削除しました。");
                    } else {
                        this.showAlert("error", "削除APIエラーを発生しました。");
                    }
                }).catch((err) => {
                    console.error(err);
                    this.showAlert("error", "削除APIエラーを発生しました。");
                });
            },
            reject: () => {
                this.showAlert("info", "削除操作を取消しました");

            },
        });

    }

    onEditRow(item): void {
        alert('edit');
        console.log(item);
    }

    /**
     * 新規ダイアログを開く
     */
    openNewModal() {
        this.modalService.open("newCardModal");
    }

    /**
     * 新規イベント
     * @param event イベント
     */
    onAddDialogOKClick(event) {
        this.pageModel.simCard.kubun = this.selected.key;
        let param = this.pageModel.simCard;
        this.httpService.usePostII('card/add', param).then((result) => {
            console.log(result);
            if (result) {
                this.clear();
                this.modalService.close("newCardModal");
                this.getList();
                this.showAlert("info", "新規登録しました。");
            } else {
                this.showAlert("error", "登録APIエラーを発生しました。");
            }
        }).catch((err) => {
            console.error(err);
            this.showAlert("error", "登録APIエラーを発生しました。");
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
            console.log(result);
            this.cardInfos = result;
        }).catch((err) => {
            console.error(err);
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
        console.log(event);
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
            this.modalService.close("newCardModal");
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
