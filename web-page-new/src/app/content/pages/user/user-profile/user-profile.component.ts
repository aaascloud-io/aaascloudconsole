import { Component, OnInit } from '@angular/core';
import { EChartOption } from 'echarts';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { ChartApiService } from '../../../../_services/chart.api';
import { Image } from 'angular2_photoswipe';
interface Marker {
  lat: number;
  lng: number;
  label: string;
}

const hours = ['12a', '1a', '2a', '3a', '4a', '5a', '6a',
  '7a', '8a', '9a', '10a', '11a',
  '12p', '1p', '2p', '3p', '4p', '5p',
  '6p', '7p', '8p', '9p', '10p', '11p'];

const days = ['Saturday', 'Friday', 'Thursday',
  'Wednesday', 'Tuesday', 'Monday', 'Sunday'];

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})

export class UserProfileComponent implements OnInit {
  data: any;
  option: any;
  image1: Image;
  image2: Image;
  image3: Image;
  image4: Image;
  image5: Image;
  image6: Image;
  image7: Image;
  image8: Image;
  image9: Image;
  image10: Image;
  image11: Image;
  image12: Image;
  public zoom = 15;
  end: any;

  @BlockUI('projectWorkOne') blockUIProjectWorkOne: NgBlockUI;
  @BlockUI('sofiaOrav') blockUISofiaOrav: NgBlockUI;
  @BlockUI('sofiaOravTwo') blockUISofiaOravTwo: NgBlockUI;

  lat = 40.650002;
  lng = -73.949997;

  options = {
    close: false,
    expand: true,
    minimize: false,
    reload: true
  };

