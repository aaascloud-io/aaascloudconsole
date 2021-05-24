import {Component, Injectable, OnInit} from '@angular/core';
import {TreeNode} from 'primeng/api';
import {HttpService} from 'src/app/_services/HttpService';

// const formInputData = require('../../../assets/data/forms/form-elements/form-inputs.json');
// const selectData = require('../../../assets/data/forms/form-elements/select.json');

@Component({
    selector: 'app-simcard',
    templateUrl: './simcard.component.html',
    styleUrls: ['./simcard.component.css']
})

@Injectable()
export class SimcardComponent implements OnInit {

    cols: any[];
    cardinofs: TreeNode[];

    constructor(
        private httpService: HttpService,
    ) {
    }


    ngOnInit(): void {
        this.cols = [
            {field: 'no', header: '番号'},
            {field: 'ukeirebi', header: '受入日'},
            {field: 'kubun', header: '区分'},
            {field: 'imei', header: 'IMEI'},
            {field: 'kanribango', header: '管理番号'},
            {field: 'tenwabango', header: '電話番号'},
            {field: 'hakkotanto', header: '発行担当'},
            {field: 'hakkobi', header: '発行日'},
            {field: 'hakkosaki', header: '発行先'},
            {field: 'hakkosakitantosha', header: '発行先担当者'},
            {field: 'renrakusen', header: '連絡先'},
            {field: 'riyokaishibi', header: '利用開始日'},
        ];

        let param = {};

        this.httpService.usePostII('card/list', param).then((result) => {
            console.log('aaaaaa');
            console.log(result);
            this.cardinofs = result.list;
        }).catch((err) => {
            console.error(err);
        });


    }

    private testData(): void {
        this.cardinofs = [
            {
                data: {
                    no: '1', ukeirebi: '2021-05-24',
                    kubun: '1', imei: 'imei',
                    kanribango: '01', tenwabango: '08012345678',
                    hakkotanto: '01', hakkobi: '2021-05-24',
                    hakkosaki: '01', hakkosakitantosha: 'A01',
                    renrakusen: 'test', riyokaishibi: '2021-05-24'
                },
            },
            {
                data: {
                    no: '2', ukeirebi: '2021-05-24',
                    kubun: '1', imei: 'imei2',
                    kanribango: '02', tenwabango: '08012345678',
                    hakkotanto: '02', hakkobi: '2021-05-24',
                    hakkosaki: '02', hakkosakitantosha: 'A02',
                    renrakusen: 'test02', riyokaishibi: '2021-05-24'
                },
            },
        ];
    }


}
