import {Component, ElementRef, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {AuthenticationService} from "../../../services/authentication.service";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AlertService} from "../../../services/alert.service";
import {DOCUMENT} from "@angular/common";
import {PageScrollInstance, PageScrollService} from "ng2-page-scroll";
import {AppComponent} from "../../app.component";
import {CollectionService} from "../../../services/collection.service";

import {ProductService} from "../../../services/product.service";
import {ValidationService} from "../../../services/validation.service";
import {Variant} from "../../../models/variant";
import {Product} from "../../../models/product";
import {CustomValidators} from "ng2-validation";
import {Observable} from "rxjs/Observable";
import {ProductDetailComponent} from "../product-detail/product-detail.component";
import {PopupManagerImagesComponent} from "../../shared-module/popup-manager-images/popup-manager-images.component";

const _ = require('lodash');
require('lodash.product');

@Component({
  selector: 'app-product-add-variant',
  templateUrl: './product-add-variant.component.html'
})
export class ProductAddVariantComponent implements OnInit {
  product: any = new Product();
  loading = false;
  dataForm: FormGroup;
  validationMessages: any;
  variantID: number = 0;
  variant: any = new Variant();
  @ViewChild(PopupManagerImagesComponent)
  public PopupManagerImagesComponent: PopupManagerImagesComponent;
  imgIDVariantSelected: number = 0;
  selectList: any = [];
  listVariantsChange: any = [];
  @ViewChild('popupDeleteVariant') popupDeleteVariant: any;

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute,
              private authenticationService: AuthenticationService,
              private alertService: AlertService,
              private formBuilder: FormBuilder,
              private elementRef: ElementRef,
              private translate: TranslateService,
              private validationService: ValidationService,
              private productService: ProductService,
              private pageScrollService: PageScrollService,
              private collectionService: CollectionService,
              @Inject(DOCUMENT) private document: any,
              private appComponent: AppComponent) {
    this.appComponent.bodyClass = 'fresh-ui page-product-variants-show';
  }

  ngOnInit() {
    this.buildForm();
    this.route.params.subscribe((params) => {
        this.selectList = [];
        this.listVariantsChange = [];
        if (_.isUndefined(params.productId)) {
          this.router.navigate(['products']);
        }
        if (!_.isUndefined(params.id)) {
          this.variantID = params.id;
        }
        this.getData(params.productId);
      }
    )
    ;
  }

  buildForm(): void {
    this.validationMessages = {
      'price': {
        'required': 'variant price is require',
        'number': 'variant price must be a numeric'
      },
      'compare_at_price': {
        'required': 'variant compare price is require',
        'number': 'variant compare price must be a numeric'
      },
      'metafields_global_harmonized_system_code': {
        'number': 'Metafields global must be a numeric'
      }
    };
    this.dataForm = this.initVariant(this.variant);
  }

  initVariant(data: any = []) {
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

  getData(productId: number) {
    this.productService.getProductByID(productId).subscribe(
      data => {
        this.product = data;
        if (this.product.variants[0].title == 'Default Title' && this.product.variants[0].option1 == 'Default Title') {
          this.router.navigate(['products', this.product.id]);
          return;
        }
        if (this.variantID != 0) {
          for (let variant of this.product.variants) {
            if (variant.id == this.variantID) {
              this.variant = variant;
              this.dataForm = this.initVariant(this.variant);
              this.selectList.push(this.variant.id);
              this.listVariantsChange.push(this.variant);
              break;
            }
          }
        }

      }
    );
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
    model.product_id = this.product.id;
    model.title = model.option1;
    if (model.option2 != '') {
      model.title += ' / ' + model.option2;
    }
    if (model.option3 != '') {
      model.title += ' / ' + model.option3;
    }
    for (let key in this.product.options) {
      let option = model['option' + (parseInt(key) + 1)];
      if (this.product.options[key].values.indexOf(option) == -1) {
        this.product.options[key].values.push(option);
      }
    }
    if (this.variantID != 0) {
      // update variant
      this.productService.updateVariant(model, this.product.id).subscribe((result) => {
        this.productService.update({
          options: this.product.options
        }, this.product.id).subscribe(
          response => {
            this.scrollToTop();
            this.alertService.success(result.msg);
          }
        );
        return;
      })
    } else {
      // add variant
      this.productService.addVariant(model, this.product.id).subscribe((result) => {
        this.productService.update({
          options: this.product.options
        }, this.product.id).subscribe(
          response => {
            this.scrollToTop();
            this.alertService.success(result.msg);
            setTimeout(() => {
              this.router.navigate(['/products', this.product.id, 'variants', result.product_variant.id]);
              // this.router.navigate(['/products/' + this.product.id + '/variants', result.product_variant.id])
            }, 1000);
          }
        );
        return;
      })
    }
  }

  deleteVariant(variant: Variant) {
    this.product = this.productService.reCalculatorOptionsVariants(this.product, variant.id);
    this.productService.deleteVariant(variant.id, this.product.id).subscribe((result) => {
      if (result.code == 200) {
        this.productService.update({
          options: this.product.options
        }, this.product.id).subscribe(
          response => {
            this.router.navigate(['products', this.product.id]);
            return;
          }
        );
      } else {
        this.scrollToTop();
        this.alertService.success(result.msg);
      }
    });
  }

  reloadData(event: any) {
    if (this.variantID != 0) {
      if (event.reload) {
        this.getData(this.product.id);
      }
    } else {
      for (let image of this.product.images) {
        if (image.id == event.imageID) {
          this.variant.image_url = image.src;
          break;
        }
      }
      this.variant.image_id = event.imageID;
      this.dataForm = this.initVariant(this.variant);
    }

  }
}
