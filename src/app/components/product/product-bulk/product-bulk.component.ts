import {Component, ElementRef, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProductService} from "../../../services/product.service";
import {AppConfig} from "../../../config/app.config";
import {ValidationService} from "../../../services/validation.service";
import {PageScrollInstance, PageScrollService} from "ng2-page-scroll";
import {AppComponent} from "../../app.component";
import {DOCUMENT} from "@angular/common";
import {AlertService} from "../../../services/alert.service";
import {Product} from "../../../models/product";
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin'
import {Variant} from "../../../models/variant";
import {CustomValidators} from "ng2-validation";
import {Observable} from "rxjs/Observable";

const _ = require('lodash');

@Component({
  selector: 'app-product-bulk',
  templateUrl: './product-bulk.component.html'
})
export class ProductBulkComponent implements OnInit {
  dataForm: FormGroup;
  validationMessages: any;
  products: any = [];
  listBulk: any = [];
  isShowBulkAction = false;
  keyProduct: number = 0;
  headerTable: any = [
    {
      col: 'sku',
      name: 'SKU'
    },
    {
      col: 'price',
      name: 'Price'
    },
    {
      col: 'compare_at_price',
      name: 'Compare at price'
    },
  ];

  constructor(private router: Router, private route: ActivatedRoute,
              private alertService: AlertService,
              private formBuilder: FormBuilder,
              private elementRef: ElementRef,
              private config: AppConfig,
              private validationService: ValidationService,
              private productService: ProductService,
              private pageScrollService: PageScrollService,
              @Inject(DOCUMENT) private document: any,
              private appComponent: AppComponent) {
    this.appComponent.bodyClass = 'page-bulk-index';
  }

  ngOnInit() {
    this.buildForm();
    this.route.params.subscribe((params) => {
        if (_.isUndefined(params.ids)) {
          this.router.navigate(['products']);
        }
        for (let id of params.ids.split(',')) {
          this.getData(parseInt(id));
        }

      }
    )
    ;
  }

  buildForm(): void {
    this.validationMessages = {
      'products': [{
        'id': {
          'required': 'id is require',
        },
        'title': {
          'required': 'title is require',
        },
        'metafield_title': {
          'required': 'metafield title is require',
          'maxLength': 'metafield title max length is 70 characters',
        },
        'metafield_description': {
          'required': 'metafield description is require',
          'maxLength': 'metafield description max length is 160 characters',
        },
        'handle': {
          'required': 'handle is require',
        },
        'variants': [{
          'price': {
            'required': 'variants price is require',
            'number': 'variants price must be a numeric'
          },
          'compare_at_price': {
            'required': 'variants compare price is require',
            'number': 'variants compare price must be a numeric'
          },
          'metafields_global_harmonized_system_code': {
            'number': 'Metafields global must be a numeric'
          }
        }],
      }]
    };
    this.dataForm = this.formBuilder.group({
      products: this.formBuilder.array([]),
    });
  }

  // Products

  setDataProducts(products: Product[]) {
    this.clearAllVariants();
    const control = <FormArray>this.dataForm.controls['products'];
    for (let product of products) {
      let FGr = this.initProducts(product);
      control.push(FGr);
    }
  }

  initProducts(data: any = []) {
    return this.formBuilder.group({
      id: [data!.id, [
        Validators.required
      ]
      ],
      title: [data!.title, [
        Validators.required,

      ]
      ],
      body_html: [data!.body_html, [
        // Validators.required
      ]
      ],
      image: [data!.image, [
        // Validators.required
      ]
      ],
      metafield_title: [data!.metafield_title, [
        Validators.required,
        Validators.maxLength(70)
      ]
      ],
      metafield_description: [data!.metafield_description, [
        Validators.required,
        Validators.maxLength(160)
      ]
      ],
      handle: [data!.handle, [
        Validators.required
      ]
      ],
      variants: this.formBuilder.array([]),
      options: this.formBuilder.array([]),
      vendor: [data!.vendor, [
        // Validators.required
      ]
      ],
      product_type: [data!.product_type, [
        // Validators.required
      ]
      ],
      tags: [data!.tags, []
      ],
    });
  }

  addProducts(data: Product) {
    const control = <FormArray>this.dataForm.controls['products'];
    const addrCtrl = this.initProducts(data);
    control.push(addrCtrl);
  }

