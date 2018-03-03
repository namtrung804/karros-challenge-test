import {Component, ElementRef, EventEmitter, Inject, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {AuthenticationService} from '../../../services/authentication.service';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ValidationService} from '../../../services/validation.service';
import {AppComponent} from '../../app.component';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin'
import {Observable} from 'rxjs/Observable';
import {Product} from '../../../models/product';
import {AlertService} from '../../../services/alert.service';
import {ProductService} from '../../../services/product.service';
import {ProductImages} from '../../../models/product-images';
import {PageScrollInstance, PageScrollService} from 'ng2-page-scroll';
import {DOCUMENT} from '@angular/common';
import {Variant} from '../../../models/variant';
import {ModalDirective} from 'ngx-bootstrap';
import {CollectionService} from '../../../services/collection.service';
import {Collection} from '../../../models/collection';

import {ProductTypeVendor} from '../../../models/product-type-vendor';
import {OPTIONS, ProductOption} from '../../../models/product-option';
import {CustomValidators} from 'ng2-validation';
import {Subject} from 'rxjs/Subject';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

import {PopupManagerImagesComponent} from '../../shared-module/popup-manager-images/popup-manager-images.component';
import {PopupManagerTagsComponent} from '../../shared-module/popup-manager-tags/popup-manager-tags.component';
import {HeaderMainComponent} from '../../layout-main/header-main/header-main.component';

const _ = require('lodash');
require('lodash.product');

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent implements OnInit {
  product: any = new Product();
  @Input() variant: any = new Variant();
  loading = false;
  dataForm: FormGroup;
  @Input() ckeditorContent: string;
  editSearchEngine = false;
  validationMessages: any;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('priceVariants') priceVariants: ElementRef;
  filesToUpload: any = [];
  productImages: any = [];
  @ViewChild('popupImageDelete') public popupImageDelete: ModalDirective;
  imageDelete: any;
  isShowProductType: boolean = false;
  productTypeSearch: string = '';
  public boxProductTypeSearch = new Subject<string>();
  @ViewChild('productTypeSearchVari') productTypeSearchVari: any;
  isShowCollection: boolean = false;
  selectedCollections: any = [];
  collectionsCustom: Collection[] = [];
  collectionsCustomTemp: Collection[] = [];
  productType: ProductTypeVendor[] = [];
  productTypeTemp: ProductTypeVendor[] = [];
  productVendor: ProductTypeVendor[] = [];
  productVendorTemp: ProductTypeVendor[] = [];
  isShowVendor: boolean = false;
  vendorSearch: string = '';
  public boxVendorSearch = new Subject<string>();
  @ViewChild('vendorSearchVari') vendorSearchVari: any;
  productTag: any = [];
  productTagTemp: any = [];
  @ViewChild('popupProductTag') public popupProductTag: ModalDirective;
  isShowProductTag: boolean = false;
  tagSearch: string = '';
  @ViewChild('productTagSearch') productTagSearch: any;
  @ViewChild('popupVariantDelete') popupVariantDelete: any;
  @ViewChild('popupMultiVariantDelete') popupMultiVariantDelete: any;
  @ViewChild('popupChangePriceVariant') popupChangePriceVariant: any;
  @ViewChild('popupChangeQuantityVariant') popupChangeQuantityVariant: any;
  @ViewChild('popupDuplicateVariant') popupDuplicateVariant: any;
  @ViewChild('popupChangeOptionsVariant') popupChangeOptionsVariant: any;
  @ViewChild('popupReorderOptionVariants') popupReorderOptionVariants: any;
  isShowBulkAction = false;
  public boxSearchTags = new Subject<string>();
  public boxSearchCollections = new Subject<string>();
  isCreateVariants: boolean = false;
  selectList: any = [];
  variantDelete: Variant;
  isSetQuantiyVariant: boolean = true;
  listVariantsChange: Variant[] = [];
  tableVariantsMore: any = [];
  imgIDVariantSelected: number = 0;
  optionDuplicate: string;
  addMoreOptionsPopup: ProductOption[] = [];
  confirmDeleteOption: any = {
    status: false,
    option: '',
    value: ''
  };
  isDragValue: boolean = false;

  @ViewChild(PopupManagerImagesComponent)
  private PopupManagerImagesComponent: PopupManagerImagesComponent;

  // show header main
  isShowBar = false;
  isChanged = false;

  @ViewChild(HeaderMainComponent)
  private HeaderMainComponent: HeaderMainComponent;
  @ViewChild(PopupManagerTagsComponent)
  private PopupManagerTagsComponent: PopupManagerTagsComponent;

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
    this.appComponent.bodyClass = 'page-products-new';
  }

  ngOnInit() {
    this.buildForm();
    this.route.params.subscribe((params) => {
        if (params.id) {
          this.getData(params.id);
        }
      }
    )
    ;
    this.getAllCustomCollections();
    this.getAllProductType();
    this.getAllProductVendor();
    this.getAllProductTag();
    // search product type
    this.searchProductType();
    // search vendor
    this.searchVendor();
    // search tags
    // this.searchTag();
    // search Collections
    this.searchCollections();
  }


  getData(productId: number) {
    this.productService.getProductByID(productId).subscribe(
      data => {
        this.product = data;
        this.productImages = this.product.images;
        if (this.product.custom_collections.length) {
          for (let custom of this.product.custom_collections) {
            this.selectedCollections.push(custom.id);
          }
        }
        // Variants
        if (this.product.variants.length) {
          if (this.product.variants[0].title == 'Default Title' && this.product.variants[0].option1 == 'Default Title') {
            this.product.variant = this.product.variants[0];
          } else {
            this.setDataVariants(this.product.variants);
          }
        } else {
          this.product.variant = new Variant();
        }
        // Options
        if (!this.product.options.length) {
          this.product.options.push(new ProductOption());
        }
        this.setDataOptions(this.product.options);
      }
    );
  }

  buildForm(): void {
    this.validationMessages = {
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
      'variant': {
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
      },
      // if FormArray don't forget '[]'
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
    };
    this.dataForm = this.formBuilder.group({
      id: [null, [
        Validators.required
      ]
      ],
      title: [null, [
        Validators.required,

      ]
      ],
      body_html: [null, [
        // Validators.required
      ]
      ],
      metafield_title: [null, [
        Validators.required,
        Validators.maxLength(70)
      ]
      ],
      metafield_description: [null, [
        Validators.required,
        Validators.maxLength(160)
      ]
      ],
      handle: [null, [
        Validators.required
      ]
      ],
      variant: this.initVariants(),
      variants: this.formBuilder.array([]),
      options: this.formBuilder.array([]),
      vendor: [null, [
        // Validators.required
      ]
      ],
      product_type: [null, [
        // Validators.required
      ]
      ],
    });

    if (this.product.id == -1) {
      // Options
      this.setDataOptions(this.product.options);
    }


    // form value change
    this.onChangesForm();
  }

  // Variants

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

