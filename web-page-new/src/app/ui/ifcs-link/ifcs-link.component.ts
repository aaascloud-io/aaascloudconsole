import {
    Component,
    Input,
    OnInit,
    Output,
    EventEmitter
} from '@angular/core';


@Component({
    selector: 'ifcs-link',
    templateUrl: './ifcs-link.component.html',
    styleUrls: ['./ifcs-link.component.css']
})
export class IfcsLinkComponent implements OnInit {

    /**
     * ラベル
     */
    @Input() label: string;

    /**
     * スタイル
     */
    @Input() linkClass: string | string[] | Set<string> | { [klass: string]: any; }

    /**
     * イコンスタイル
     */
    @Input() iconClass: string | string[] | Set<string> | { [klass: string]: any; }

    /**
     * クリックイベント
     */
    @Output() clickEvent = new EventEmitter<MouseEvent>();


    constructor() {
    }

    ngOnInit(): void {
    }

    /**
     * クリックイベント
     * @param event イベント
     */
    onClick(event): void {
        this.clickEvent.emit(event);
    }

}