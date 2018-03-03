import {Component, ElementRef, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../../../services/authentication.service";
import {AlertService} from "../../../services/alert.service";
import {TranslateService} from "@ngx-translate/core";

import {ValidationService} from "../../../services/validation.service";
import {AppComponent} from "../../app.component";
import {ModalDirective} from "ngx-bootstrap";
import {Order} from "../../../models/order";
import {OrderService} from "../../../services/order.service";
import {PageScrollInstance, PageScrollService} from "ng2-page-scroll";
import {DOCUMENT} from "@angular/common";
import {CustomValidators} from "ng2-validation";
import {Variant} from "../../../models/variant";
import {Product} from "../../../models/product";
import {debounceTime, distinctUntilChanged} from "rxjs/operators";
import {Subject} from "rxjs/Subject";

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html'
})
export class OrderDetailComponent implements OnInit {
  @Input() order: any = new Order();
  loading = false;
  dataForm: FormGroup;
  cancelOrderForm: FormGroup;
  shippingForm: FormGroup;
  @Input() ckeditorContent: string;
  @ViewChild('popupEditOrderContact') public popupEditOrderContact: ModalDirective;
  @ViewChild('popupShippingAddress') public popupShippingAddress: ModalDirective;
  @ViewChild('popupMarkAsPaid') public popupMarkAsPaid: ModalDirective;
  @ViewChild('popupCancelOrder') public popupCancelOrder: ModalDirective;
  @ViewChild('popupAddTracking') public popupAddTracking: ModalDirective;
  validationMessages: any;
  validationMessagesShipping: any;
  isShowMoreAction: boolean = false;
  subTotalRefund: number = this.order.total_price;
  taxRefund: number = this.order.total_tax;
  selectedFulfillmentID: number = 0;
  orderTag: any = [];
  orderTagTemp: any = [];
  @ViewChild('popupOrderTag') public popupOrderTag: ModalDirective;
  isShowOrderTag: boolean = false;
  tagSearch: string = '';
  @ViewChild('orderTagSearch') orderTagSearch: any;
  @ViewChild('textareaNote') textareaNote: any;
  public boxSearchTags = new Subject<string>();

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute,
              private authenticationService: AuthenticationService,
              private alertService: AlertService,
              private formBuilder: FormBuilder,
              private elementRef: ElementRef,
              private translate: TranslateService,
              private validationService: ValidationService,
              private orderService: OrderService,
              private appComponent: AppComponent,
              private pageScrollService: PageScrollService,
              @Inject(DOCUMENT) private document: any) {
    this.appComponent.bodyClass = 'page-orders-show';
  }


  ngOnInit() {

    this.buildCancelOrderForm();
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.getData(params.id);
      }
    });

    // search tags
    this.searchTag();
  }

  getData(id: number) {
    this.orderService.getOrderByID(id).subscribe(
      data => {
        this.order = data;
        this.buildCancelOrderForm(this.order.line_items);
        this.buildShippingForm(this.order.shipping_address);
        this.getAllTag();
      }
    );
  }


  buildShippingForm(data: any = []): void {
    this.validationMessagesShipping = {
      "first_name": {
        'required': 'first name is require',
      },
      "last_name": {
        'required': 'last name is require',
      },
      "phone": {
        'required': 'phone is require',
      },
      "district": {
        'required': 'district is require',
      },
      "address1": {
        'required': 'address1 is require',
      },
      "address2": {},
      "city": {
        'required': 'city is require',
      },
      "country": {
        'required': 'country is require',
      },
      "province": {
        'required': 'province is require',
      },
      "zip": {
        'required': 'zipcode is require',
        'number': 'zipcode must be a numeric'
      },
    };
    this.shippingForm = this.formBuilder.group({
      "first_name": [data!.first_name, [
        Validators.required
      ]
      ],
      "last_name": [data!.last_name, [
        Validators.required
      ]
      ],
      "company": [data!.company, [
        // Validators.required
      ]
      ],
      "phone": [data!.phone, [
        Validators.required
      ]
      ],
      "district": [data!.district, [
        // Validators.required
      ]
      ],
      "address1": [data!.address1, [
        Validators.required
      ]
      ],
      "address2": [data!.address2, [
        // Validators.required
      ]
      ],
      "city": [data!.city, [
        Validators.required
      ]
      ],
      "country": [data!.country, [
        Validators.required
      ]
      ],
      "province": [data!.province, [
        Validators.required
      ]
      ],
      "zip": [data!.zip, [
        Validators.required,
        CustomValidators.number
      ]
      ],
    });
  }

  buildCancelOrderForm(data: Product[] = []): void {
    this.cancelOrderForm = this.formBuilder.group({
      "reason": ['customer', []],
      "refund": this.formBuilder.group({
        "discrepancy_reason": ["Refund discrepancy", []],
        "refund_line_items": this.formBuilder.array([]),
      }),
    });
    this.setDataRefunds(data);
  }

  setDataRefunds(data: Product[]) {
    this.clearAllRefunds();
    const control = <FormArray>this.cancelOrderForm.controls['refund']['controls']['refund_line_items'];
    for (let dat of data) {
      let FGr = this.initRefunds(dat);
      control.push(FGr);
    }
  }

  initRefunds(data: any = []) {
    return this.formBuilder.group({
      id: [data!.id,
      ],
      quantity: [data!.quantity, []],
    });
  }

  removeRefund(i: number) {
    const control = <FormArray>this.cancelOrderForm.controls['refund']['controls']['refund_line_items'];
    control.removeAt(i);
  }


  clearAllRefunds() {
    const options = <FormArray>this.cancelOrderForm.controls['refund']['controls']['refund_line_items'];
    if (options.length) {
      for (let i = options.length - 1; i >= 0; i--) {
        this.removeRefund(i);
      }
    }
  }

  submitForm() {
    // const validation = this.validationService.validation(this.dataForm, this.validationMessages);
    // if (validation != '') {
    //   this.scrollToTop();
    //   this.alertService.error(validation);
    //   return;
    // }
    //
    // const model = this.dataForm.value;
    this.order.note = this.textareaNote.nativeElement.value;
    this.loading = true;
    if (this.order.id == -1) {
      // insert
      delete this.order.id;
    } else {
      // update
      this.orderService.update(this.order, this.order.id).subscribe(
        data => {
          if (data.code == 200) {
            this.scrollToTop();
            this.alertService.success("Update order seccess");
          }
        });
    }

  }

  submitShippingForm() {
    const validation = this.validationService.validation(this.shippingForm, this.validationMessagesShipping);
    if (validation != '') {
      this.alertService.error(validation);
      return;
    }

    const model = this.shippingForm.value;
    this.loading = true;
    this.orderService.update({shipping_address_attributes: model}, this.order.id).subscribe(
      data => {
        this.popupShippingAddress.hide();
        this.order = data.order;
        this.alertService.success(data.msg);
      },
      error => {
        this.scrollToTop();
        this.alertService.error(error.msg);
      });

  }

  scrollToTop() {
    let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, 'body');
    this.pageScrollService.start(pageScrollInstance);
  }

  archiveOrder(status: string) {
    this.orderService.archiveOrder(status, this.order.id).subscribe(
      result => {
        this.getData(this.order.id);
        this.alertService.success(result.msg);
        this.popupMarkAsPaid.hide();
      },
      error => {
        this.alertService.error(error.msg);
      }
    )
  }

  calculationOrderRefund(index: number) {
    let totalPrice;
    this.subTotalRefund = 0;
    this.taxRefund = 0;
    for (let key in this.order.line_items) {
      if (parseInt(key) === index) {
        totalPrice = this.cancelOrderForm.controls.refund['controls']['refund_line_items']['controls'][index].get('quantity').value * this.order.line_items[index].price;
        this.subTotalRefund += totalPrice;
      } else {
        this.subTotalRefund += this.order.line_items[index].quantity * this.order.line_items[index].price;
      }
    }
    this.taxRefund = this.subTotalRefund / 10;
    return totalPrice;
  }

  cancelOrder() {
    this.orderService.cancelOrder(this.cancelOrderForm.value, this.order.id).subscribe(
      result => {
        this.getData(this.order.id);
        this.popupCancelOrder.hide();
        this.alertService.success(result.msg);
        this.scrollToTop();
      },
      error => {
        this.alertService.error(error.msg);
      }
    )
  }

  // Fulfillments
  showPopupAddTracking(id: number) {
    this.selectedFulfillmentID = id;
    this.popupAddTracking.show();
  }

  addTracking() {
    const data = {
      service: "manual"
    }
    this.orderService.updateFulfillment(data, this.order.id, this.selectedFulfillmentID).subscribe(
      result => {
        this.popupAddTracking.hide();
        this.alertService.success(result.msg);
        this.scrollToTop();
      },
      error => {
        this.alertService.error(error.msg);
        this.scrollToTop();
      }
    )
  }

  cancelFulfillment(id: number) {
    this.orderService.cancelFulfillment(this.order.id, id).subscribe(
      result => {
        this.hideTooltip();
        this.getData(this.order.id);
        this.alertService.success(result.msg);
        this.scrollToTop();
      },
      error => {
        this.hideTooltip();
        this.alertService.error(error.msg);
        this.scrollToTop();
      }
    )
  }

  showTooltip(idTooltip: string) {
    this.hideTooltip();
    document.getElementById(idTooltip).classList.add('ui-popover--is-active');
  }

  hideTooltip() {
    let elems = document.querySelectorAll(".tootip-fulfillment");
    [].forEach.call(elems, function (el: any) {
      el.classList.remove('ui-popover--is-active');
    });
  }

  // End Fulfillments

  // Tag

  getAllTag() {
    this.orderService.getAllTag().subscribe(
      data => {
        this.orderTagTemp = data;
        this.orderTag = this.orderTagTemp.filter((item: any, index: number) => item != null && this.order.tags.indexOf(item) == -1);
        console.log(this.orderTag);
      }
    )
  }

  addTag(tag: string, close: boolean = false) {
    if (this.order.tags.indexOf(tag) != -1) {
      this.order.tags = this.order.tags.filter((item: any) => item != tag);
    } else {
      this.order.tags.push(tag);
    }
    this.orderTag = this.orderTagTemp.filter((item: any, index: number) => item != null && this.order.tags.indexOf(item) == -1);
    if (close) {
      this.tagSearch = '';
      this.isShowOrderTag = false;
      this.orderTagSearch.nativeElement.value = ''
    }
  }

  searchTag() {
    this.boxSearchTags.pipe(
      debounceTime(500),
      distinctUntilChanged(),
    ).subscribe((value) => {
      this.isShowOrderTag = true;
      this.tagSearch = value;
      if (!value) {
        this.orderTag = this.orderTagTemp.filter((item: any, index: number) => item != null && this.order.tags.indexOf(item) == -1);
        return;
      }
      this.orderTag = this.orderTagTemp.filter((item: any, index: number) => this.order.tags.indexOf(item) == -1 && item != null && item.toLowerCase().indexOf(value.toLowerCase()) > -1);
    });
  }

  // End Tag
}