// Event Select Variants table
  clickSelectAll(element: HTMLInputElement) {
    let elems = document.querySelectorAll('.input-checkbox');
    this.selectList = [];
    this.listVariantsChange = [];
    if (element) {
      // Select all
      [].forEach.call(elems, function (el: any) {
        el.checked = true;
      });
      for (const item in this.product.variants) {
        this.selectList.push(this.product.variants[item].id);
        this.listVariantsChange.push(this.product.variants[item]);
      }
    } else {
      [].forEach.call(elems, function (el: any) {
        el.checked = false;
      });
    }
  }

  clickSelect(variant: Variant, checked: boolean) {
    this.imgIDVariantSelected = variant.image_id;
    if (checked) {
      this.selectList.push(variant.id);
      this.listVariantsChange.push(variant);
    } else {
      this.selectList = this.selectList.filter((item: any, index: any) => item !== variant.id);
      this.listVariantsChange = this.listVariantsChange.filter((item: any, index: any) => item.id !== variant.id);
    }
  }

  clickFilterByOptionValue(type: string, optionValue: string) {
    this.selectList = [];
    this.listVariantsChange = [];
    let elems = document.querySelectorAll('.input-checkbox');
    [].forEach.call(elems, function (el: any) {
      el.checked = false;
    });
    if (this.product.variants.length) {
      for (let item of this.product.variants) {
        if (item[type] == optionValue) {
          this.selectList.push(item.id);
          this.listVariantsChange.push(item);
          [].forEach.call(elems, function (el: any) {
            if (el.value == item.id) {
              el.checked = true;
            }
          });
        }
      }
    }
  }

  // End Event Select Variants table
  showPopupDeleteVariant(variant: any) {
    this.variantDelete = variant.value;
    this.popupVariantDelete.show();
  }


  deleteVariant() {
    this.product = this.productService.reCalculatorOptionsVariants(this.product, this.variantDelete.id);
    this.productService.deleteVariant(this.variantDelete.id, this.product.id).subscribe(
      data => {
        if (data.code == 200) {
          this.productService.update({
            options: this.product.options
          }, this.product.id).subscribe(
            result => {
              this.getData(this.product.id);
              this.popupVariantDelete.hide();
            }
          );
        } else {
          this.alertService.error(data.msg);
        }
      }
    );
  }

  deleteMultiVariant() {
    this.product = this.productService.reCalculatorOptionsVariants(this.product, this.selectList);
    let data = {
      operation: 'destroy',
      variant_ids: this.selectList,
    };
    this.productService.variantsBulkAction(data, this.product.id).subscribe((respone) => {
      if (respone.code == 200) {
        this.productService.update({
          options: this.product.options
        }, this.product.id).subscribe(
          result => {
            this.selectList = [];
            this.listVariantsChange = [];
            this.getData(this.product.id);
            this.popupMultiVariantDelete.hide();
          }
        );
      }
    })
  }

  changePriceVariant(price: number) {
    if (_.isNaN(_.toNumber(price)) || !price) {
      // Check number
      this.alertService.error(this.validationMessages.variant.price.number);
      return;
    }
    const temp: any = [];
    this.updateVariants('price', price).subscribe((respone) => {
      this.getData(this.product.id);
      this.popupChangePriceVariant.hide();
    });
  }

  changeQuantity(quantity: number) {
    this.listVariantsChange = this.listVariantsChange.filter((item: any) => {
      if (this.isSetQuantiyVariant) {
        item.inventory_quantity = _.toNumber(quantity);
      } else {
        item.inventory_quantity += _.toNumber(quantity);
      }
      return item;
    });
  }

  changeQuantityVariants() {
    this.updateVariants().subscribe((respone) => {
      this.getData(this.product.id);
      this.tableVariantsMore.push({
        col: 'inventory_quantity',
        header: 'Inventory'
      });
      this.popupChangeQuantityVariant.hide();
    });
  }


  changeInventoryPolicy(value: boolean) {
    this.updateVariants('inventory_policy', value).subscribe((respone) => {
      this.getData(this.product.id);
      this.scrollToTop();
      this.alertService.success('Update inventory policy success');
    });
  }

  showPopupDuplicateVariant(option: string) {
    this.optionDuplicate = option;
    this.popupDuplicateVariant.show();
  }

  duplicateValueOption(value: string) {
    if (!value) {
      this.alertService.error('Value is require');
      return;
    }
    let optionValueNew: any = [];
    for (let key in this.product.options) {
      if (this.product.options[key].values.length) {
        if (this.product.options[key].values.indexOf(value) != -1) {
          this.alertService.error('Value is exist');
          return;
        }
        if (this.product.options[key].name == this.optionDuplicate) {

          this.product.options[key].values.push(value);
        }
        optionValueNew.push(this.product.options[key].values);
      }
    }

    let isAdd = this.addVariants(optionValueNew, value);
    if (isAdd) {
      this.popupDuplicateVariant.hide();
    }
  }

  updateVariants(col: string = '', value: any = ''): Observable<any> {
    const temp: any = [];
    for (let vari of this.listVariantsChange) {
      if (col != '') {
        vari[col] = value;
      }
      temp.push(this.productService.updateVariant(vari, this.product.id).map(
        result => result)
      );
    }
    return Observable.forkJoin(temp);

  }

  addVariants(optionValueNew: any, value: string = ''): Observable<any> {

    let ok = false;
    let combinationsNew: any = [];
    if (optionValueNew.length == 1) {
      combinationsNew = _.product(optionValueNew[0]);
    } else if (optionValueNew.length == 2) {
      combinationsNew = _.product(optionValueNew[0], optionValueNew[1]);
    } else if (optionValueNew.length == 3) {
      combinationsNew = _.product(optionValueNew[0], optionValueNew[1], optionValueNew[2]);
    }
    let tempCombi = value == '' ? combinationsNew : combinationsNew.filter((item: any, index: number) => item.indexOf(value) != -1);
    const temp: any = [];
    if (tempCombi.length) {
      for (let combi of tempCombi) {
        let temVari = JSON.parse(JSON.stringify(this.product.variants[0]));
        delete temVari.id;
        temVari.option1 = !_.isUndefined(combi[0]) ? combi[0] : '';
        temVari.option2 = !_.isUndefined(combi[1]) ? combi[1] : '';
        temVari.option3 = !_.isUndefined(combi[2]) ? combi[2] : '';
        temVari.title = temVari.option1;
        if (temVari.option2 != '') {
          temVari.title += ' / ' + temVari.option2;
        }
        if (temVari.option3 != '') {
          temVari.title += ' / ' + temVari.option3;
        }
        temp.push(this.productService.addVariant(temVari, this.product.id).map(
          result => result)
        );
      }
    }
    Observable.forkJoin(temp).subscribe((respone) => {
      this.productService.update({
        options: this.product.options
      }, this.product.id).subscribe(
        data => {
          if (data.code == 200) {
            this.getData(this.product.id);
            ok = true;
          }
        }
      );
    });
    return Observable.of(ok);
  }

  // Options
  setDataOptions(options: ProductOption[]) {
    this.clearAllOption();
    const control = <FormArray>this.dataForm.controls['options'];
    for (let option of options) {
      let FGr = this.initOptions(option);
      control.push(FGr);
    }
  }

  initOptions(data: any = []) {
    return this.formBuilder.group({
      id: [data!.id,
      ],
      product_id: [data!.product_id,
      ],
      name: [data!.name,
      ],
      position: [data!.position,
      ],
      values: [data!.values,
      ],
    });
  }

  addOption() {
    const control = <FormArray>this.dataForm.controls['options'];
    let dataAdd = new ProductOption();
    dataAdd.product_id = this.product.id;
    if (control.length && control.length < 3) {
      let optionArr = OPTIONS;
      for (let option of control.controls) {
        optionArr = optionArr.filter((item: any, index: number) => option.get('name').value != item);
      }
      dataAdd.name = optionArr[0];
    }

    const addrCtrl = this.initOptions(dataAdd);
    control.push(addrCtrl);
  }

  removeOption(i: number) {
    const control = <FormArray>this.dataForm.controls['options'];
    control.removeAt(i);
    this.onAddValueOption();
  }

  clearAllOption() {
    const options = <FormArray>this.dataForm.controls['options'];
    if (options.length) {
      for (let i = options.length - 1; i >= 0; i--) {
        options.removeAt(i);
      }
    }
  }

  onAddValueOption() {
    // Variants
    let tempVariant = [];
    const options = <FormArray>this.dataForm.controls['options'];
    let optionValue = [];
    for (let key in options.controls) {
      if (!_.isUndefined(options.controls[key]) && options.controls[key].get('values').value.length) {
        optionValue.push(options.controls[key].get('values').value);
      }
    }
    let combinations;
    if (optionValue.length == 1) {
      combinations = _.product(optionValue[0]);
    } else if (optionValue.length == 2) {
      combinations = _.product(optionValue[0], optionValue[1]);
    } else if (optionValue.length == 3) {
      combinations = _.product(optionValue[0], optionValue[1], optionValue[2]);
    }
    if (combinations.length) {
      for (let combi of combinations) {
        let variant = new Variant();
        let variantForm = this.dataForm.controls['variant'].value;
        variant.product_id = this.product.id;
        variant.barcode = variantForm.barcode;
        variant.compare_at_price = variantForm.compare_at_price;
        variant.grams = variantForm.grams;
        variant.weight_unit = variantForm.weight_unit;
        variant.metafield = variantForm.metafield;
        variant.price = variantForm.price;
        variant.sku = variantForm.sku;
        variant.inventory_policy = variantForm.inventory_policy;
        variant.inventory_quantity = variantForm.inventory_quantity;
        variant.inventory_management = variantForm.inventory_management;
        variant.metafields_global_harmonized_system_code = variantForm.metafields_global_harmonized_system_code;
        variant.option1 = !_.isUndefined(combi[0]) ? combi[0] : '';
        variant.option2 = !_.isUndefined(combi[1]) ? combi[1] : '';
        variant.option3 = !_.isUndefined(combi[2]) ? combi[2] : '';
        variant.title = variant.option1;
        if (variant.option2 != '') {
          variant.title += ' / ' + variant.option2;
        }
        if (variant.option3 != '') {
          variant.title += ' / ' + variant.option3;
        }
        tempVariant.push(variant);
      }
    }
    this.setDataVariants(tempVariant);
  }

  addOptionPopup() {
    const control = this.product.options;
    let dataAdd = new ProductOption();
    dataAdd.product_id = this.product.id;
    if (control.length && control.length < 3) {
      let optionArr = OPTIONS;
      for (let option of control) {
        optionArr = optionArr.filter((item: any, index: number) => option.name != item);
      }
      dataAdd.name = optionArr[0];
    }
    this.addMoreOptionsPopup.push(dataAdd);
  }

  removeOptionPopup(i: number) {
    this.addMoreOptionsPopup = this.addMoreOptionsPopup.filter((item: any, index: number) => index != i);
  }

  confirmDeleteOptions() {

    if (this.confirmDeleteOption.status) {
      this.selectList = [];
      if (this.confirmDeleteOption.value == '') {
        // delete option
        let optionValueNew: any = [];
        this.product.options = this.product.options.filter((item: any, index: number) => {
          if (item.values.length && item.name != this.confirmDeleteOption.option) {
            optionValueNew.push(item.values);
            return item;
          }
        });
        // delete all variants
        this.selectList = [];
        for (let variant of this.product.variants) {
          this.selectList.push(variant.id);
        }
        let data = {
          operation: 'destroy',
          variant_ids: this.selectList,
        };
        this.productService.variantsBulkAction(data, this.product.id).subscribe((respone) => {
          this.selectList = [];
          // recreate Variants
          let isAdd = this.addVariants(optionValueNew);
          if (isAdd) {
            this.popupChangeOptionsVariant.hide();
            this.confirmDeleteOption = {
              status: false,
              option: '',
              value: ''
            }
          }
        })
      } else {
        // delete value option
        let int = 0;
        this.product.options = this.product.options.filter((item: any, index: number) => {
          if (item.name == this.confirmDeleteOption.option && _.isArray(item.values)) {
            int = index;
            item.values = item.values.filter((val: string) => val != this.confirmDeleteOption.value);
          }
          return item;
        });
        for (let variant of this.product.variants) {
          if (variant['option' + (int + 1)] == this.confirmDeleteOption.value) {
            this.selectList.push(variant.id);
          }
        }
        // delete vairants
        let data = {
          operation: 'destroy',
          variant_ids: this.selectList,
        };
        this.productService.variantsBulkAction(data, this.product.id).subscribe((respone) => {
          this.selectList = [];
          // update option
          this.productService.update({
            options: this.product.options
          }, this.product.id).subscribe(
            result => {
              if (result.code == 200) {
                this.confirmDeleteOption = {
                  status: false,
                  option: '',
                  value: ''
                };
                this.popupChangeOptionsVariant.hide();
                this.getData(this.product.id);
              }
            }
          );
        })

      }
    }

  }

  changeOptionVariant() {
    let optionValueNew: any = [];

    for (let key in this.product.options) {
      if (this.product.options[key].values.length) {
        optionValueNew.push(this.product.options[key].values);
      }
    }
    if (this.addMoreOptionsPopup.length) {
      // delete all variants
      this.selectList = [];
      for (let variant of this.product.variants) {
        this.selectList.push(variant.id);
      }
      let data = {
        operation: 'destroy',
        variant_ids: this.selectList,
      };
      this.productService.variantsBulkAction(data, this.product.id).subscribe((respone) => {
        this.selectList = [];
        // recreate Variants
        let isAdd;
        for (let optionMore of this.addMoreOptionsPopup) {
          let value = JSON.parse(JSON.stringify(optionMore.values));
          let temp = [];
          temp.push(optionMore.values);
          optionMore.values = temp;
          this.product.options.push(optionMore);
          optionValueNew.push(optionMore.values);
          isAdd = this.addVariants(optionValueNew, value);
        }
        if (isAdd) {
          this.popupChangeOptionsVariant.hide();
          this.addMoreOptionsPopup = [];
          return;
        }
      });
    }

  }

  cancelPopupChangeOptionsVariant() {
    this.getData(this.product.id);
    this.popupChangeOptionsVariant.hide();
  }

  reorderOptions() {
    // reorder option
    let optionValueNew: any = [];
    for (let key in this.product.options) {
      this.product.options[key].position = parseInt(key) + 1;
      if (this.product.options[key].values.length) {
        optionValueNew.push(this.product.options[key].values);
      }
    }
    // delete all variants
    this.selectList = [];
    for (let variant of this.product.variants) {
      this.selectList.push(variant.id);
    }
    let data = {
      operation: 'destroy',
      variant_ids: this.selectList,
    };
    this.productService.variantsBulkAction(data, this.product.id).subscribe((respone) => {
      this.selectList = [];
      // recreate Variants
      let isAdd = this.addVariants(optionValueNew);
      if (isAdd) {
        this.popupReorderOptionVariants.hide();
      }
    })
  }

  // End Options

  changeTitle(value: any) {
    this.product.metafield_title = value;
    if (value != null) {
      if (this.product.title.length > 70) {
        this.product.metafield_title = value.slice(0, 70);
      }
    }
    this.product.handle = this.productService.toSeoUrl(value);
    if (this.product.metafield_title != null && this.product.metafield_title.length > 160) {
      this.product.metafield_title = this.product.metafield_title.slice(0, 160);
    }
  }

  onChangesForm() {
    this.dataForm.valueChanges.subscribe(data => {
      // if (data.body_html != null && this.product.metafield_description != data.metafield_description) {
      if (data.body_html != null) {
        this.product.metafield_description = this.productService.removeHtmlTag(data.body_html);
      }
    })
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
    model.collection_ids = this.selectedCollections;
    model.tags = this.product.tags;
    if (model.options.length) {
      for (let key in model.options) {
        model.options[key].position = parseInt(key) + 1;
      }
    }
    if ((!this.isCreateVariants && model.id == -1) || (model.id != -1 && !model.variants.length)) {
      model.variant.product_id = model.id;
      model.variants.push(model.variant);
      delete model.options;
    }

    delete model.variant;
    this.loading = true;
    if (model.id == -1) {
      //insert
      delete model.id;
      this.productService.create(model).subscribe(
        data => {
          this.uploadImage(data.product.id);
        },
        error => {
          this.scrollToTop();
          this.alertService.error(error.msg);
        }
      )
    } else {
      //update
      this.productService.update(model, this.product.id).subscribe(
        data => {
          this.getData(this.product.id);
          this.scrollToTop();
          this.alertService.success('Update product success');
          this.HeaderMainComponent.isShowBar = false;
          this.HeaderMainComponent.isChanged = false;
        },
        error => {
          this.scrollToTop();
          this.alertService.error(error.msg);
        }
      );
    }
  }


  uploadImage(productID: number) {
    const files: Array<File> = this.filesToUpload;
    const temp: any = [];
    if (files.length) {
      for (const key in files) {
        const formData: any = new FormData();
        formData.append('image', files[key]);
        temp.push(this.productService.uploadImage(formData, productID).map(
          result => result)
        );
      }
      Observable.forkJoin(temp).subscribe((respone: any) => {
        if (this.product.id == -1) {
          return Observable.of(this.router.navigate(['/products', productID]));
        } else {
          return this.getData(this.product.id);
        }

      });
    } else {
      if (this.product.id == -1) {
        this.router.navigate(['/products', productID]);
      } else {
        this.getData(this.product.id);
      }
    }

  }

  onDragPositionImage(index: number, image: any) {
    this.productService.reoderImage({position: index}, this.product.id, image.id).subscribe(
      result => {
        if (result.code == 200) {
          this.getData(this.product.id);
        }
      });
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.filesToUpload = [];
      for (const key in  event.target.files) {
        let reader = new FileReader();
        let file = event.target.files[key];
        if (!_.isUndefined(file.size)) {
          reader.readAsDataURL(file);
          reader.onload = () => {
            let image = new ProductImages();
            image.src = reader.result;
            this.productImages.push(image);
            this.filesToUpload.push(file);
          };
        }
      }
      // upload file when product != -1
      setTimeout(() => {
        if (this.product.id != -1) {
          this.uploadImage(this.product.id);
        }
      }, 100);

    }
  }

  showPopupDeleteImage(image: ProductImages) {
    this.imageDelete = image;
    this.popupImageDelete.show();
  }

  deleteImage() {
    this.productService.deleteImage(this.imageDelete.id, this.product.id).subscribe(
      data => {
        if (data.code == 200) {
          this.productImages = this.productImages.filter((item: any, index: any) => item.id !== this.imageDelete.id);
          this.alertService.success('Delete image success');
          this.popupImageDelete.hide();
        } else {
          this.alertService.error(data.msg);
        }
      }
    );

  }

  // Collections
  getAllCustomCollections() {
    this.collectionService.getAllCustomCollections().subscribe(
      data => {
        this.collectionsCustom = data;
        this.collectionsCustomTemp = JSON.parse(JSON.stringify(data));
      }
    )
  }

  addCollection(collection: Collection) {
    if (this.selectedCollections.indexOf(collection.id) != -1) {
      this.selectedCollections = this.selectedCollections.filter((item: any) => item != collection.id);
      this.product.custom_collections = this.product.custom_collections.filter((item: any) => item.id != collection.id);
    } else {
      this.selectedCollections.push(collection.id);
      this.product.custom_collections.push(collection);
    }
  }

  searchCollections() {
    this.boxSearchCollections.pipe(
      debounceTime(500),
      distinctUntilChanged(),
    ).subscribe((value) => {
      if (!value) {
        this.collectionsCustom = this.collectionsCustomTemp;
        return;
      }
      this.collectionsCustom = this.collectionsCustomTemp.filter((item: any, index: number) => item.title != null
        && item.title.toLowerCase().indexOf(value.toLowerCase()) > -1);
    });
  }

  // End Collections

  // Product Type / Product Vendor
  addProductType(data: string, close: boolean = false) {
    this.product.product_type = data;
    if (close) {
      this.productTypeSearch = '';
      this.isShowProductType = false;
    }
  }

  searchProductType() {
    this.boxProductTypeSearch.pipe(
      debounceTime(500),
      distinctUntilChanged(),
    ).subscribe((value) => {
      this.isShowProductType = true;
      this.productTypeSearch = value;
      if (!value) {
        this.productType = this.productTypeTemp.filter((item: any, index: number) => item.title != null
          && this.product.product_type.indexOf(item.title) == -1);
        return;
      }
      this.productType = this.productTypeTemp.filter((item: any, index: number) => this.product.product_type.indexOf(item.title) == -1
        && item.title != null && item.title.toLowerCase().indexOf(value.toLowerCase()) > -1);
    });
  }

  getAllProductType() {
    this.productService.getAllProductType().subscribe(
      data => {
        this.productType = data;
        this.productTypeTemp = JSON.parse(JSON.stringify(data));
      }
    )
  }

  addVendor(data: string, close: boolean = false) {
    this.product.vendor = data;
    if (close) {
      this.vendorSearch = '';
      this.isShowVendor = false;
    }
  }

  searchVendor() {
    this.boxVendorSearch.pipe(
      debounceTime(500),
      distinctUntilChanged(),
    ).subscribe((value) => {
      this.isShowVendor = true;
      this.vendorSearch = value;
      if (!value) {
        this.productVendor = this.productVendorTemp.filter((item: any, index: number) => item.title != null
          && this.product.vendor.indexOf(item.title) == -1);
        return;
      }
      this.productVendor = this.productVendorTemp.filter((item: any, index: number) => this.product.vendor.indexOf(item.title) == -1
        && item.title != null && item.title.toLowerCase().indexOf(value.toLowerCase()) > -1);
    });
  }

  getAllProductVendor() {
    this.productService.getAllProductVendor().subscribe(
      data => {
        this.productVendor = data;
        this.productVendorTemp = JSON.parse(JSON.stringify(data));
      }
    )
  }

  // End Product Type / Product Vendor

  // Tags modal
  // Product Tag
  getAllProductTag() {
    this.productService.getAllTag().subscribe(
      data => {
        this.productTagTemp = data;
      }
    )
  }

  reloadData(event: any) {
    if (event.isChanged) {
      this.product.tags = event.tagsExists;
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
      this.getData(this.product.id);
    }
  }
  // END Tags modal
}
