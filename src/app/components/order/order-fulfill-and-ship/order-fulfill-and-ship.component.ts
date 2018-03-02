import {Component, ElementRef, Inject, OnInit} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../../../services/authentication.service";
import {AlertService} from "../../../services/alert.service";
import {FormBuilder} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {AppConfig} from "../../../config/app.config";
import {ValidationService} from "../../../services/validation.service";
import {ProductService} from "../../../services/product.service";
import {AppComponent} from "../../app.component";
import {OrderService} from "../../../services/order.service";
import {Order} from "../../../models/order";
import * as _ from "lodash";
import {PageScrollInstance, PageScrollService} from "ng2-page-scroll";
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'app-order-fulfill-and-ship',
  templateUrl: './order-fulfill-and-ship.component.html'
})
export class OrderFulfillAndShipComponent implements OnInit {
  order: any = new Order();
  loading = false;
  maxQuantityProduct: any = [];

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute,
              private authenticationService: AuthenticationService,
              private alertService: AlertService,
              private formBuilder: FormBuilder,
              private elementRef: ElementRef,
              private translate: TranslateService,
              private config: AppConfig,
              private validationService: ValidationService,
              private orderService: OrderService,
              private pageScrollService: PageScrollService,
              @Inject(DOCUMENT) private document: any,
              private appComponent: AppComponent) {
    this.appComponent.bodyClass = 'page-orders-fulfill-and-ship-index';
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params.orderId) {
        this.getData(params.orderId);
      }
    });
  }

  getData(id: number) {
    this.orderService.getOrderByID(id).subscribe(
      data => {
        this.order = data;
        for (let product of this.order.line_items) {
          this.maxQuantityProduct.push(product.quantity);
        }
      }
    );
  }

  scrollToTop() {
    let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, 'body');
    this.pageScrollService.start(pageScrollInstance);
  }

  submitData() {
    const data: any = {
      service: "manual",
      line_items: []
    }
    this.order.line_items.filter((item: any, index: number) => {
      let product = {
        id: item.id,
        quantity: item.quantity
      };
      data.line_items.push(product);
    });
    this.orderService.createFulfillment(data, this.order.id).subscribe(
      result => {
        this.alertService.success(result.msg);
        this.router.navigate(['/orders', this.order.id]);
        this.scrollToTop();
      },
      error => {
        this.scrollToTop();
        this.alertService.error(error.msg);
      }
    );
  }

  getMaxQuantiyProduct(current: boolean = false) {
    let maxQuantity = 0;
    if (!current) {
      this.maxQuantityProduct.filter((item: any, index: number) => maxQuantity += item);
    } else {
      if (this.order.line_items.length) {
        this.order.line_items.filter((item: any, index: number) => {
          maxQuantity += item.quantity
        });
      }
    }
    return maxQuantity;
  }
}
