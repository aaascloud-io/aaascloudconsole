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
import * as XLSX from 'xlsx';


interface ListData {
    [key: string]: string | undefined;
}

@Component({
    selector: 'app-simcard',
    templateUrl: './simcard.component.html',
    styleUrls: ['./simcard.component.css']
})

@Injectable()
export class SimcardComponent implements OnInit, AfterViewInit {
    @ViewChild('registerDeviceModal') public templateref: TemplateRef<any>;
    cardInfos: ListData[];

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
    // 一括登録ダイアログのタイトル
    newAllCardModalTitle: string;
    // 一括登録ダイアログのOKボタン
    newAllCardModalOkButtonText: string;
    // 区分設定値
    selDivision = [{key: 'Tracker', val: '1'}, {key: 'SimCard', val: '2'}];
    importData: {};

    // 定数定義
    TBL_LIST_ID = "tblListId";
    NEW_CARD_MODAL = "newCardModal";
    TBL_ALL_LIST_ID = "newAllList";
    NEW_ALL_CARD_MODAL = "newAllCardModal";
    DOWNLOAD_SAMPLE_MSG = "サンプルファイルをダウンロード";
    static DEL_CONFIRM_MSG = "を削除します。よろしいですか？";
    static DEL_CONFIRM_HER = '削除確認';
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
    static DEL_ALL_CONFIRM_MSG = "選択済みアイテムを削除します。よろしいですか？";
    static MOD_NEW_ALL_TITLE = '一括登録';


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
    openNewModal(): void {
        // ダイアログのタイトルとボタン名を設定する
        this.newCardModalTitle = SimcardComponent.MOD_NEW_TITLE;
        this.newCardModalOkButtonText = SimcardComponent.MOD_NEW_OK_BUTTON;
        // 開く
        this.modalService.open(this.NEW_CARD_MODAL);
    }

