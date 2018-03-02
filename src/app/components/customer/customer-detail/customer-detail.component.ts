import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {AppConfig} from '../../../config/app.config';
import {CustomerService} from '../../../services/customer.service';
import {ValidationService} from '../../../services/validation.service';

import {Customer} from '../../../models/customer';
import {OrderService} from '../../../services/order.service';
import {Order} from '../../../models/order';
import {ModalDirective} from 'ngx-bootstrap';
import * as moment from 'moment';

import {PopupManagerTagsComponent} from '../popup-manager-tags/popup-manager-tags.component';
import {HeaderMainComponent} from '../../layout-main/header-main/header-main.component';
import {AlertService} from '../../../services/alert.service';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html'
})
export class CustomerDetailComponent implements OnInit {
  // Data variables
  loading = false;
  loadingResults = false;
  // Form
  CustomerForm: FormGroup;
  ContactForm: FormGroup;
  AddressForm: FormGroup;
  validationMessages: any;
  //  Customer
  customer = new Customer();
  // get ID address
  currentAddress: any;
  @Input() order: any = new Order();
  timeOrder: string;
  timeCustomer: string;
  customerTagTemp: any = [];
  customerTag: any = [];
  appliedTags: any = [];
  // TODO : qui tắc đạt tên params 1 là chữ đầu viết thường các chữ sau viết hoa. 2 là "_" .Vd freqTags hoặc freq_tags
  FreqTags: any = [];
  // END Data variables

  // Variables for display popover
  isShowBar = false;
  isShowChange = false;
  isShowCreate = false;
  isShowEditAddress = false;
  // Show tags
  isShowViewTag = false;
  isShowFreqTags = false;
  // show popover
  @ViewChild('popupCustomerSendTo') public popupCustomerSendTo: ModalDirective;
  @ViewChild('popupCustomerContact') public popupCustomerContact: ModalDirective;
  @ViewChild('popupCustomerAddress') public popupCustomerAddress: ModalDirective;
  @ViewChild('popupCustomerAccount') public popupCustomerAccount: ModalDirective;
  @ViewChild('popupCustomerTag') public popupCustomerTag: ModalDirective;
  @ViewChild(PopupManagerTagsComponent)
  private PopupManagerTagsComponent: PopupManagerTagsComponent;
  @ViewChild(HeaderMainComponent)
  private HeaderMainComponent: HeaderMainComponent;
  titleCustomerAccount: string = '';
  // END show popover
  // END variables for display popover
  constructor(private customerService: CustomerService, private orderService: OrderService,
              private router: Router, private route: ActivatedRoute,
              private config: AppConfig,
              private validationService: ValidationService,
              private alertService: AlertService,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.getData();
    this.getLastOrder();
    this.buildForm();
    this.CustomerForm.valueChanges.subscribe(data => {
      this.isShowBar = true;
    })
  }

  buildForm(): void {
    this.CustomerForm = this.fb.group({
      note: [null
      ]
    });
    this.ContactForm = this.fb.group({
      emailSource: [{value: null, disabled: true}, [
        Validators.required
      ]
      ],
      emailDest: ['', [
        Validators.required
      ]
      ],
      subject: [null, [
        Validators.required
      ]
      ],
      content: [null, [
        Validators.required
      ]
      ],
    });
    this.validationMessages = {
      'email': {
        'pattern': 'Your email or password was incorrect',
      }
    };
    this.AddressForm = this.fb.group({
      customer: this.fb.group({
        first_name: [null],
        last_name: [null],
        email: [null, [
          Validators.pattern(this.config.checkEmailRegex)
        ]
        ],
        phone: [null],
        accept_marketing: [null],
        tax_exempt: [null],
      }),
      address: this.fb.group({
        id: [null],
        addressable_type: [null],
        addressable_id: [null],
        original_address_id: [null],
        name: [null],
        first_name: [null],
        last_name: [null],
        company: [null],
        address1: [null],
        address2: [null],
        city: [null],
        country: [null],
        province: [null],
        district: [null],
        zip: [null],
        phone: [null],
      })
    })
  }

  getData() {
    // get param id
    let id: any;
    this.route.params.subscribe((params) => {
        id = params.id;
        this.customerService.getById(id)
          .subscribe((data) => {
            this.customer = data.customer;
            this.setContactData();
            this.timeCustomer = moment(this.customer.created_at).fromNow();
          });
      }
    );
  }

  reloadData(event: any) {
    if (event.appliedTags) {
      this.appliedTags = this.appliedTags.concat(event.appliedTags);
      this.isShowBar = this.PopupManagerTagsComponent.isShowBar;
    }
  }

  setContactData() {
    // TODO : Build theo dạng init demo trong collection detail
    this.AddressForm.get('customer').get('first_name').setValue(this.customer.first_name);
    this.AddressForm.get('customer').get('last_name').setValue(this.customer.last_name);
    this.AddressForm.get('customer').get('email').setValue(this.customer.email);
    this.AddressForm.get('customer').get('phone').setValue(this.customer.phone);
    this.AddressForm.get('customer').get('tax_exempt').setValue(this.customer.tax_exempt);
    this.AddressForm.get('customer').get('accept_marketing').setValue(this.customer.accept_marketing);
  }