  markers: Marker[] = [
    {
      lat: this.lat,
      lng: this.lng,
      label: ''
    }
  ];
  constructor(private chartApiservice: ChartApiService) { }
  chartOption: EChartOption = {
    // grid: {
    //   x: 40,
    //   x2: 40,
    //   y: 45,
    //   y2: 25
    // },

    // Add tooltip
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // Axis indicator axis trigger effective
        type: 'shadow'        // The default is a straight line, optionally: 'line' | 'shadow'
      }
    },

    // Add legend
    legend: {
      data: ['Direct access', 'Email marketing', 'Advertising alliance', 'Video ads',
        'Search engine', 'Google', 'Safari', 'Opera', 'Firefox']
    },

    // Add custom colors
    color: ['#666EE8', '#FF9149', '#FF9966', '#FA8E57', '#FF637b', '#5175E0', '#A147F0', '#28D094', '#BABFC7'],

    // // Enable drag recalculate
    // calculable: true,
    xAxis: [
      {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [

      {
        name: 'Direct access',
        type: 'bar',
        data: [320, 332, 301, 334, 390, 330, 320]
      },
      {
        name: 'Email marketing',
        type: 'bar',
        stack: 'advertising',
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: 'Advertising alliance',
        type: 'bar',
        stack: 'advertising',
        data: [220, 182, 191, 234, 290, 330, 310]
      },
      {
        name: 'Video ads',
        type: 'bar',
        stack: 'advertising',
        data: [150, 232, 201, 154, 190, 330, 410]
      },
      {
        name: 'Search Engine',
        type: 'bar',
        stack: 'Total',
        data: [862, 1018, 964, 1026, 1679, 1600, 1570],
      },
      {
        name: 'Google',
        type: 'bar',
        barWidth: 12,
        stack: 'search engine',
        data: [620, 732, 701, 734, 1090, 1130, 1120]
      },
      {
        name: 'Safari',
        type: 'bar',
        stack: 'search engine',
        data: [120, 132, 101, 134, 290, 230, 220]
      },
      {
        name: 'Opera',
        type: 'bar',
        stack: 'search engine',
        data: [60, 72, 71, 74, 190, 130, 110]
      },
      {
        name: 'Firefox',
        type: 'bar',
        stack: 'search engine',
        data: [62, 82, 91, 84, 109, 110, 120]
      }
    ]
  };
  getChordchart() {
  this.option = {
    title: {
      text: 'Punch Card of Github',
      link: 'https://github.com/pissang/echarts-next/graphs/punch-card'
    },
    legend: {
      data: ['Punch Card'],
      left: 'right'
    },
    polar: {},
    tooltip: {
      formatter: function (params) {
        return params.value[2] + ' commits in ' + hours[params.value[1]] + ' of ' + days[params.value[0]];
      }
    },
    angleAxis: {
      type: 'category',
      data: hours,
      boundaryGap: false,
      splitLine: {
        show: true,
        lineStyle: {
          color: '#999',
          type: 'dashed'
        }
      },
      axisLine: {
        show: false
      }
    },
    radiusAxis: {
      type: 'category',
      data: days,
      axisLine: {
        show: false
      },
      axisLabel: {
        rotate: 45
      }
    },
    series: [{
      name: 'Punch Card',
      type: 'scatter',
      coordinateSystem: 'polar',
      symbolSize: function (val) {
        return val[2] * 2;
      },
      data: this.data['punchdata'].data,
      animationDelay: function (idx) {
        return idx * 5;
      }
    }]
  };
  }
  ngOnInit() {
    this.image1 = new Image();
    this.image1.largeUrl = '../../../../../assets/images/gallery/1.jpg';
    this.image1.height = 3296;
    this.image1.width = 4934;
    this.image1.id = 0;
    this.image1.size = `${this.image1.width}x${this.image1.height}`;
    this.image1.thumbUrl = '../../../../../assets/images/gallery/1.jpg';
    this.image1.description = 'hello world';
    this.image1.author = 'David Wollschlegel';
    this.image2 = new Image();
    this.image2.largeUrl = '../../../../../assets/images/gallery/2.jpg';
    this.image2.height = 3296;
    this.image2.width = 4934;
    this.image2.id = 1;
    this.image2.size = `${this.image2.width}x${this.image2.height}`;
    this.image2.thumbUrl = '../../../../../assets/images/gallery/2.jpg';
      this.image3 = new Image();
    this.image3.largeUrl = '../../../../../assets/images/gallery/3.jpg';
    this.image3.height = 3296;
    this.image3.width = 4934;
    this.image3.id = 2;
    this.image3.size = `${this.image2.width}x${this.image2.height}`;
    this.image3.thumbUrl = '../../../../../assets/images/gallery/3.jpg';
    this.image4 = new Image();
    this.image4.largeUrl = '../../../../../assets/images/gallery/4.jpg';
    this.image4.height = 296;
    this.image4.width = 934;
    this.image4.id = 3;
     this.image4.size = `${this.image4.width}x${this.image4.height}`;
    this.image4.thumbUrl = '../../../../../assets/images/gallery/4.jpg';
    this.image5 = new Image();
    this.image5.largeUrl = '../../../../../assets/images/gallery/6.jpg';
    this.image5.height = 296;
    this.image5.width = 934;
    this.image5.id = 4;
     this.image5.size = `${this.image5.width}x${this.image5.height}`;
    this.image5.thumbUrl = '../../../../../assets/images/gallery/5.jpg';
    this.image6 = new Image();
    this.image6.largeUrl = '../../../../../assets/images/gallery/6.jpg';
    this.image6.height = 296;
    this.image6.width = 934;
    this.image6.id = 5;
     this.image6.size = `${this.image6.width}x${this.image6.height}`;
    this.image6.thumbUrl = '../../../../../assets/images/gallery/6.jpg';
    this.image7 = new Image();
    this.image7.largeUrl = '../../../../../assets/images/gallery/7.jpg';
    this.image7.height = 296;
    this.image7.width = 934;
    this.image7.id = 6;
     this.image7.size = `${this.image7.width}x${this.image7.height}`;
    this.image7.thumbUrl = '../../../../../assets/images/gallery/7.jpg';
    this.image8 = new Image();
    this.image8.largeUrl = '../../../../../assets/images/gallery/8.jpg';
    this.image8.height = 296;
    this.image8.width = 934;
    this.image8.id = 7;
     this.image8.size = `${this.image8.width}x${this.image8.height}`;
    this.image8.thumbUrl = '../../../../../assets/images/gallery/8.jpg';
    this.image9 = new Image();
    this.image9.largeUrl = '../../../../../assets/images/gallery/9.jpg';
    this.image9.height = 296;
    this.image9.width = 934;
    this.image9.id = 8;
     this.image9.size = `${this.image9.width}x${this.image9.height}`;
    this.image9.thumbUrl = '../../../../../assets/images/gallery/9.jpg';
    this.image10 = new Image();
    this.image10.largeUrl = '../../../../../assets/images/gallery/10.jpg';
    this.image10.height = 296;
    this.image10.width = 934;
    this.image10.id = 9;
     this.image10.size = `${this.image10.width}x${this.image10.height}`;
    this.image10.thumbUrl = '../../../../../assets/images/gallery/10.jpg';
    this.image11 = new Image();
    this.image11.largeUrl = '../../../../../assets/images/gallery/11.jpg';
    this.image11.height = 296;
    this.image11.width = 934;
    this.image11.id = 10;
     this.image11.size = `${this.image11.width}x${this.image11.height}`;
    this.image11.thumbUrl = '../../../../../assets/images/gallery/11.jpg';
    this.image12 = new Image();
    this.image12.largeUrl = '../../../../../assets/images/gallery/12.jpg';
    this.image12.height = 296;
    this.image12.width = 934;
    this.image12.id = 11;
     this.image12.size = `${this.image12.width}x${this.image12.height}`;
    this.image12.thumbUrl = '../../../../../assets/images/gallery/12.jpg';
    this.zoom = 15;
      this.chartApiservice.getTimelineData().subscribe(Response => {
      this.data = Response;
      this.getChordchart();
      });
  }

  reloadProjectWorkOne() {
    this.blockUIProjectWorkOne.start('Loading..');

    setTimeout(() => {
      this.blockUIProjectWorkOne.stop();
    }, 2500);
  }

  reloadSofiaOrav() {
    this.blockUISofiaOrav.start('Loading..');

    setTimeout(() => {
      this.blockUISofiaOrav.stop();
    }, 2500);
  }

  reloadSofiaOravTwo() {
    this.blockUISofiaOravTwo.start('Loading..');

    setTimeout(() => {
      this.blockUISofiaOravTwo.stop();
    }, 2500);
  }

}
