import {
    Component,
    EventEmitter,
    Input, OnInit,
    Output
} from '@angular/core';


@Component({
    selector: 'ifcs-dropzone',
    templateUrl: './ifcs-dropzone.component.html',
    styleUrls: ['./ifcs-dropzone.component.css']
})
export class IfcsDropzoneComponent implements OnInit {

    /**
     * 選択したファイル
     */
    files: File[] = [];

    /**
     * 複数選択可否
     */
    @Input() multiple: boolean;

    /**
     * メッセージ
     */
    @Input() label: string;

    /**
     * Changeイベント
     */
    @Output() onChangeEvent = new EventEmitter<File[]>();

    /**
     * 削除イベント
     */
    @Output() onRemoveEvent = new EventEmitter<File[]>();


    /**
     * Changeイベント処理
     * @param event イベント
     */
    changeMultipleFile(event): void {
        // 複数選択不可の場合
        if (!this.multiple) {
            this.files = [];
        }
        // 選択したファイルを追加する
        this.files.push(...event.addedFiles);

        // コールバック関数を呼び出す
        this.onChangeEvent.emit(this.files);
    }

    /**
     * 削除イベント処理
     * @param event イベント
     */
    removeMultipleFile(event): void {
        // 削除
        this.files.splice(this.files.indexOf(event), 1);
        // コールバック関数を呼び出す
        this.onRemoveEvent.emit(this.files);
    }


    constructor() {
    }

    ngOnInit(): void {
    }

}
