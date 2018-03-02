import {Component, Input, OnInit} from '@angular/core';
import {CustomerService} from '../../../services/customer.service';
import {Customer} from '../../../models/customer'
import {ActivatedRoute, Router} from '@angular/router';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertService} from '../../../services/alert.service';
import {ValidationService} from '../../../services/validation.service';

const _ = require('lodash');

@Component({
  selector: 'app-customer-bulk',
  templateUrl: './customer-bulk.component.html',
})
export class CustomerBulkComponent implements OnInit {
  editFields: any = [
    {
      title: 'First Name',
      type: 'string',
      visibility: false,
      type_group: 'Attribution'
    },
    {
      title: 'Last Name',
      type: 'string',
      visibility: false,
      type_group: 'Attribution'
    },
    {
      title: 'Email',
      type: 'string',
      visibility: true,
      type_group: 'Attribution'
    },
    {
      title: 'Accepts marketing',
      type: 'boolean',
      visibility: false,
      type_group: 'Attribution'
    },
    {
      title: 'Tax exempt',
      type: 'boolean',
      visibility: false,
      type_group: 'Attribution'
    },
    {
      title: 'Tags',
      type: 'tags',
      visibility: true,
      type_group: 'Attribution'
    },
  ];
  availableFields: any = [
    {
      title: 'Email',
      type: 'string',
      visibility: true,
      type_group: 'Attribution'
    },
    {
      title: 'Tags',
      type: 'tags',
      visibility: true,
      type_group: 'Attribution'
    },
  ];
  customerForm: FormGroup;
  validationMessages: any;
  customers: any = [];
  customer = new Customer();
  loading = false;
  isShowFlashMessage = false;
  flash_message: string = '';
  isShowFieldTags = false;
  showTagsPop: any = [];

  constructor(private router: Router, private route: ActivatedRoute,
              private customerService: CustomerService,
              private validationService: ValidationService,
              private alertService: AlertService,
              private fb: FormBuilder) {

  }

  ngOnInit() {
    this.buildForm();
    this.route.params.subscribe((params) => {
        if (_.isUndefined(params.ids)) {
          this.router.navigate(['customers']);
        }
        for (let id of params.ids.split(',')) {
          this.getData(parseInt(id));
        }
      }
    );
  }

  buildForm(): void {
    this.validationMessages = {

    };
    this.customerForm = this.fb.group({
      customers: this.fb.array([])
    });
  }

  getData(customerId: number) {
    this.customerService.getById(customerId)
      .subscribe((data) => {
        this.customer = data.customer;
        this.setDataToForm(this.customer);
      });
  }

  setDataToForm(customer: Customer) {
    const FGr = this.fb.group({
      id: [customer.id, Validators.required],
      email: [customer.email, Validators.required],
      first_name: [customer.first_name, Validators.required],
      last_name: [customer.last_name, Validators.required],
      accept_marketing: [customer.accept_marketing, Validators.required],
      tax_exempt: [customer.tax_exempt, Validators.required],
    });
    const control = <FormArray>this.customerForm.controls['customers'];
    control.push(FGr);
  }

  addFilter(titleFilter: string) {
    this.isShowFieldTags = false;
    const field = this.editFields.find(ele => ele.title === titleFilter);
    field.visibility = true;
    this.availableFields.push(field);
  }

  removeFilter(titleFilter: string) {
    const field = this.editFields.find(ele => ele.title === titleFilter);
    field.visibility = false;
    this.availableFields = this.availableFields.filter(ele => ele.title !== titleFilter);
  }

  hasField(titleFilter: string) {
    return this.availableFields.findIndex(ele => {
      return (ele.title === titleFilter && ele.visibility === true);
    })
  }

  submitBulk() {
    const model = this.customerForm.value;

    const control = <FormArray>this.customerForm.controls['customers'];
    control.controls = [];

    for (const customer of model.customers) {
      const item = customer;
      const idCustomer = customer.id;
      delete item.id;

      this.customerService.update(item, idCustomer).subscribe(
        data => {
          if (data.code === 200) {
            this.customer = data.customer;
            this.setDataToForm(this.customer);
            this.isShowFlashMessage = true;
            this.flash_message = 'Saved customers';
            setTimeout(() => {
              this.isShowFlashMessage = false;
            }, 4000);
          } else {
            console.log('failed');
          }
        },
        error => {
          this.loading = false;
          console.log('Error');
        }
      )
    }
  }

  showingTagsPop(TagsPop: string) {
    if (this.hasTagsPop(TagsPop) === -1) {
      this.showTagsPop.push(TagsPop);
    } else {
      this.showTagsPop = this.showTagsPop.filter(ele => ele !== TagsPop);
    }
  }

  hasTagsPop(TagsPop: string) {
    return this.showTagsPop.findIndex(ele => ele === TagsPop)
  }
}