    /**
     * 削除イベント（複数）
     */
    onDeleteSelectedAll(): void {
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
    onAddDialogOKClick(event): void {
        // 入力したSIMカード情報を取得
        let param = this.pageModel.simCard;
        // 新規追加処理
        this.httpService.usePostII('card/add', param).then((result) => {
            console.log(result);
            if (result) {
                this.clear();
                this.modalService.close(this.NEW_CARD_MODAL);
                this.getList();
                this.showAlert("info", SimcardComponent.NEW_INFO_MSG_1
                    + this.newCardModalTitle + SimcardComponent.NEW_INFO_MSG_2);
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
    onAddDialogCloseClick(): void {
        this.clear();
    }

    openNewAllModal(): void {
        // ダイアログのタイトルとボタン名を設定する
        this.newAllCardModalTitle = SimcardComponent.MOD_NEW_ALL_TITLE;
        this.newAllCardModalOkButtonText = SimcardComponent.MOD_NEW_OK_BUTTON;
        // 開く
        this.modalService.open(this.NEW_ALL_CARD_MODAL);
        // 再描画処理
        this.tableService.repaint(this.TBL_ALL_LIST_ID);
    }

    onNewAllDialogOKClick(event): void {
        this.modalService.close(this.NEW_ALL_CARD_MODAL);
    }

    /**
     * インポートフォーマットをダウンロードする
     * @param event イベント
     */
    onDownloadSample(event): void {
        this.exportExcel("sample.xlsx", "sheet1");
    }

    /**
     * インポートイベント
     * @param event イベント
     */
    onImportDataButton(event): void {
        // ファイル
        let file = event.target.files[0];
        // ファイル読み込み
        this.readExcelData(file,
            (jsonData) => {
                this.importData = jsonData['sheet1'].splice(1);
                console.log(this.importData);
            },
            (err) => {
                this.showAlert("error", "ファイル読み込み失敗しました");
            });
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
    private doProcessByConfirm(message: string, header: string,
                               accept: Function, reject: Function): void {
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

    private excelData(data: string[][], sheetName: string): any {
        // シート作成
        let ws = XLSX.utils.aoa_to_sheet(data);
        // ワークブック作成
        let workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, ws, sheetName);

        // ファイル作成
        let excelFile = XLSX.write(workbook, {type: 'binary'});

        // バイナリデータに変換する
        let stringToArrayBuffer = function (s) {
            let buffer = new ArrayBuffer(s.length);
            let bufferView = new Uint8Array(buffer);
            for (let i = 0; i != s.length; ++i) {
                bufferView[i] = s.charCodeAt(i) & 0xFF;
            }
            return buffer;
        }

        // エクセルデータ作成
        let blob = new Blob([stringToArrayBuffer(excelFile)], {
                type: 'text/csv'
                // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
            }
        );
        return blob;
    }

    private exportExcel(fileName, sheetName: string): void {
        // テーブルによって、ヘッダー情報取得
        let header = this.tableService.headers(this.TBL_ALL_LIST_ID);
        // ヘッダー情報をデータに設定する
        let data = [header.names, header.labels];
        // エクセルデータ作成
        let blob = this.excelData(data, sheetName);

        // ダウンロード
        const url = window.URL.createObjectURL(blob);
        let link = document.createElement("a");
        link.download = fileName;
        link.href = url;
        link.click();
    }

    private readExcelData(file: File,
                          loadCallback: ((_d: {}) => any | null | void),
                          errorCallback: ((_e: {}) => any | null | void)): void {
        if (!file) {
            return;
        }
        // 読み込み準備
        let reader = new FileReader();
        // 読み込みメソッドを設定する
        reader.onload = (event) => {
            this.loadingFile(reader, event, loadCallback);
        }
        // エラーメソッドを設定する
        reader.onerror = (event) => {
            this.loadError(reader, event, errorCallback);
        };
        // 読み込み
        reader.readAsBinaryString(file);
    }

    private loadingFile(reader: FileReader, event: ProgressEvent<FileReader>,
                        loadCallback: ((_d: {}) => any | null | void)): any {
        const data = reader.result;

        // エクセルファイルのワークブックを作成
        // dateNF: 'yyyy/mm/dd;@'
        let workBook = XLSX.read(data, {type: 'binary', cellDates: true, cellNF: false, cellText: false});
        // シート名によって、エクセルデータを読み込む
        let jsonData = workBook.SheetNames.reduce((initial, name) => {
            const sheet = workBook.Sheets[name];
            // JSONデータに変換する
            // header: 1
            initial[name] = XLSX.utils.sheet_to_json(sheet, {raw: false, dateNF: 'yyyy/mm/dd'});
            return initial;
        }, {});

        // コールバックなしの場合
        if (!loadCallback) {
            return;
        }
        // 読み込んだ後で、コールバック関数を呼び出す
        loadCallback(jsonData);
    }

    private loadError(reader: FileReader, event: ProgressEvent<FileReader>,
                      errorCallback: ((_e: {}) => any | null | void)): any {
        // コールバックなしの場合
        if (!errorCallback) {
            return;
        }
        // エラーのコールバック関数を呼び出す
        errorCallback(reader);
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


    // export() {
    //     // let header = this.tableService.headers(this.TBL_ALL_LIST_ID);
    //     // // let data = [['no', 'ukeirebi', 'c', 'd', 'e'], ['番号', '受入日', 3, 4, 5]];
    //     // let data = [header.names, header.labels];
    //     // // create an excel worksheet from an array of arrays (aoa) of survey data
    //     // let worksheet1 = XLSX.utils.aoa_to_sheet(data);
    //     // // instantiate new excel workbook
    //     // let workbook = XLSX.utils.book_new();
    //     //
    //     // XLSX.utils.book_append_sheet(workbook, worksheet1, 'Worksheet1');
    //     // let excelFile = XLSX.write(workbook, {type: 'binary'});
    //     //
    //     // let stringToArrayBuffer = function (s) {
    //     //     let buffer = new ArrayBuffer(s.length);
    //     //     let bufferView = new Uint8Array(buffer);
    //     //     for (let i = 0; i != s.length; ++i) {
    //     //         bufferView[i] = s.charCodeAt(i) & 0xFF;
    //     //     }
    //     //     return buffer;
    //     // }
    //     // let blob = new Blob([stringToArrayBuffer(excelFile)], {
    //     //         type: 'text/csv'
    //     //     }
    //     // );
    //
    //
    //     // let url = window.URL || window.webkitURL;
    //     // $scope.fileUrl = url.createObjectURL(blob);
    //     // this.url = url.createObjectURL(blob);
    //
    //     // // const blob = new Blob([bom, csv], { type: 'text/csv' });
    //     // const url = window.URL.createObjectURL(blob);
    //     // const link: HTMLAnchorElement = document.querySelector('#csv-donwload') as HTMLAnchorElement;
    //     // link.href = url;
    //     // link.download = "sample.xlsx";
    //     // link.click();
    //
    //
    //     // const url = window.URL.createObjectURL(blob);
    //     // let link = document.createElement("a");
    //     // link.download = "deviceInsert.xlsx";
    //     // link.href = url;
    //     // link.click();
    // }
    //
    //
    // import(file: File) {
    //     // Logger.info(this, `got target file. name:[${file.name}]`);
    //     if (file) {
    //         var reader = new FileReader();
    //         reader.onload = (event) => {
    //             const data = reader.result;
    //             // var workBook = XLSX.read(data, { type: 'binary', cellDates: true, dateNF: 'yyyy/mm/dd;@' });
    //             var workBook = XLSX.read(data, {type: 'binary', cellDates: true, cellNF: false, cellText: false});
    //             var jsonData = workBook.SheetNames.reduce((initial, name) => {
    //                 const sheet = workBook.Sheets[name];
    //                 // initial[name] = XLSX.utils.sheet_to_json(sheet);
    //                 // initial[name] = XLSX.utils.sheet_to_json(sheet, {header: 1, dateNF: 'yyyy-mm-dd'});
    //                 initial[name] = XLSX.utils.sheet_to_json(sheet, {raw: false, dateNF: 'yyyy/mm/dd'});
    //                 return initial;
    //             }, {});
    //             // this.pageModel.addDeviceDetailList = jsonData['rawData'].splice(1);
    //             // Logger.info(this, `loaded. size:[${this.pageModel.dataAll.length}]`);
    //             let xx = jsonData['Worksheet1'].splice(1);
    //         }
    //         reader.onerror = (event) => {
    //             this.showAlert("error", "ファイル読み込み失敗しました");
    //
    //         }
    //         ///読み込み実施
    //         reader.readAsBinaryString(file);
    //         // fileInput.nativeElement.value = '';
    //
    //     }
    // }

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
