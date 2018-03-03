import {Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
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
import {CHECK_EMAIL_REGEX} from '../../config/global-const';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {Subject} from 'rxjs/Subject';
import {YelpService} from '../../services/yelp.service';

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
    public boxSearchNear = new Subject<string>();
    @ViewChild('inputSearchNear') inputSearchNear: any;
    listAutocomplete: any = [];

    constructor(private yelpService: YelpService,
                private router: Router,
                private route: ActivatedRoute,
                private alertService: AlertService,
                private formBuilder: FormBuilder,
                private elementRef: ElementRef) {
    }

    ngOnInit() {
        // search place
        this.searchPlace();
        // search near
        this.searchNear();
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

    getValuePlace(text: string) {
        this.listAutocomplete = [];
        this.yelpService.autocomplete(text).subscribe(
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

    searchNear() {
        this.boxSearchNear.pipe(
            debounceTime(500),
            distinctUntilChanged(),
        ).subscribe((value) => {
            console.log(value);
        });
    }
}
