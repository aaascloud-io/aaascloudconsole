/**
 * カスタマイズカラム情報
 */
export interface IfTableColumnCustom {
    // 列名
    column: string;
    // 編集可否
    edit: boolean;
    // 削除可否
    delete: boolean;
    // config:{
    //
    // }
}