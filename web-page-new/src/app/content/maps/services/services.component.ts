import { Component, OnInit, ChangeDetectorRef, NgZone, ViewChild, ElementRef } from '@angular/core';
import { GeocodingService } from '../../../_services/geocoding.service';
import { MapsAPILoader } from '@agm/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgBlockUI, BlockUI } from 'ng-block-ui';

declare let google: any;

export interface Location {
  lat: number;
  lng: number;
}
@Component({

  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {

  @BlockUI('geolocation') blockUIGeolocation: NgBlockUI;
  @BlockUI('geocoding') blockUIGeocoding: NgBlockUI;

  options = {
    close: true,
    expand: true,
    minimize: true,
    reload: true
  };

  public latitude = -12.046374;
  public longitude = -77.042793;
  public lat = -12.046374;
  public lng = -77.042793;
  zoom = 12;
  dragMarker = '';
  address: any;
  location: Location;
  loading: boolean;
  public breadcrumb: any;
  public searchControl: FormControl;

  markers: Marker[] = [];
  myGroup: FormGroup;


  @ViewChild('search') public searchElementRef: ElementRef;

  constructor(
    private geocodeService: GeocodingService,
    private ref: ChangeDetectorRef,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) { }

  public ngOnInit() {
    this.breadcrumb = {
      'mainlabel': 'gmaps - Services',
      'links': [
        {
          'name': 'Home',
          'isLink': true,
          'link': '/dashboard/sales'
        },
        {
          'name': 'gmaps',
          'isLink': true,
          'link': ''
        },
        {
          'name': 'Services',
          'isLink': false
        }
      ]
    };

    this.searchControl = new FormControl();
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ['(regions)']
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          const place = autocomplete.getPlace();

          this.geocodeService.geocodeAddress(place.name)
            .subscribe((location: Location) => {
              this.markers.push({
                lat: location.lat,
                lng: location.lng,
                label: this.dragMarker
              });
              this.lat = location.lat;
              this.lng = location.lng;
              this.ref.detectChanges();
            });
        });
      });
    });
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: Position) => {
        if (position) {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
        }
      },
        (error: PositionError) => console.log(error));
    } else {
      window.alert('Geolocation is not supported by this browser.');
    }
  }

  reloadGeolocation() {
    this.blockUIGeolocation.start('Loading..');

    setTimeout(() => {
      this.blockUIGeolocation.stop();
    }, 2500);
  }

  reloadGeocoding() {
    this.blockUIGeocoding.start('Loading..');

    setTimeout(() => {
      this.blockUIGeocoding.stop();
    }, 2500);
  }
}

export interface Marker {
  lat: number;
  lng: number;
  label: string;
}

