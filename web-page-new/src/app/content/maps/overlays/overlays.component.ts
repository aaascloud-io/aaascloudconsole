import { Component, OnInit, Input } from '@angular/core';
import { MapsAPILoader, LatLngLiteral } from '@agm/core';
import { NgBlockUI, BlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-overlays',
  templateUrl: './overlays.component.html',
  styleUrls: ['./overlays.component.css']
})
export class OverlaysComponent implements OnInit {

  @BlockUI('polylines') blockUIPolylines: NgBlockUI;
  @BlockUI('polygons') blockUIPolygons: NgBlockUI;

  options = {
    close: true,
    expand: true,
    minimize: true,
    reload: true
  };

  public lat = -12.046374;
  public lng =  -77.042793;
  public zoom: number;
  public polyline: Array<any>;
  public polylines: Array<any>;

  public breadcrumb: any;

  paths: Array<LatLngLiteral> = [
    { lat: -12.045374, lng: -77.041793 },
    { lat: -12.045985, lng: -77.035000 },
    { lat: -12.048374, lng: -77.043793 },
    { lat: -12.045374, lng: -77.046793 },
    { lat: -12.045374, lng: -77.041793 },
  ];
  multiPaths: Array<Array<LatLngLiteral>> = [[
    { lat: -12.045374, lng: -77.041793 },
    { lat: -12.045985, lng: -77.035000 },
    { lat: -12.048374, lng: -77.043793 },
    { lat: -12.045374, lng: -77.046793 },
    { lat: -12.045374, lng: -77.041793 },
  ],
  [
    { lat: -12.045374, lng: -77.031793 },
    { lat: -12.045985, lng: -77.025000 },
    { lat: -12.048374, lng: -77.033793 },
    { lat: -12.045374, lng: -77.036793 },
    { lat: -12.045374, lng: -77.031793 },
  ]
  ];

  constructor(
    private mapsAPILoader: MapsAPILoader,
  ) { }

  ngOnInit() {
    this.breadcrumb = {
      'mainlabel': 'gmaps - Overlays',
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
          'name': 'Overlays',
          'isLink': false
        }
      ]
    };

    // set google maps defaults
    this.zoom = 15;
    this.lat = -12.046374;
    this.lng = -77.042793;

    this.polyline = [
      {
        latitude: -12.045374,
        longitude: -77.041793
      },
      {
        latitude: -12.045985,
        longitude: -77.035000
      },
      {
        latitude: -12.048374,
        longitude: -77.043793
      },
      {
        latitude: -12.045374,
        longitude: -77.046793
      },
    ];
    this.polylines = this.rebuildPolylines();

    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {

    });
  }
  private rebuildPolylines() {
    this.polylines = [];
    let newPolyline;
    for (let i = 0; i < this.polyline.length; i++) {
      newPolyline = {
        latitude: this.polyline[i].latitude,
        longitude: this.polyline[i].longitude,
        path: [],
        label: '',
        color: 'blue'
      };
      let pre;
      if (i !== 0) {
        pre = {
          latitude: this.polyline[i - 1].latitude,
          longitude: this.polyline[i - 1].longitude
        };
      }
      if (pre && this.polyline[i]) {
        newPolyline.path.push(pre);
        const cur = {
          latitude: this.polyline[i].latitude,
          longitude: this.polyline[i].longitude
        };
        newPolyline.path.push(cur);
      }
      this.polylines.push(newPolyline);
    }
    console.log(this.polylines);
    return this.polylines;
  }

  reloadPolylines() {
    this.blockUIPolylines.start('Loading..');

    setTimeout(() => {
      this.blockUIPolylines.stop();
    }, 2500);
  }

  reloadPolygons() {
    this.blockUIPolygons.start('Loading..');

    setTimeout(() => {
      this.blockUIPolygons.stop();
    }, 2500);
  }

}
