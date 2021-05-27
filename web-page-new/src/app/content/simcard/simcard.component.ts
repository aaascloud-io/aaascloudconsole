import {
    Component,
    Injectable,
    OnInit
} from '@angular/core';
import {TreeNode} from 'primeng/api';
import {HttpService} from 'src/app/_services/HttpService';


@Component({
    selector: 'app-simcard',
    templateUrl: './simcard.component.html',
    styleUrls: ['./simcard.component.css']
})

@Injectable()
export class SimcardComponent implements OnInit {
    cardInfos: TreeNode[];



    constructor(
        private httpService: HttpService,
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

    onDeleteRow(item): void {
        alert('delete');
        console.log(item);
    }

    onEditRow(item): void {
        alert('edit');
        console.log(item);
    }

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
