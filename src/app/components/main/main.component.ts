import {Component, ElementRef, Input, NgZone, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'moment';
import {UserService} from '../../services/user.service';
import {AuthenticationService} from '../../services/authentication.service';
import {AlertService} from '../../services/alert.service';
import {ValidationService} from '../../services/validation.service';
import {AppComponent} from '../app.component';

import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {LocalStoreManagerService} from '../../services/local-store-manager.service';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {Subject} from 'rxjs/Subject';
import {YelpService} from '../../services/yelp.service';
import {MapsAPILoader} from '@agm/core';
import {} from 'googlemaps';
import {Business} from '../../models/business';

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
        // default
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
            debounceTime(500),
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
        // if ('geolocation' in navigator) {
        //     navigator.geolocation.getCurrentPosition((position) => {
        //         this.latitude = position.coords.latitude;
        //         this.longitude = position.coords.longitude;
        //         this.zoom = 12;
        //         this.getDataBusiness();
        //     });
        // } else {
        debugger
            let geocoder = new google.maps.Geocoder();
            geocoder.geocode({'address': this.inputSearchNear.nativeElement.value}, function (results, status) {
                debugger
                // if (status == google.maps.GeocoderStatus.OK) {
                //
                //     //In this case it creates a marker, but you can get the lat and lng from the location.LatLng
                //     map.setCenter(results[0].geometry.location);
                //     var marker = new google.maps.Marker({
                //         map: map,
                //         position: results[0].geometry.location
                //     });
                // } else {
                //     alert('Geocode was not successful for the following reason: ' + status);
                // }
            });
        // }
    }

    chosePlace(text: string) {
        this.inputSearchPlace.nativeElement.value = text;
        this.getDataBusiness();
    }

    getDataBusiness() {
        let dataSearch = {
            term: this.inputSearchPlace.nativeElement.value,
            latitude: this.latitude,
            longitude: this.longitude,
            limit: 10
        }
        this.yelpService.getDataBusinessSearch(dataSearch).subscribe(
            result => {
                if (result.businesses.length) {
                    this.listBusiness = result.businesses;
                    console.log(this.listBusiness);
                }
            },
            error => {

            }
        )
    }
}
