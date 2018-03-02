import {Component, ElementRef, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {LazyLoadEvent} from "primeng/primeng";
import {ModalDirective, TabsetComponent} from "ngx-bootstrap";
import {UserService} from "../../../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../../../services/authentication.service";
import {AlertService} from "../../../services/alert.service";
import {FormBuilder} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {AppConfig} from "../../../config/app.config";
import {ValidationService} from "../../../services/validation.service";
import {AppComponent} from "../../app.component";
import {OrderService} from "../../../services/order.service";
import {Pagination} from "../../../models/pagination";
import {Subject} from "rxjs/Subject";
import {DOCUMENT} from "@angular/common";
import {PageScrollInstance, PageScrollService} from "ng2-page-scroll";
import {debounceTime, distinctUntilChanged} from "rxjs/operators";
import {ProductService} from "../../../services/product.service";
import {PopupTagsComponent} from "../../shared-module/popup-tags/popup-tags.component";

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html'
})
export class OrderListComponent implements OnInit {
  loading = false;
  @Input() dataSource: any = [];
  @Input() selectedValues: string[] = [];
  selectList: any = [];
  pagination = new Pagination();
  isShowBulkAction = false;
  isModalShow = false;
  isModalShowDelete = false;
  titleProductPopup: string;
  @ViewChild('popupFulfill') public popupFulfill: ModalDirective;
  @ViewChild('popupCaptureAllOrder') public popupCaptureAllOrder: ModalDirective;
  filterArray: any = [];
  public searchTerms = new Subject<string>();
  isCustomFilter = false;
  selectedFilter: string;
  dataTag: any = [];
  dataTagTemp: any = [];
  @ViewChild(PopupTagsComponent)
  private PopupTagsComponent: PopupTagsComponent;

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
              private productService: ProductService,
              @Inject(DOCUMENT) private document: any,
              private appComponent: AppComponent) {
    this.appComponent.bodyClass = 'page-orders-index';
  }

  ngOnInit() {
    this.getAllTags();
    this.getDataOrders(this.pagination.number);
    // search box
    this.search();
  }

  search() {
    this.searchTerms.pipe(
      debounceTime(500),
      distinctUntilChanged(),
    ).subscribe((value) => {
      this.addFilter('q[order_number_eq]', value);
    });
  }

  addFilter(param: string, value: any) {
    if (this.filterArray.length) {
      let newItem = true;
      for (let key in this.filterArray) {
        if (this.filterArray[key].param == param) {
          if (!value) {
            this.filterArray = this.filterArray.filter((item: any) => item.param != param);
          } else {
            this.filterArray[key].value = value;
          }
          newItem = false;
          break;
        }
      }
      if (newItem) {
        this.filterArray.push({
          param: param,
          value: value
        });
      }
    } else {
      this.filterArray.push({
        param: param,
        value: value
      });
    }
    this.pagination.number = 1;
    this.getDataOrders(this.pagination.number, this.filterArray);
    this.isCustomFilter = false;
  }

  getDataOrders(page: number, search: any = []) {
    this.orderService.getAllOrders(page, search).subscribe(
      data => {
        this.pagination = data.pagination;
        this.dataSource = data.orders;
      }
    )
  }

  selectTab(status: string, event: any) {
    let elems = document.querySelectorAll(".next-tab");
    [].forEach.call(elems, function (el: any) {
      el.classList.remove('next-tab--is-active');
    });
    event.target.classList.add('next-tab--is-active');
    this.dataSource = [];
    this.selectList = [];
    switch (status) {
      case 'all':
        this.getDataOrders(this.pagination.number);
        break;
      case 'open':
        this.getDataOrders(this.pagination.number);
        break;
      case 'unfulfilled':
        this.getDataOrders(this.pagination.number, {'q[fulfillment_status]': 'unfulfilled'});
        break;
      case 'unpaid':
        this.getDataOrders(this.pagination.number, {'q[financial_status]': 'unpaid'});
        break;
    }

  }

  clickSelectAll(element: HTMLInputElement) {
    let elems = document.querySelectorAll(".input-checkbox");
    if (element.checked) {
      // Select all
      [].forEach.call(elems, function (el: any) {
        el.checked = true;
      });
      for (const item in this.dataSource) {
        this.selectList.push(this.dataSource[item].id);
      }
    } else {
      [].forEach.call(elems, function (el: any) {
        el.checked = false;
      });
      this.selectList = [];
    }
  }

  clickSelect(id: number, checked: boolean) {
    if (checked) {
      this.selectList.push(id);
    } else {
      this.selectList = this.selectList.filter((item: any, index: any) => item !== id);
    }
  }

  showPopupMakeProduct(title: string) {
    this.isModalShow = true;
    this.titleProductPopup = title;
  }

  showPopupDeleteProduct() {
    this.isModalShowDelete = true;
  }

  onHidden() {
    this.isModalShow = false;
    this.isModalShowDelete = false;
  }

  getAllTags() {
    this.orderService.getAllTag().subscribe(
      data => {
        this.dataTagTemp = data;
        this.dataTag = data.filter((item: any, index: any) => index <= 10);
      }
    )
  }

  scrollToTop() {
    let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, 'body');
    this.pageScrollService.start(pageScrollInstance);
  }

  bulkOrders(param: string, value: any = []) {
    let data = {
      operation: param,
      order_ids: this.selectList,
      value: value
    };
    this.orderService.bulkAction(data).subscribe(
      response => {
        this.alertService.success(response.msg);
        this.popupFulfill.hide();
        this.popupCaptureAllOrder.hide();
        this.isShowBulkAction = false;
        this.getDataOrders(this.pagination.number, this.filterArray);
        this.selectList = [];
        this.scrollToTop();
      },
      error => {
        this.scrollToTop();
        this.alertService.error(error.msg);
      }
    );
  }
}
