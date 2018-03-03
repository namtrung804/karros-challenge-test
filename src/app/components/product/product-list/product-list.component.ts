import {Component, ElementRef, Inject, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {UserService} from "../../../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../../../services/authentication.service";
import {AlertService} from "../../../services/alert.service";
import {TranslateService} from "@ngx-translate/core";

import {ValidationService} from "../../../services/validation.service";
import {AppComponent} from "../../app.component";
import {Product} from "../../../models/product";
import {LazyLoadEvent} from "primeng/primeng";
import {ModalDirective} from "ngx-bootstrap/modal";
import {ProductService} from "../../../services/product.service";
import {Pagination} from "../../../models/pagination";
import {ProductImages} from "../../../models/product-images";
import {Observable} from "rxjs/Observable";
import {Subject} from 'rxjs/Subject';
import {of} from 'rxjs/observable/of';
import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';
import {ProductTypeVendor} from "../../../models/product-type-vendor";
import {PageScrollInstance, PageScrollService} from "ng2-page-scroll";
import {DOCUMENT} from "@angular/common";
import {CollectionService} from "../../../services/collection.service";
import {Collection} from "../../../models/collection";
import {PopupTagsComponent} from "../../shared-module/popup-tags/popup-tags.component";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  loading = false;
  selectedCollections: any = [];
  dataSource: any = [];
  selectedValues: string[] = [];
  selectedFilter: string;
  selectList: any = [];
  pagination = new Pagination();
  isCustomFilter = false;
  isShowBulkAction = false;
  isModalShow = false;
  isModalShowDelete = false;
  titleProductPopup: string;
  titleProductTag: string;
  titleProductCollection: string;
  @ViewChild('popupProductAvailable') public popupProductAvailable: ModalDirective;
  @ViewChild('popupProductDelete') public popupProductDelete: ModalDirective;
  @ViewChild('popupProductTag') public popupProductTag: ModalDirective;
  @ViewChild('popupProductCollection') public popupProductCollection: ModalDirective;
  @ViewChild('searchBox') searchBox: any;
  @ViewChild('searchCollections') searchCollections: any;
  @ViewChild('productTypeValue') productTypeValue: any;
  @ViewChild('productVendorValue') productVendorValue: any;
  @ViewChild('productTagValue') productTagValue: any;
  public searchTerms = new Subject<string>();
  public boxSearchCollections = new Subject<string>();
  productType: ProductTypeVendor[] = [];
  productVendor: ProductTypeVendor[] = [];
  productTag: ProductTypeVendor[] = [];
  productTagTemp: ProductTypeVendor[] = [];
  collectionsCustom: Collection[] = [];
  collectionsCustomTemp: Collection[] = [];
  filterArray: any = [];
  @ViewChild(PopupTagsComponent)
  private PopupTagsComponent: PopupTagsComponent;


  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute,
              private authenticationService: AuthenticationService,
              private alertService: AlertService,
              private formBuilder: FormBuilder,
              private elementRef: ElementRef,
              private translate: TranslateService,
              private validationService: ValidationService,
              private productService: ProductService,
              private collectionService: CollectionService,
              private pageScrollService: PageScrollService,
              @Inject(DOCUMENT) private document: any,
              private appComponent: AppComponent) {
    this.appComponent.bodyClass = 'page-products-index';
  }

  ngOnInit() {
    this.getAllProductVendor();
    this.getAllProductType();
    this.getAllProductTag();
    this.getAllCustomCollections();
    this.getDataProducts(this.pagination.number);

    // search box
    this.search();
    // search collections
    this.searchCollection();

  }


  // FILER

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
    this.getDataProducts(this.pagination.number, this.filterArray);
    this.isCustomFilter = false;
  }

  search() {
    this.searchTerms.pipe(
      debounceTime(500),
      distinctUntilChanged(),
    ).subscribe((value) => {
      this.addFilter('q[title_cont]', value);
    });
  }

  // End Filter

  // Get Data Default
  getDataProducts(page: number, search: any = []) {
    this.productService.getAllProducts(page, search).subscribe(
      data => {
        this.pagination = data.pagination;
        this.dataSource = data.products;
      }
    )
  }

  getAllProductType() {
    this.productService.getAllProductType().subscribe(
      data => {
        this.productType = data;
      }
    )
  }

  getAllProductVendor() {
    this.productService.getAllProductVendor().subscribe(
      data => {
        this.productVendor = data;
      }
    )
  }

  // End Get Data Default

  // Event Select Data
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

  // End Event Select Data

  // Public/ Unpublic Product
  showPopupMakeProduct(title: string) {
    this.titleProductPopup = title;
    this.popupProductAvailable.show();
  }

  // End Public/ Unpublic Product

  // Delete Product

  onHidden() {
    this.isModalShow = false;
    this.isModalShowDelete = false;
  }

  // End Delete Product

  //Product Tag
  getAllProductTag() {
    this.productService.getAllTag().subscribe(
      data => {
        this.productTagTemp = data;
        this.productTag = data.filter((item: any, index: any) => index <= 10);
      }
    )
  }

  showPopupTag(title: string) {
    this.PopupTagsComponent.showPopup(this.productTag, this.productTagTemp, title);
  }

  // End Product Tag


  // Collection Product

  getAllCustomCollections() {
    this.collectionService.getAllCustomCollections().subscribe(
      data => {
        this.collectionsCustomTemp = this.collectionsCustom = data;
      }
    )
  }

  showPopupCollection(title: string) {
    this.selectedCollections = [];
    this.titleProductCollection = title;
    this.popupProductCollection.show();
  }

  addCollection(collection: Collection) {
    if (this.selectedCollections.indexOf(collection.id) != -1) {
      this.selectedCollections = this.selectedCollections.filter((item: any) => item != collection.id);
    } else {
      this.selectedCollections.push(collection.id);
    }
  }

  searchCollection() {
    this.boxSearchCollections.pipe(
      debounceTime(500),
      distinctUntilChanged(),
    ).subscribe((value) => {
      if (!value) {
        this.collectionsCustom = Object.assign([], this.collectionsCustomTemp);
        return;
      }
      // search by title
      this.collectionsCustom = this.collectionsCustom.filter(
        (item: any, index: number) => item.title != null && item.title.toLowerCase().indexOf(value.toLowerCase()) > -1);
    });
  }

  // End Collection Product


  // Other
  bulkProduct(param: string, value: any = []) {
    let data = {
      operation: param,
      product_ids: this.selectList,
      value: value
    };
    this.productService.productBulkAction(data).subscribe(
      response => {
        this.scrollToTop();
        this.alertService.success(response.msg);
        this.isShowBulkAction = false;
        this.popupProductAvailable.hide();
        this.popupProductDelete.hide();
        this.popupProductTag.hide();
        this.popupProductCollection.hide();
        this.getDataProducts(this.pagination.number, this.filterArray);
        this.selectList = [];
      },
      error => {
        this.scrollToTop();
        this.alertService.error(error.msg);
      }
    );
  }

  scrollToTop() {
    let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, 'body');
    this.pageScrollService.start(pageScrollInstance);
  }


}
