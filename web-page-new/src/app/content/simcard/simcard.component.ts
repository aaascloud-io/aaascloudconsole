import {
    AfterViewInit,
    Component, ElementRef,
    Injectable,
    OnInit, TemplateRef, ViewChild
} from '@angular/core';
import {TreeNode} from 'primeng/api';
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


    constructor(
        private modal: NgbModal,
        private elementRef: ElementRef,
        private httpService: HttpService,
        private modalService: IfModalService,
    ) {
    }

    ngOnInit(): void {
        let param = {};
        this.httpService.usePostII('card/list', param).then((result) => {
            console.log(result);
            this.cardInfos = result.list;
        }).catch((err) => {
            console.error(err);
        });

    }

    ngAfterViewInit(): void {
    }

    onDeleteRow(item): void {
        alert('delete');
        console.log(item);
    }

    onEditRow(item): void {
        alert('edit');
        console.log(item);
    }

    openNewModal() {
        this.modalService.open("modalA");
    }

    onAddDialogOKClick(event) {
        // const control = document.querySelector("app-if-input[name='imei']");
        // const control = document.querySelector("#imei");
        const control = document.querySelector("#imei").querySelector("input");
        const input: HTMLInputElement = control as HTMLInputElement;
        input.focus();
        // input.select();

        // imei
        if (this.pageModel.simCard.imei === "123456") {
            this.modalService.close("modalA");
        }

        // setTimeout(()=>{ // this will make the execution after the above boolean has changed
        //     this.test2F.nativeElement.focus();
        // },0);
    }

    onAddDialogCloseClick() {
        console.log("onAddDialogCloseClick");
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
