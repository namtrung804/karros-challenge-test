import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomerService} from '../../../services/customer.service';
import {ValidationService} from '../../../services/validation.service';

import {Customer} from '../../../models/customer';
import {OrderService} from '../../../services/order.service';
import {Order} from '../../../models/order';
import {ModalDirective} from 'ngx-bootstrap';
import * as moment from 'moment';

import {HeaderMainComponent} from '../../layout-main/header-main/header-main.component';
import {AlertService} from '../../../services/alert.service';
import {PopupManagerTagsComponent} from '../../shared-module/popup-manager-tags/popup-manager-tags.component';

import {CustomerAddress} from '../../../models/customer-address';

import {CHECK_EMAIL_REGEX} from "../../../config/global-const";
const countries = require('country-list')();

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html'
})
export class CustomerDetailComponent implements OnInit {
  // Data variables
  loading = false;
  // Form
  dataForm: FormGroup;
  ContactForm: FormGroup;
  validationMessages: any;
  // Country data
  countries: any;
  countriesList: any = [];
  //  Customer
  customer = new Customer();
  // get ID address
  selectedAddress: FormGroup;
  selectedAddressID: number;
  // Order
  @Input() order: any = new Order();
  timeOrder: string;
  timeCustomer: string;
  customerTags: any = [];
  // END Data variables

