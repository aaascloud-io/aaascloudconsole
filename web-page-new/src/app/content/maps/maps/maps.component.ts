import { Component, OnInit } from '@angular/core';
import { MouseEvent } from '@agm/core';
import { NgBlockUI, BlockUI } from 'ng-block-ui';

interface Marker {
  lat: number;
  lng: number;
  label: string;
}

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {

  @BlockUI('basicMap') blockUIBasicMap: NgBlockUI;
  @BlockUI('mapEvents') blockUIMapEvents: NgBlockUI;

  public zoom: number;
  public breadcrumb: any;
  options = {
    close: true,
    expand: true,
    minimize: true,
    reload: true
  };
  lat = -12.046374;
  lng =  -77.042793;
  markers: Marker[] = [
    {
      lat: this.lat,
      lng: this.lng,
      label: 'A'
    },
    {
      lat: this.lat + 0.004,
      lng: this.lng + 0.004,
      label: 'B'
    },
    {
      lat: this.lat - 0.004,
      lng: this.lng - 0.004,
      label: 'C'
    }
  ];

  constructor() { }

  ngOnInit() {
    this.breadcrumb = {
      'mainlabel': 'gmaps - Basic Maps',
      'links': [
        {
          'name': 'Home',
          'isLink': true,
          'link': '/dashboard/sales'
        },
        {
          'name': 'gmaps',
          'isLink': true,
          'link': '#'
        },
        {
          'name': 'Basic Maps',
          'isLink': false
        }
      ]
    };

    this.zoom = 15;
  }

  mapClicked($event: MouseEvent) {
    window.alert('click');
    console.log('Clicked', $event);
  }

  reloadBasicMap() {
    this.blockUIBasicMap.start('Loading..');

    setTimeout(() => {
      this.blockUIBasicMap.stop();
    }, 2500);
  }

  reloadMapEvents() {
    this.blockUIMapEvents.start('Loading..');

    setTimeout(() => {
      this.blockUIMapEvents.stop();
    }, 2500);
  }
}
