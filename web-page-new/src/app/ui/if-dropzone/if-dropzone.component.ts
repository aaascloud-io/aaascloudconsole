import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';


@Component({
    selector: 'app-if-dropzone',
    templateUrl: './if-dropzone.component.html',
    styleUrls: ['./if-dropzone.component.css']
})
export class IfDropzoneComponent implements OnInit {

    files: File[] = [];
    // files: any;

    @Input() multiple: boolean;
    @Input() label: string;

    /**
     * Changeイベント
     */
    @Output() onChangeEvent = new EventEmitter<File[]>();
    @Output() onRemoveEvent = new EventEmitter<File[]>();


    changeMultipleFile(event) {
        if (!this.multiple){
            this.files = [];
        }
        this.files.push(...event.addedFiles);
        this.onChangeEvent.emit(this.files);
    }

    removeMultipleFile(event) {
        this.files.splice(this.files.indexOf(event), 1);
        this.onRemoveEvent.emit(this.files);
    }


    constructor() {
    }

    ngOnInit(): void {
    }

}