  removeProduct(i: number) {
    const control = <FormArray>this.dataForm.controls['products'];
    control.removeAt(i);
  }


  clearAllProducts() {
    const options = <FormArray>this.dataForm.controls['products'];
    if (options.length) {
      for (let i = options.length - 1; i >= 0; i--) {
        this.removeProduct(i);
      }
    }
  }

  // End products
  // Variants
  setDataVariants(variants: Variant[], productID) {
    const products = <FormArray>this.dataForm.controls.products;
    for (let key in products.value) {
      if (products.value[key].id == productID) {
        this.keyProduct = parseInt(key);
        break;
      }
    }
    this.clearAllVariants();
    const control = products['controls'][this.keyProduct]['controls'].variants;
    for (let variant of variants) {
      let FGr = this.initVariants(variant);
      control.push(FGr);
    }
  }

  initVariants(data: any = []) {
    return this.formBuilder.group({
      id: [data!.id,
      ],
      price: [data!.price, [
        Validators.required,
        CustomValidators.number
      ]],
      compare_at_price: [data!.compare_at_price,
        // Validators.required,
        CustomValidators.number
      ],
      barcode: [data!.barcode,
      ],
      grams: [data!.grams,
      ],
      weight_unit: [data!.weight_unit,
      ],
      sku: [data!.sku,
      ],
      product_id: [data!.product_id,
      ],
      metafield: [data!.metafield,
      ],
      position: [data!.position,
      ],
      inventory_policy: [data!.inventory_policy,
      ],
      inventory_quantity: [data!.inventory_quantity,
      ],
      inventory_management: [data!.inventory_management,
      ],
      image_url: [data!.image_url,
      ],
      image_id: [data!.image_id,
      ],
      metafields_global_harmonized_system_code: [data!.metafields_global_harmonized_system_code,
        CustomValidators.number
      ],
      option1: [data!.option1,
      ],
      option2: [data!.option2,
      ],
      option3: [data!.option3,
      ],
      requires_shipping: [data!.requires_shipping,
      ],
      taxable: [data!.taxable,
      ],
      title: [data!.title,
      ],
      fulfillment_service: [data!.fulfillment_service,
      ],
    });
  }

  addVariant(data: Variant) {
    const control = <FormArray>this.dataForm.controls.products['controls'][this.keyProduct]["controls"].variants;
    const addrCtrl = this.initVariants(data);
    control.push(addrCtrl);
  }

  removeVariant(i: number) {
    const control = <FormArray>this.dataForm.controls.products['controls'][this.keyProduct]["controls"].variants;
    control.removeAt(i);
  }


  clearAllVariants() {
    const control = <FormArray>this.dataForm.controls.products['controls'][this.keyProduct]["controls"].variants;
    if (control.length) {
      for (let i = control.length - 1; i >= 0; i--) {
        this.removeVariant(i);
      }
    }
  }

  getData(productId: number) {
    this.productService.getProductByID(productId).subscribe(
      data => {
        // Variants
        if (data.variants.length) {
          this.addProducts(data);
          this.setDataVariants(data.variants, productId);
        }
        this.products.push(data);

      }
    );
  }

  checkHeaderTable(col) {
    return _.findIndex(this.headerTable, function (o) {
      return o.col == col
    });
  }

  addHeaderTable(col, name) {
    this.headerTable.push({
      col: col,
      name: name,
    })
  }

  removeHeaderTable(i) {
    this.headerTable = this.headerTable.filter((item: any, index: number) => index != i);
  }

  scrollToTop() {
    let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, 'body');
    this.pageScrollService.start(pageScrollInstance);
  }

  submitForm() {
    const validation = this.validationService.validation(this.dataForm, this.validationMessages);
    if (validation != '') {
      this.scrollToTop();
      this.alertService.error(validation);
      return;
    }
    const model = this.dataForm.value;
    const temp: any = [];
    for (let product of model.products) {
      temp.push(this.productService.update(product, product.id).map(
        result => result)
      );
    }
    Observable.forkJoin(temp).subscribe((respone: any) => {
      for (let result of respone) {
        this.scrollToTop();
        if (result.code != 200) {
          this.alertService.error(result.msg);
          continue;
        }
        this.alertService.success(result.msg);
      }
    });
  }
}
