import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bg-image',
  templateUrl: './bg-image.component.html',
  styleUrls: ['./bg-image.component.css']
})
export class BgImageComponent implements OnInit {

  text: any = {
    Weeks: 'Weeks',
    Days: 'Days',
    Hours: 'Hours',
    Minutes: 'Minutes',
    Seconds: 'Seconds',
  };

  ngOnInit() {
  }

}
