import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    OnInit,
    Output
} from '@angular/core';

@Component({
    selector: 'ifcs-supper-link',
    templateUrl: './ifcs-supper-link.component.html',
    styleUrls: ['./ifcs-supper-link.component.css']
})
export class IfcsSupperLinkComponent implements OnInit, AfterViewInit {
    // タイトル
    _title: string;
    // スタイル
    _class: string;
    // 表示内容
    _text: string;


    // _click: EventListener;

    /**
     * タイトル属性
     * @param v 指定したタイトル
     */
    @Input()
    set title(v: string) {
        if (!v) {
            return;
        }
        this._title = v;
    }

    /**
     * スタイル属性
     * @param v 指定したスタイル
     */
    @Input()
    set class(v: string) {
        if (!v) {
            return;
        }
        this._class = v;
    }

    /**
     * 内容属性
     * @param v 指定した表示内容
     */
    @Input()
    set text(v: string) {
        if (!v) {
            return;
        }
        this._text = v;
    }


    constructor(
        // private elementRef: ElementRef
    ) {
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        // // イベントバンディング
        // this.elementRef.nativeElement.querySelector('a')
        //     .addEventListener('click', this._click.bind(this));
    }

}
