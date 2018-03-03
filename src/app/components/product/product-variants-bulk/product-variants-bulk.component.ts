import {Component, ElementRef, Inject, OnInit} from '@angular/core';
import {ProductService} from "../../../services/product.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ValidationService} from "../../../services/validation.service";
import {AlertService} from "../../../services/alert.service";

import {DOCUMENT} from "@angular/common";
import {PageScrollInstance, PageScrollService} from "ng2-page-scroll";
import {AppComponent} from "../../app.component";
import {Variant} from "../../../models/variant";
import {Product} from "../../../models/product";
import {CustomValidators} from "ng2-validation";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin'

const _ = require('lodash');

@Component({
  selector: 'app-product-variants-bulk',
  templateUrl: './product-variants-bulk.component.html'
})
export class ProductVariantsBulkComponent implements OnInit {
  dataForm: FormGroup;
  validationMessages: any;
  product: any = new Product();
  listVariants: any = [];
  isShowBulkAction = false;
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
        if (_.isUndefined(params.productId) || _.isUndefined(params.ids)) {
          this.router.navigate(['products']);
        }
        this.getData(params.productId);
        this.listVariants = params.ids.split(',');
      }
    )
    ;
  }

  buildForm(): void {
    this.validationMessages = {
      'variants': {
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
      },
    };
    this.dataForm = this.formBuilder.group({
      variants: this.formBuilder.array([]),
    });
  }

  setDataVariants(variants: Variant[]) {
    this.clearAllVariants();
    const control = <FormArray>this.dataForm.controls['variants'];
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
    const control = <FormArray>this.dataForm.controls['variants'];
    const addrCtrl = this.initVariants(data);
    control.push(addrCtrl);
  }

  removeVariant(i: number) {
    const control = <FormArray>this.dataForm.controls['variants'];
    control.removeAt(i);
  }


  clearAllVariants() {
    const options = <FormArray>this.dataForm.controls['variants'];
    if (options.length) {
      for (let i = options.length - 1; i >= 0; i--) {
        this.removeVariant(i);
      }
    }
  }

  getData(productId: number) {
    this.productService.getProductByID(productId).subscribe(
      data => {
        this.product = data;
        for (let variant of this.product.variants) {
          if (this.listVariants.indexOf(variant.id.toString()) != -1) {
            this.addVariant(variant);
          }
        }
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
    for (let variant of model.variants) {
      temp.push(this.productService.updateVariant(variant, this.product.id).map(
        result => result)
      );
    }
    Observable.forkJoin(temp).subscribe((respone: any) => {
      console.log(respone);
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
