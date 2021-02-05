import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  constructor() { }


  firstRow = ['../../../assets/images/portrait/small/avatar-s-4.png',
    '../../../assets/images/portrait/small/avatar-s-5.png',
    '../../../assets/images/portrait/small/avatar-s-6.png'];
  secondRow = ['../../../assets/images/portrait/small/avatar-s-7.png',
    '../../../assets/images/portrait/small/avatar-s-8.png'];
  thirdRow = ['../../../assets/images/portrait/small/avatar-s-1.png',
    '../../../assets/images/portrait/small/avatar-s-2.png',
    '../../../assets/images/portrait/small/avatar-s-3.png'];
  fourthRow = ['../../../assets/images/portrait/small/avatar-s-11.png',
    '../../../assets/images/portrait/small/avatar-s-12.png'];
  fifthRow = ['../../../assets/images/portrait/small/avatar-s-6.png',
    '../../../assets/images/portrait/small/avatar-s-4.png'];
  rows = [
    {
      'type': 'danger', 'value': 85, 'product': 'iPhone X',
      'image': this.firstRow, 'buttonname': 'Mobile', 'amount': '$ 1200.00', 'bagde': '+8 more'
    },
    {
      'type': 'success', 'value': 75, 'product': 'iPad',
      'image': this.secondRow, 'buttonname': 'Teblet', 'amount': '$ 1190.00', 'bagde': '+5 more'
    },
    {
      'type': 'danger', 'value': 65, 'product': 'OnePlus',
      'image': this.thirdRow, 'buttonname': 'Mobile', 'amount': '$ 999.00', 'bagde': '+3 more'
    },
    {
      'type': 'success', 'value': 55, 'product': 'ZenPad',
      'image': this.fourthRow, 'buttonname': 'Teblet', 'amount': '$ 1150.00'
    },
    {
      'type': 'danger', 'value': 45, 'product': 'Pixel 2',
      'image': this.fifthRow, 'buttonname': 'Mobile', 'amount': '$ 1180.00'
    }
  ];

  ngOnInit(): void {
  }

}
