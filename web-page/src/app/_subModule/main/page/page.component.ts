import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataFatoryService } from 'src/app/_shareModule/service/DataFatoryService';
@Component({
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {

  constructor(private router: Router, private dataFatoryService: DataFatoryService) { }

  ngOnInit() {
    ///console.log('PageComponent is work');
    ///console.log('this.dataFatoryService.routleSel', this.dataFatoryService.getPageFlg());
    if (this.dataFatoryService.getPageFlg() === 'version') {
      this.router.navigate(['main/page/version']);

    } else {
      this.router.navigate(['main/page/dashboard']);
    }
  }

}