  getLastOrder() {
    this.orderService.getOrderByID(1).subscribe(data => {
      this.order = data;
      this.timeOrder = moment(this.order.created_at).fromNow();
    });
  }

  getAllCustomerTags() {
    this.loadingResults = true;
    this.customerService.getAllTag().subscribe(
      data => {
        this.loadingResults = false;
        this.customerTagTemp = data;
        this.customerTag = data.filter((item: any, index: any) => index <= 10);
        this.FreqTags = this.customerTag.filter((ele: any, index: any) => index <= 5);
      }
    )
  }

  // END getDataCustomer

  // submit form
  submitChangeContact() {
    const validation = this.validationService.validation(this.AddressForm.get('customer'), this.validationMessages);
    if (validation !== '') {
      this.alertService.error(validation);
      return;
    }
    this.loading = true;
    let model = this.AddressForm.value.customer;
    this.customerService.update(model, this.customer.id).subscribe(
      data => {
        if (data.code === 200) {
          this.customer = data.customer;
          this.popupCustomerContact.hide();
          this.HeaderMainComponent.showFlashMessage('Customer has been updated!');
        } else {
          console.log(this.AddressForm.status);
        }
      },
      error => {
        this.loading = false;
        this.alertService.error('Email has already been taken');
      }
    )
  }

  submitAddAddress() {
    let model = this.AddressForm.value.address;
    this.loading = true;
    delete model.id;
    this.customerService.addAddress(model, this.customer.id).subscribe(
      data => {
        if (data.code === 200) {
          this.getData();
          this.popupCustomerAddress.hide();
          this.HeaderMainComponent.showFlashMessage('New address has been added!');
        } else {
          console.log('Failed!');
        }
      }
    )
  }

  submitEditAddress() {
    this.loading = true;
    const model = this.AddressForm.value.address;
    delete model.id;
    this.customerService.updateAddress(model, this.customer.id, this.currentAddress.id).subscribe(
      data => {
        if (data.code === 200) {
          this.isShowEditAddress = false;
          this.HeaderMainComponent.showFlashMessage('Your address has been updated!');
          this.getData();
        } else {
          console.log('Failed!');
        }
      }
    )
  }

  submitDefaultAddress(idAddress: number) {
    this.customerService.setDefaulAddress(this.customer.id, idAddress).subscribe(data => {
      this.customer = data.customer;
      // this.setContactData();
    });
  }

  editAddress(id: number) {
    this.isShowEditAddress = true;
    this.isShowChange = false;
    for (let address of this.customer.addresses) {
      if (address.id === id) {
        this.currentAddress = address;
        this.AddressForm.get('address').setValue(this.currentAddress);
      }
    }
  }

  deleteCustomer() {
    this.customerService.deleteById(this.customer.id).subscribe(res => {
        if (res.code === 200) {
          this.router.navigate(['/customers']);
          console.log('ok');
          this.HeaderMainComponent.showFlashMessage('Your customer has been deleted!');
          console.log('Success!');
        } else {
          console.log('Failed!');
        }
      },
      error => {
        this.loading = false;
        console.log('Error');
      }
    );
  }

  deleteCustomerAddress() {
    this.customerService.deleteAddressById(this.customer.id, this.currentAddress.id).subscribe(
      data => {
        if (data.code === 200) {
          this.isShowEditAddress = false;
          this.HeaderMainComponent.showFlashMessage('Your address has been deleted!');
        } else {
          console.log('Failed!');
        }
      }
    )
  }

  update(event: any) {
    if (event.update) {
      let model: any = {
        customer: {
          note: this.customer.note ? this.customer.note : '',
          tags: this.customer.tags.concat(this.appliedTags)
        }
      };
      this.customerService.update(model, this.customer.id).subscribe(
        data => {
          if (data.code === 200) {
            this.getData();
            this.isShowBar = false;
            this.HeaderMainComponent.showFlashMessage('Customer has been updated!');
          } else {
            console.log(this.AddressForm.status);
          }
        }
      )
    }
    if (event.DiscardChanges) {
      this.getData();
    }
  }

  // END submit form

  // show popover
  onHidden(): Boolean {
    return this.isShowCreate || this.isShowEditAddress || this.isShowViewTag;
  }

  showPopupAccount(title: string) {
    this.titleCustomerAccount = title;
    this.popupCustomerAccount.show();
  }

  showFreqTags() {
    this.isShowFreqTags = !this.isShowFreqTags;
    if (!this.customerTag.length) {
      this.getAllCustomerTags();
    }
  }

  showAllTags() {
    this.PopupManagerTagsComponent.showPopup(this.customer, this.customerTag, this.appliedTags);
    if (!this.customerTag.length) {
      this.getAllCustomerTags();
    }
  }

  addTag(source: any, value: any) {
    this.isShowFreqTags = false;
    if (!source.includes(value) && !this.customer.tags.includes(value)) {
      source.push(value);
      this.isShowBar = true;
      this.HeaderMainComponent.isShowBar = true;
    }
  }

  removeTag(source: any, value: any) {
    return source.filter(
      tag => tag !== value
    );
  }

  // END show popover
}
