import { Component, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { GoogleMapsAPIWrapper } from '@agm/core';
import { GoogleMap } from '@agm/core/services/google-maps-types';
import { NgBlockUI, BlockUI } from 'ng-block-ui';

declare let google: any;

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css']
})
export class RoutesComponent implements OnChanges, OnInit {

  @BlockUI('routes') blockUIRoutes: NgBlockUI;
  @BlockUI('routesAdvance') blockUIRoutesAdvance: NgBlockUI;

  options = {
    close: true,
    expand: true,
    minimize: true,
    reload: true
  };

  public lat = -12.045374;
  public lng =  -77.042793;

  origin = { lat: -12.045374, lng: -77.042793 };
  destination = { lat: -12.045374, lng: -76.050793 };

  @Output() status: EventEmitter<string> = new EventEmitter<string>();
  @Output() addressChanged: EventEmitter<any> = new EventEmitter();

  showList: boolean;
  waypoints: any = [];
  renderOptions: any;
  zoom = 15;
  panel: object | undefined;
  renderRoute: any;
  visible: Boolean = true;
  markerOptions: { origin: any, destination: any, waypoints: any };
  routeDetail = [];
  routeArray: any;
  public directionsService: any = undefined;
  public directionsDisplay: any = undefined;
  clickOnStartTravel = false;
  private originMarker: any;
  private destinationMarker: any;
  private waypointsMarker: any = [];

  isFirstChange: Boolean = true;

  public breadcrumb: any;

  constructor(private gmapsApi: GoogleMapsAPIWrapper) { }

  ngOnInit() {
    this.breadcrumb = {
      'mainlabel': 'gmaps - Routes',
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
          'name': 'Routes',
          'isLink': false
        }
      ]
    };

    if (this.visible === true) {
      this.directionDraw();
    }
  }

  ngOnChanges(obj: any) {
    /**
     * When visible is false then remove the direction layer
     */
    if (!this.visible) {
      try {
        if (typeof this.originMarker !== 'undefined') {
          this.originMarker.setMap(null);
          this.destinationMarker.setMap(null);
          this.waypointsMarker.forEach((w: any) => w.setMap(null));
        }
        this.directionsDisplay.setPanel(null);
        this.directionsDisplay.setMap(null);
        this.directionsDisplay = undefined;
      } catch (e) { }
    } else {
      if (this.isFirstChange) {
        /**
         * When visible is false at the first time
         */
        if (typeof this.directionsDisplay === 'undefined') {
          this.directionDraw();
        }
        this.isFirstChange = false;
        return;
      }

      /**
       * When renderOptions are not first change then reset the display
       */
      if (typeof obj.renderOptions !== 'undefined') {
        if (obj.renderOptions.firstChange === false) {
          if (typeof this.originMarker !== 'undefined') {
            this.originMarker.setMap(null);
            this.destinationMarker.setMap(null);
            this.waypointsMarker.forEach((w: any) => w.setMap(null));
          }
          this.directionsDisplay.setPanel(null);
          this.directionsDisplay.setMap(null);
          this.directionsDisplay = undefined;
        }
      }
      this.directionDraw();
    }

  }

  private directionDraw() {
    this.gmapsApi.getNativeMap().then((map: GoogleMap) => {
      if (typeof this.directionsDisplay === 'undefined') {
        this.directionsDisplay = new google.maps.DirectionsRenderer(this.renderOptions);
        this.directionsDisplay.setMap(map);
        this.directionsDisplay.addListener('directions_changed', () => {
          this.addressChanged.emit(this.directionsDisplay.getDirections());
        });
      }
      if (typeof this.directionsService === 'undefined') {
        this.directionsService = new google.maps.DirectionsService;
      }
      if (typeof this.panel === 'undefined') {
        this.directionsDisplay.setPanel(null);
      } else {
        this.directionsDisplay.setPanel(this.panel);
      }
      // Render exist direction
      if (typeof this.renderRoute === 'object' && this.renderRoute !== null) {
        this.directionsDisplay.setDirections(this.renderRoute);
        this.renderRoute = null; // or set undefined, ''
      } else {

        this.directionsService.route({
          origin: this.origin,
          destination: this.destination,
          travelMode: 'DRIVING',
          transitOptions: undefined,
          drivingOptions: undefined,
          waypoints: [],
          optimizeWaypoints: true,
          provideRouteAlternatives: false,
          avoidHighways: false,
          avoidTolls: false,
        }, (response: any, status: any) => {
          this.onResponse(response);
        });
      }
    });
  }

  public onResponse(event: any) {
    this.routeDetail.push(event);
    this.routeArray = this.routeDetail[0].routes[0].legs[0].steps;
  }

  startInstructions() {
    this.clickOnStartTravel = true;
  }

  reloadRoutes() {
    this.blockUIRoutes.start('Loading..');

    setTimeout(() => {
      this.blockUIRoutes.stop();
    }, 2500);
  }

  reloadRoutesAdvance() {
    this.blockUIRoutesAdvance.start('Loading..');

    setTimeout(() => {
      this.blockUIRoutesAdvance.stop();
    }, 2500);
  }

}
