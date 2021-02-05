import { Component, OnInit } from '@angular/core';
import { NgBlockUI, BlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-tooltips',
  templateUrl: './tooltips.component.html',
  styleUrls: ['./tooltips.component.css']
})
export class TooltipsComponent implements OnInit {

  @BlockUI('staticDemo') blockUIStaticDemo: NgBlockUI;
  @BlockUI('tooltipPositions') blockUITooltipPositions: NgBlockUI;

  public breadcrumb: any;

  options = {
    close: true,
    expand: true,
    minimize: true,
    reload: true
  };
  constructor() { }

  ngOnInit() {
    this.breadcrumb = {
      'mainlabel': 'Tooltip',
      'links': [
        {
          'name': 'Home',
          'isLink': true,
          'link': '/dashboard/sales'
        },
        {
          'name': 'Component',
          'isLink': true,
          'link': '#'
        },
        {
          'name': 'Tooltip',
          'isLink': false
        }
      ]
    };
  }

  tooltipShowEvent() {
    alert('Show event fired.');
  }

  tooltipShownEvent() {
    alert('Shown event fired.');
  }

  tooltipHideEvent() {
    alert('Hide event fired.');
  }

  tooltipHiddenEvent() {
    alert('Hidden event fired.');
  }

  doAlert() {
    console.log('<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>');
  }

  reloadStaticDemo() {
    this.blockUIStaticDemo.start('Loading..');

    setTimeout(() => {
      this.blockUIStaticDemo.stop();
    }, 2500);
  }

  reloadTooltipPositions() {
    this.blockUITooltipPositions.start('Loading..');

    setTimeout(() => {
      this.blockUITooltipPositions.stop();
    }, 2500);
  }


}
