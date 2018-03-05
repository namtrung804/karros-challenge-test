import {Component, ElementRef, Input, NgZone, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';
import {AlertService} from '../../services/alert.service';
import {Observable} from 'rxjs/Observable';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {Subject} from 'rxjs/Subject';
import {YelpService} from '../../services/yelp.service';
import {MapsAPILoader} from '@agm/core';
import {} from 'googlemaps';
import {Business} from '../../models/business';
import * as _ from 'lodash';
import {number} from 'ng2-validation/dist/number';

@Component({
  selector: 'main',
  templateUrl: 'main.component.html',
  styleUrls: ['../../../assets/css/search.css', '../../../assets/css/www-pkg.css'],
  encapsulation: ViewEncapsulation.None
})
export class MainComponent implements OnInit {
  dataForm: FormGroup;
  loading = false;
  validationMessages: any;
  public boxSearchPlace = new Subject<string>();
  @ViewChild('inputSearchPlace') inputSearchPlace: any;
  @ViewChild('inputSearchNear') inputSearchNear: any;
  listAutocomplete: any = [];
  isShowListAutocomplete: boolean = false;
  latitude: number = 34.101588;
  longitude: number = -118.333644;
  zoom: number = 4;
  listBusiness: Business[] = [];
  limitPerPage: number = 10;
  page: number = 0;
  totalBusiness: number = 0;

  constructor(private yelpService: YelpService,
              private router: Router,
              private route: ActivatedRoute,
              private alertService: AlertService,
              private formBuilder: FormBuilder,
              private elementRef: ElementRef,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone) {
  }

  ngOnInit() {
    // default value
    this.inputSearchNear.nativeElement.value = 'Hollywood Boulevard, Los Angeles, CA, USA';
    this.inputSearchPlace.nativeElement.value = 'Pho';
    // search place
    this.searchPlace();

    //set current position
    this.setCurrentPosition();

    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.inputSearchNear.nativeElement, {
        types: ['address']
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
          this.getDataBusiness();
        });
      });
    });
  }

  searchPlace() {
    this.boxSearchPlace.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe((value) => {
      this.listAutocomplete = [];
      if (value != '') {
        this.yelpService.autocomplete(value).subscribe(
          result => {
            if (result.categories.length) {
              for (let key in result.categories) {
                if (parseInt(key) != 0) {
                  this.listAutocomplete.push(result.categories[key].title);
                }
              }
            }
            if (result.terms.length) {
              for (let term of result.terms) {
                this.listAutocomplete.push(term.text);
              }
            }
          }
        )
      }
    });
  }

  setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
        this.getDataBusiness();
      });
    } else {
      this.mapsAPILoader.load().then(() => {
        let geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address': this.inputSearchNear.nativeElement.value}, (results, status) => {
          if (status == google.maps.GeocoderStatus.OK) {
            this.latitude = results[0].geometry.location.lat();
            this.longitude = results[0].geometry.location.lng();
            this.zoom = 12;
            this.getDataBusiness();
          }
        });
      });

    }
  }

  chosePlace(text: string) {
    this.inputSearchPlace.nativeElement.value = text;
    this.isShowListAutocomplete = false;
    this.getDataBusiness();
  }

  getDataBusiness(page: number = 0) {
    this.page = page;
    this.loading = true;
    this.totalBusiness = 0;
    let dataSearch = {
      term: this.inputSearchPlace.nativeElement.value,
      location: this.inputSearchNear.nativeElement.value,
      limit: this.limitPerPage,
      offset: page * this.limitPerPage
    }
    this.yelpService.getDataBusinessSearch(dataSearch).subscribe(
      result => {
        this.loading = false;
        if (result.businesses.length) {
          this.listBusiness = result.businesses;
          this.totalBusiness = result.total;
          this.latitude = result.region.center.latitude;
          this.longitude = result.region.center.longitude;
          this.zoom = 12;
        }
      },
      error => {
        this.loading = false;
      }
    )
  }

  getAddressShop(address: any) {
    if (address.length) {
      return address.join('<br>');
    }
    return '';
  }

  getNumberShop(num: number) {
    let position = this.page * this.limitPerPage + num + 1;
    return position.toString();

  }
}
