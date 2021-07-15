import {Component, Input, OnInit} from '@angular/core';
import {IfcsBadgeComponent} from "../ifcs-badge/ifcs-badge.component";

@Component({
  selector: 'app-ifcs-media-button',
  templateUrl: './ifcs-media-button.component.html',
  styleUrls: ['./ifcs-media-button.component.css']
})
export class IfcsMediaButtonComponent extends IfcsBadgeComponent{

  /**
   * メモ（説明文）
   */
  @Input() memo: string;
  

  constructor() {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

}
