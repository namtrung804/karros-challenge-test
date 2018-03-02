import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {AppComponent} from '../../app.component';
import {CustomerService} from '../../../services/customer.service';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

import {Subject} from 'rxjs/Subject';
import {PageScrollInstance, PageScrollService} from 'ng2-page-scroll';
import {AlertService} from '../../../services/alert.service';
import {ValidationService} from '../../../services/validation.service';
import {AppConfig} from '../../../config/app.config';
import {DOCUMENT} from '@angular/common';
import {HeaderMainComponent} from '../../layout-main/header-main/header-main.component';

@Component({
  selector: 'app-customer-create',
  templateUrl: './customer-create.component.html'
})
export class CustomerCreateComponent implements OnInit {
  customerForm: FormGroup;
  loading = false;
  loadingResults = false;
  customerTagTemp: any = [];
  customerTag: any = [];
  FreqTags: any = [];
  tagTerms = new Subject<string>();
  newTag: any = [];
  errorMessageTag = false;
  validationMessages: any = [];
  isShowBar = true;
  isChanged = false;
  @ViewChild(HeaderMainComponent)
  private HeaderMainComponent: HeaderMainComponent;
  constructor(private fb: FormBuilder,
              private router: Router, private route: ActivatedRoute,
              private customerService: CustomerService,
              private config: AppConfig,
              private validationService: ValidationService,
              private alertService: AlertService,
              private pageScrollService: PageScrollService,
              @Inject(DOCUMENT) private document: any,
              private appComponent: AppComponent) {
    this.appComponent.bodyClass = 'page-customers-new';
  }

  ngOnInit() {
    this.buildForm();
    this.getAllCustomerTags();
    this.customerForm.valueChanges.subscribe(data => {
      this.isChanged = true;
    })
  }

  // get data
  getAllCustomerTags() {
    this.loadingResults = true;
    this.customerService.getAllTag().subscribe(
      data => {
        this.customerTagTemp = data;
        this.customerTag = data.filter((item: any, index: any) => index <= 10);
        this.FreqTags = this.customerTag.filter((ele: any, index: any) => index <= 5);
      }
    )
  }

  // END get data
  buildForm(): void {
    this.validationMessages = {
      'email': {
        'required': 'Your email or password was incorrect',
        'pattern': 'Your email or password was incorrect'
      }
    };
    this.customerForm = this.fb.group({
      customer: this.fb.group({
        first_name: [null],
        last_name: [null],
        email: [null, [
          Validators.required,
          Validators.pattern(this.config.checkEmailRegex)
        ]
        ],
        phone: [null],
        accept_marketing: [null],
        tax_exempt: [null],
        note: [null],
        tags: [null],
      }),
      address: this.fb.group({
        first_name: [null],
        last_name: [null],
        company: [null],
        phone: [null],
        address1: [null],
        address2: [null],
        city: [null],
        zip: [null],
        country: [null],
        province: [null],
      })
    });
    this.customerForm.valueChanges.subscribe(data => {
      this.isShowBar = true;
    })
  }

  submitForm() {
    console.log('test');
    const validation = this.validationService.validation(this.customerForm.get('customer'), this.validationMessages);
    if (validation !== '') {
      this.scrollToTop();
      this.alertService.error(validation);
      return;
    }
    let model = this.customerForm.value;
    this.loading = true;
    model.customer.tags = this.newTag;
    this.customerService.create(model).subscribe(
      data => {
        if (data.code === 200) {
          this.router.navigate(['/customers', data.customer.id])
            .then(res => {
              console.log('redirectTo' + res)
            });
          console.log('Successful!');
        } else {
          console.log('Failed!');
        }
      },
      error => {
        this.loading = false;
        console.log('Error');
      }
    )
  };

  update(event) {
    if (event.update){
      console.log('ok');
    }
  }

  // typing tags
  setTagTerms() {
    this.tagTerms.pipe(
      debounceTime(0),
      distinctUntilChanged(),
    ).subscribe((event: any) => {
      if (event.keyCode === 188) {
        event.target.value = event.target.value.split(',')[0];
        const value = event.target.value;
        if (value !== ',' && !value.match('^\\s*$')) {
          this.addTag(value);
        } else {
          event.target.value = '';
        }
        if (!this.errorMessageTag) {
          event.target.value = '';
        }
      }
    });
  }

  addTag(value: any) {
    this.isChanged = true;
    value = value.split(',')[0];
    if (this.newTag.includes(value)) {
      this.errorMessageTag = true;
      setTimeout(() => {
        this.errorMessageTag = false;
      }, 4000);
    } else {
      const tag = value;
      this.newTag.push(tag);
    }
  }

  removeTag(value: any) {
    this.newTag = this.newTag.filter(tag => tag !== value);
  }

  scrollToTop() {
    let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, 'body');
    this.pageScrollService.start(pageScrollInstance);
  }
}
