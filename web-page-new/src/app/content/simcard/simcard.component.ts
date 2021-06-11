import {
    AfterViewInit,
    Component,
    ElementRef,
    Injectable,
    OnInit,
    TemplateRef,
    ViewChild
} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {HttpService} from 'src/app/_services/HttpService';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {IfcsModalService} from "../../ui/ifcs-modal/ifcs-modal.service";
import {IfcsTableService} from "../../ui/ifcs-table/ifcs-table.service";
import * as XLSX from 'xlsx';
import {IfcsTableComponent} from "../../ui/ifcs-table/ifcs-table.component";


/**
 * 一覧データ種類
 */
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
    @ViewChild(IfcsTableComponent, {static: false}) private ifcsTable: IfcsTableComponent;

    // 一覧を一時に保存する
    private cardInfosBackup: ListData[];
    // 一覧
    cardInfos: ListData[];
    // 検索キー
    searchValue: string;

    // 画面入力項目
    pageModel = {
        simCard: {
            ukeirebi: '',
            hakkobi: '',
            riyokaishibi: '',
            kubun: '',
            iccid: '',
            kanribango: '',
            imsi: '',
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
    // インポートデータ
    importData: [];

    // 定数定義
    TBL_LIST_ID = "tblListId";
    NEW_CARD_MODAL = "newCardModal";
    TBL_ALL_LIST_ID = "newAllList";
    NEW_ALL_CARD_MODAL = "newAllCardModal";
    DOWNLOAD_SAMPLE_MSG = "サンプルファイルをダウンロードしてください。";
    EXCEL_FILE_IMPORT_MSG = "エクセルファイルをご選択ください。";
    SEARCH_TEXT_MSG = "ご検索ください";
    static DEL_CONFIRM_MSG = "を削除します。よろしいですか？";
    static DEL_CONFIRM_HER = '削除確認';
    static DEL_INFO_MSG = "SIMカードを削除しました。";
    static DEL_ERR_MSG = "削除APIエラーを発生しました。";
    static DEL_CNL_MSG = "削除操作を取消しました。";
    static MOD_EDIT_TITLE = '修正';
    static MOD_EDIT_OK_BUTTON = '変更';
    static MOD_NEW_TITLE = '新規';
    static MOD_NEW_OK_BUTTON = '登録';
    static NEW_INFO_MSG_1 = "SIMカードを";
    static NEW_INFO_MSG_2 = "しました。";
    static NEW_ERR_MSG = "APIエラーを発生しました。";
    static DEL_ALL_CONFIRM_MSG = "選択済みアイテムを削除します。よろしいですか？";
    static MOD_NEW_ALL_TITLE = '一括登録';
    static EXCEL_FILE_IMPORT_ERR_MSG = "ファイル読み込み失敗しました。";
    static NEW_ALL_INFO_MSG = "一括登録をしました。";


    constructor(
        private modal: NgbModal,
        private elementRef: ElementRef,
        private httpService: HttpService,
        private modalService: IfcsModalService,
        private tableService: IfcsTableService,
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
     * 計算属性：一括登録画面の登録ボタンの活性／非活性
     */
    get isOkBtnDisabled() {
        return this.importData ? this.importData.length === 0 : true;
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
        // // 削除データ取得（コンポーネント）
        // let rows = this.ifcsTable.getCurrentData(this.TBL_LIST_ID);
        // 削除データ取得（サービス）
        let rows = this.tableService.current(this.TBL_LIST_ID);
        // 選択した行データ
        let checkedList = rows.filter(row => row.selected);
        // 削除処理
        this.doProcessByConfirm(SimcardComponent.DEL_ALL_CONFIRM_MSG, SimcardComponent.DEL_CONFIRM_HER,
            () => {
                this.httpService.usePostII('card/delAll', checkedList).then((result) => {
                    // console.log(result);
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
            // console.log(result);
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

    /**
     * 一括登録ダイアログを開く
     */
    openNewAllModal(): void {
        // ダイアログのタイトルとボタン名を設定する
        this.newAllCardModalTitle = SimcardComponent.MOD_NEW_ALL_TITLE;
        this.newAllCardModalOkButtonText = SimcardComponent.MOD_NEW_OK_BUTTON;
        // 開く
        this.modalService.open(this.NEW_ALL_CARD_MODAL);
        // 再描画処理
        this.tableService.repaint(this.TBL_ALL_LIST_ID);
    }

    /**
     * 一括登録イベント
     * @param event イベント
     */
    onNewAllDialogOKClick(event): void {
        let param = this.importData;
        // 一括登録処理
        this.httpService.usePostII('card/addAll', param).then((result) => {
            // console.log(result);
            if (result) {
                // ダイアログを閉じる
                this.modalService.close(this.NEW_ALL_CARD_MODAL);
                this.getList();
                this.showAlert("info", SimcardComponent.NEW_ALL_INFO_MSG);
            } else {
                this.showAlert("error", SimcardComponent.NEW_ERR_MSG);
            }
        }).catch((err) => {
            console.error(err);
            this.showAlert("error", SimcardComponent.NEW_ERR_MSG);
        });
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
     * @param files インポートファイル
     */
    onImportDataButton(files): void {
        // ファイル
        let file = files[0];
        // ファイル読み込み
        this.readExcelData(file,
            (jsonData) => {
                this.importData = jsonData['sheet1'].splice(1);
                // console.log(this.importData);
            },
            (err) => {
                this.showAlert("error", SimcardComponent.EXCEL_FILE_IMPORT_ERR_MSG);
            });
    }

    /**
     * インポートファイル削除
     * @param files インポートファイル
     */
    onRemoveFile(files): void {
        this.importData = [];
    }

    /**
     * 検索ボタン処理
     * @param event イベント
     */
    onSearchClick(event): void {
        console.log(this.searchValue);
    }

    /**
     * 検索キー変更処理
     * @param value 変更値
     */
    onSearchChange(value): void {
        // 変更キーなしの場合、一覧を全て表示する
        this.cardInfos = this.cardInfosBackup;
        if (!value) {
            return;
        }
        // 表示されたヘッダー取得
        let headers = this.tableService.headers(this.TBL_LIST_ID);
        // 検索の場合
        this.cardInfos = this.doSearch(this.cardInfos, value, headers.names);
    }

    /**
     * 一覧取得
     */
    private getList(): void {
        let param = {};
        this.httpService.usePostII('card/list', param).then((result) => {
            this.cardInfos = result;
            this.code2Name();
            this.cardInfosBackup = this.cardInfos;
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
     * 区分情報をコードから名称に変換する
     */
    private code2Name(): void {
        this.cardInfos.forEach(item => {
            let div = item.kubun;
            item.kubunName = div;
            let find = this.selDivision.find(d => d.val === div);
            if (find) {
                item.kubunName = find.key;
            }
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

    /**
     * エクセルデータを作成する
     * @param data 指定したデータ
     * @param sheetName エクセルのシート名
     */
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

    /**
     * エクセルファイルをエクスポートする
     * @param fileName ファイル名
     * @param sheetName シート名
     */
    private exportExcel(fileName: string, sheetName: string): void {
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

    /**
     * エクセルファイルを読み込む
     * @param file 指定したファイル
     * @param loadCallback 読み込んだ通知関数
     * @param errorCallback　エラー通知関数
     */
    private readExcelData(file: File,
                          loadCallback: ((_d: {}) => any | null | void),
                          errorCallback: ((_e: {}) => any | null | void)): void {
        // ファイルなしの場合
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

    /**
     * エクセルファイルをロードする
     * @param reader reader
     * @param event イベント
     * @param loadCallback 読み込んだ通知関数
     */
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
            initial[name] = XLSX.utils.sheet_to_json(sheet, {raw: false, dateNF: 'yyyy-mm-dd'});
            return initial;
        }, {});

        // コールバックなしの場合
        if (!loadCallback) {
            return;
        }
        // 読み込んだ後で、コールバック関数を呼び出す
        loadCallback(jsonData);
    }

    /**
     * ロードエラー処理
     * @param reader reader
     * @param event イベント
     * @param errorCallback エラー通知関数
     */
    private loadError(reader: FileReader, event: ProgressEvent<FileReader>,
                      errorCallback: ((_e: {}) => any | null | void)): any {
        // コールバックなしの場合
        if (!errorCallback) {
            return;
        }
        // エラーのコールバック関数を呼び出す
        errorCallback(reader);
    }

    /**
     * 検索キーによって、指定した配列から検索処理を行う
     * @param data 指定した配列
     * @param search 検索キー
     * @param headers ヘッダー
     */
    private doSearch<T>(data: Array<T>, search: any, headers: string[]): Array<T> {
        let text = search.toString().toLowerCase();
        let result = data.filter(item => {
            let rst = false;
            for (let key in item) {
                // 非表示のヘッダーを除く
                if (!headers.includes(key)) {
                    continue;
                }
                let itemText = String(item[key]).toLowerCase();
                if (itemText.includes(text)) {
                    rst = true;
                    break;
                }
            }
            return rst;
        });
        return result;
    }


    /////////////////////// テスト 削除可 //////////////////////////

    onTextValueChange(event) {
        console.log("onTextValueChange " + event);
    }

    onSelValueChange(event) {
        console.log("onSelValueChange " + event);
    }

    onModelChange(event) {
        console.log(event);
    }

    // const control = document.querySelector("#imei").querySelector("input");
    // const input: HTMLInputElement = control as HTMLInputElement;
    // input.focus();

    /////////////////////// テスト 削除可 //////////////////////////

}
