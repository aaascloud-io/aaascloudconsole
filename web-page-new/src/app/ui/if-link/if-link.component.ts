import {
    Component,
    Input,
    OnInit,
    Output,
    EventEmitter
} from '@angular/core';


@Component({
    selector: 'app-if-link',
    templateUrl: './if-link.component.html',
    styleUrls: ['./if-link.component.css']
})
export class IfLinkComponent implements OnInit {

    /**
     * ラベル
     */
    @Input() label: string;

    /**
     * スタイル
     */
    @Input() class: string | string[] | Set<string> | { [klass: string]: any; }

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
