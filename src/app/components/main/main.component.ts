import {Component, ElementRef, HostListener, Inject, Input, NgZone, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
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
import {PageScrollInstance, PageScrollService} from 'ng2-page-scroll';
import {DOCUMENT} from '@angular/common';

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
    latitude: number = 0;
    longitude: number = 0;
    latitudeTemp: number = 0;
    longitudeTemp: number = 0;
    zoom: number = 12;
    listBusiness: Business[] = [];
    selectedBusiness: Business;
    limitPerPage: number = 10;
    page: number = 0;
    totalBusiness: number = 10;
    bigSizeMap: boolean = false;
    positionInfoWindowTop: number = 0;
    positionInfoWindowLeft: number = 0;
    filter: any = {
        sort_by: 'best_match',
    }

    constructor(private yelpService: YelpService,
                private router: Router,
                private route: ActivatedRoute,
                private alertService: AlertService,
                private formBuilder: FormBuilder,
                private elementRef: ElementRef,
                private mapsAPILoader: MapsAPILoader,
                @Inject(DOCUMENT) private document: any,
                private pageScrollService: PageScrollService,
                private ngZone: NgZone) {
    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
        let offset = window.scrollY;
        let map = this.document.getElementById('mapArea');
        map.style.position = 'relative';
        if (offset < 300) {
            map.style.top = `0px`;
        } else {
            let maxScroll = this.document.body.scrollHeight - window.innerHeight - this.document.getElementById('footerArea').offsetHeight;
            if (offset > maxScroll) {
                map.style.top = `${maxScroll}px`;
            } else {
                map.style.top = `${offset - 200}px`;
            }
        }
    }

    @HostListener('mousemove', ['$event'])
    onMousemove(event: MouseEvent) {
        this.positionInfoWindowTop = event.clientY;
        this.positionInfoWindowLeft = event.clientX;
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
        // if (navigator.geolocation) {
        //   navigator.geolocation.getCurrentPosition((position) => {
        //       this.latitude = position.coords.latitude;
        //       this.longitude = position.coords.longitude;
        //       this.zoom = 12;
        //       this.mapsAPILoader.load().then(() => {
        //         let geocoder = new google.maps.Geocoder();
        //         geocoder.geocode({'location': {lat: this.latitude, lng: this.longitude}}, (results, status) => {
        //           this.ngZone.run(() => {
        //             if (status == google.maps.GeocoderStatus.OK) {
        //               this.inputSearchNear.nativeElement.value = results[0].formatted_address;
        //               this.getDataBusiness();
        //             }
        //           });
        //         });
        //       });
        //     },
        //     error => {
        //       this.getDataBusiness();
        //     });
        // } else {
        this.getDataBusiness();
        // }
    }

    redoSearchMap() {
        this.mapsAPILoader.load().then(() => {
            let geocoder = new google.maps.Geocoder();
            geocoder.geocode({'location': {lat: this.latitudeTemp, lng: this.longitudeTemp}}, (results, status) => {
                this.ngZone.run(() => {
                    if (status == google.maps.GeocoderStatus.OK) {
                        this.inputSearchNear.nativeElement.value = results[0].formatted_address;
                        this.getDataBusiness();
                    }
                });
            });
        });
    }

    centerMapChange(event: any) {
        this.latitudeTemp = event.lat;
        this.longitudeTemp = event.lng;
    }

    showInfoWindowBusinessMap(business: Business) {
        this.selectedBusiness = business;
        let infoWindow = this.document.getElementById('infoWindowBusiness');
        infoWindow.style.top = `${this.positionInfoWindowTop - infoWindow.offsetHeight}px`;
        infoWindow.style.left = `${this.positionInfoWindowLeft - infoWindow.offsetWidth}px`;
    }

    hideInfoWindowBusinessMap() {
        let infoWindow = this.document.getElementById('infoWindowBusiness');
        infoWindow.style.top = `-9999px`;
        infoWindow.style.left = `-9999px`;
    }

    chosePlace(text: string) {
        this.inputSearchPlace.nativeElement.value = text;
        this.isShowListAutocomplete = false;
        this.getDataBusiness();
    }

    addFilter(key: string, value: string) {
        if (_.isUndefined(this.filter[key])) {
            // underfined
            if (key == 'price' || key == 'attributes') {
                this.filter[key] = [];
                this.filter[key].push(value);
            } else {
                this.filter[key] = value;
            }
        } else {
            if (key == 'price' || key == 'attributes') {
                if (this.filter[key].indexOf(value) == -1) {
                    // not yet value
                    this.filter[key].push(value);
                } else {
                    this.filter[key] = this.filter[key].filter((item: any, index: any) => item != value);
                }
            } else {
                delete this.filter[key];
            }
        }
        this.getDataBusiness();
    }

    getDataBusiness(page: number = 0) {
        this.page = page;
        this.loading = true;
        this.totalBusiness = 0;
        this.listBusiness = [];
        let dataSearch = {
            term: this.inputSearchPlace.nativeElement.value,
            location: this.inputSearchNear.nativeElement.value,
            limit: this.limitPerPage,
            offset: page * this.limitPerPage
        }
        dataSearch = _.merge(dataSearch, this.filter);
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
        this.scrollToTop();
    }

    getAddressShop(address: any) {
        if (address != null && address.length) {
            return address.join('<br>');
        }
        return '';
    }

    getNumberShop(num: number) {
        let position = this.page * this.limitPerPage + num + 1;
        return position.toString();
    }

    scrollToTop() {
        let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, 'body');
        this.pageScrollService.start(pageScrollInstance);
    }

}
