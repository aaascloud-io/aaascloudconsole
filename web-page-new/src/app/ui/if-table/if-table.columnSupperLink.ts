/**
 * イベント
 */
interface IfEventCallback extends EventListener {
    // (evt: Event): void;
    (evt: Event, row: any, option?: any): void;
}

/**
 * イベントとパラメータ定義
 */
interface IfEventListener {
    event: IfEventCallback;
    option?: any;
}

/**
 * スーパーリンクカラム情報
 */
export interface IfTableColumnSupperLink {
    // 列名
    column: string;
    class: string;
    title?: string;
    text?: string;
    onClicked?: IfEventListener;
}