  // Variables for display popover
  isShowBar = false;
  isShowChange = false;
  isShowCreate = false;
  isShowEditAddress = false;
  // Show tags
  isShowViewTag = false;
  isChanged = false;
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
              private validationService: ValidationService,
              private alertService: AlertService,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.buildForm(new Customer());
    this.getLastOrder();
    this.getAllCustomerTags();
    this.countries = countries;
    this.countriesList = this.countries.getData();
    this.route.params.subscribe((params) => {
        if (params.id) {
          this.getData(params.id);
        }
      }
    );
  }

  buildForm(data: any = []): void {
    this.validationMessages = {
      'email': {
        'pattern': 'Your email was incorrect',
      }
    };
    this.dataForm = this.fb.group({
      id: [data!.id
      ],
      first_name: [data!.first_name, [
        // Validators.required
      ]
      ],
      last_name: [data!.last_name, [
        // Validators.required
      ]
      ],
      phone: [data!.phone, [
        // Validators.required
      ]
      ],
      email: [data!.email, [
        Validators.pattern(CHECK_EMAIL_REGEX)
      ]
      ],
      note: [data!.note, [
        // Validators.required
      ]
      ],
      created_at: [data!.created_at, [
        Validators.required
      ]
      ],
      updated_at: [data!.created_at, [
        Validators.required
      ]
      ],
      accept_marketing: [data!.accept_marketing, [
        // Validators.required
      ]
      ],
      tax_exempt: [data!.tax_exempt, [
        // Validators.required
      ]
      ],
      last_order_id: [data!.last_order_id, [
        // Validators.required
      ]
      ],
      last_order_name: [data!.last_order_name, [
        // Validators.required
      ]
      ],
      order_count: [data!.order_count, [
        // Validators.required
      ]
      ],
      total_spent: [data!.total_spent, [
        // Validators.required
      ]
      ],
      tags: [data!.tags, [
        // Validators.required
      ]
      ],
      addresses: this.fb.array([])
    });
    this.customer = data;
    if (this.customer.addresses.length) {
      this.setDataAddresses(this.customer.addresses);
    }
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
  }

  setDataAddresses(addresses: CustomerAddress[]) {
    const control = <FormArray>this.dataForm.controls['addresses'];
    for (const address of addresses) {
      let FGr = this.initAddress(address);
      control.push(FGr);
    }
  }

  initAddress(data: any = []) {
    return this.fb.group({
      id: [data!.id],
      name: [data!.name],
      first_name: [data!.first_name],
      last_name: [data!.last_name],
      company: [data!.company],
      address1: [data!.address1],
      address2: [data!.address2],
      city: [data!.city],
      country: [data!.country],
      province: [data!.province],
      district: [data!.district],
      zip: [data!.zip],
      phone: [data!.phone],
    });
  }

  getData(customerId: number) {
    this.customerService.getById(customerId)
      .subscribe((data) => {
        this.buildForm(data.customer);
        this.timeCustomer = moment(this.customer.created_at).fromNow();
      });
  }

  getLastOrder() {
    this.orderService.getOrderByID(1).subscribe(data => {
      this.order = data;
      this.timeOrder = moment(this.order.created_at).fromNow();
    });
  }

  // END getDataCustomer

  // submit form
  submitForm() {
    const validation = this.validationService.validation(this.dataForm, this.validationMessages);
    if (validation !== '') {
      console.log(validation);
      this.alertService.error(validation);
      return;
    }
    this.loading = true;
    const model = this.dataForm.value;
    model.tags = this.customer.tags;
    delete model.addresses;
    this.customerService.update(model, this.customer.id).subscribe(
      data => {
        if (data.code === 200) {
          this.customer = data.customer;
          this.popupCustomerContact.hide();
          this.HeaderMainComponent.showFlashMessage('Customer has been updated!');
        } else {
          console.log(this.dataForm.status);
        }
      },
      error => {
        this.loading = false;
        this.alertService.error('Email has already been taken');
      }
    )
  }

  submitAddress() {
    this.loading = true;
    const model = this.selectedAddress.value;
    if (model.id) {
      delete model.id;
      this.customerService.updateAddress(model, this.customer.id, this.selectedAddressID).subscribe(
        data => {
          if (data.code === 200) {
            this.isShowEditAddress = false;
            this.HeaderMainComponent.showFlashMessage('Your address has been updated!');
            this.getData(this.customer.id);
          } else {
            console.log('Failed!');
          }
        }
      )
    } else {
      delete model.id;
      this.customerService.addAddress(model, this.customer.id).subscribe(
        data => {
          if (data.code === 200) {
            this.getData(this.customer.id);
            this.popupCustomerAddress.hide();
            this.HeaderMainComponent.showFlashMessage('New address has been added!');
          } else {
            console.log('Failed!');
          }
        }
      )
    }
  }

  selectDefaultAddress(idAddress: number) {
    this.isShowChange = false;
    this.customerService.setDefaulAddress(this.customer.id, idAddress).subscribe(data => {
      this.customer = data.customer;
    });
  }

  // END submit form

  addAddress() {
    this.popupCustomerAddress.show();
    this.isShowChange = false;
    this.selectedAddress = this.initAddress([]);
    this.selectedAddressID = null;
  }

  editAddress(id: number) {
    this.isShowEditAddress = true;
    this.isShowChange = false;
    const control = <FormArray>this.dataForm.controls['addresses'];
    for (let address of control.controls) {
      if (address.get('id').value === id) {
        this.selectedAddressID = id;
        this.selectedAddress = <FormGroup>address;
      }
    }
  }

  deleteAddress(addressId: number) {
    this.customerService.deleteAddressById(this.customer.id, addressId).subscribe(
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

  deleteCustomer() {
    this.customerService.deleteById(this.customer.id).subscribe(res => {
        if (res.code === 200) {
          this.router.navigate(['/customers']);
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

  // Tags modal
  getAllCustomerTags() {
    this.customerService.getAllTag().subscribe(
      data => {
        this.customerTags = data;
      }
    )
  }

  reloadData(event: any) {
    if (event.isChanged) {
      this.customer.tags = event.tagsExists;
      this.isShowBar = event.isShowBar;
      this.isChanged = event.isChanged;
    }
  }

  saveOnHeader(event: any) {
    if (event.update) {
      this.submitForm();
      this.isShowBar = false;
      this.isChanged = false;
    }
    if (event.DiscardChanges) {
      this.getData(this.customer.id);
    }
  }

  // END Tags modal

  // END submit form

  // show popover
  onHidden(): Boolean {
    return this.isShowCreate || this.isShowEditAddress || this.isShowViewTag;
  }

  showPopupAccount(title: string) {
    this.titleCustomerAccount = title;
    this.popupCustomerAccount.show();
  }

  // END show popover
}
