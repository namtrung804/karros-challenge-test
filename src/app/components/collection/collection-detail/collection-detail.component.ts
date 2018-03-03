import {Component, ElementRef, Inject, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ProductImages} from "../../../models/product-images";
import {Observable} from "rxjs/Observable";
import {Collection} from "../../../models/collection";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ModalDirective} from "ngx-bootstrap";
import {ActivatedRoute, Router} from "@angular/router";
import {AlertService} from "../../../services/alert.service";

import {ValidationService} from "../../../services/validation.service";
import {CollectionService} from "../../../services/collection.service";
import {PageScrollInstance, PageScrollService} from "ng2-page-scroll";
import {DOCUMENT} from "@angular/common";
import {AppComponent} from "../../app.component";
import {Product} from "../../../models/product";
import {ProductService} from "../../../services/product.service";
import {COLLECTION_COLUMN, COLLECTION_RELATION, CollectionRules} from "../../../models/collection-rules";
import * as moment from "moment";
import * as _ from "lodash";
import {debounceTime, distinctUntilChanged} from "rxjs/operators";
import {Subject} from "rxjs/Subject";
import {Pagination} from "../../../models/pagination";
import {ProductTypeVendor} from "../../../models/product-type-vendor";

@Component({
  selector: 'app-collection-detail',
  templateUrl: './collection-detail.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class CollectionDetailComponent implements OnInit {
  @Input() collection: any = new Collection();
  @Input() product: any = [];
  @Input() productTemp: any = [];
  productAdd: any = [];
  productAddTemp: any = [];
  productAddPagination = new Pagination();
  public searchProductSubject = new Subject<string>();
  @ViewChild('searchProductView') searchProductView: any;
  loading = false;
  dataForm: FormGroup;
  @Input() ckeditorContent: string;
  editSearchEngine = false;
  validationMessages: any;
  @ViewChild('fileInput') fileInput: ElementRef;
  filesToUpload: any = [];
  @ViewChild('popupCollectionDelete') public popupCollectionDelete: ModalDirective;
  @ViewChild('popupEditImage') public popupEditImage: ModalDirective;
  loadmoreProduct: number = 1;
  isShowEditImage: boolean = false;
  collectionColumn = COLLECTION_COLUMN;
  collectionRelation = COLLECTION_RELATION;
  isShowDatePicker: boolean = false;
  isShowProductAdd: boolean = false;
  collectionType: ProductTypeVendor[] = [];
  collectionVendor: ProductTypeVendor[] = [];
  collectionTag: any = [];
  isShowCondition: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute,
              private alertService: AlertService,
              private formBuilder: FormBuilder,
              private elementRef: ElementRef,
              private validationService: ValidationService,
              private productService: ProductService,
              private collectionService: CollectionService,
              private pageScrollService: PageScrollService,
              @Inject(DOCUMENT) private document: any,
              private appComponent: AppComponent) {
    this.appComponent.bodyClass = 'page-collections-show';

  }

  ngOnInit() {
    this.buildForm(new Collection());
    this.route.params.subscribe((params) => {
        if (params.id) {
          this.getData(params.id);
        }
      }
    )
    ;
    this.getAllProductType();
    this.getAllProductVendor();
    this.getAllProductTag();
    this.getDataProductsAdd(this.productAddPagination.number);
    // search product box
    this.searchProduct();
  }

  getData(id: number) {
    this.collectionService.getCollectionByID(id).subscribe(
      data => {
        if (data.code == 200) {
          this.buildForm(data.collection);
          this.productTemp = data.products;
          this.loadmoreProducts();
        } else {
          this.router.navigate(['/collections']);
        }
      }
    );
  }

  buildForm(data: any = []): void {
    this.validationMessages = {
      'id': {
        'required': 'id is require',
      },
      'title': {
        'required': 'title is require',
      },
      'handle': {
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
      'disjunctive': {
        'required': 'disjunctive is require',
      },
      'rules': [{
        'column': {
          'required': 'Column is require',
        },
        'relation': {
          'required': 'Relation is require',
        },
        'condition': {
          'required': 'Condition is require',
        },
      }]
    };
    this.dataForm = this.formBuilder.group({
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
      published: [data!.published, [
        // Validators.required
      ]
      ],
      published_at: [data!.published_at, [
        // Validators.required
      ]
      ],
      image_url: [data!.image_url, []],
      image_id: [data!.image_id, []],
      sort_order: [data!.sort_order, []],
      handle: [data!.handle, [
        Validators.required
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
      disjunctive: [data!.disjunctive, [
        Validators.required,
      ]
      ],
      collection_type: [data!.collection_type, []
      ],
      rules: this.formBuilder.array([])
    });
    this.collection = data;
    if (this.collection.rules.length) {
      this.setDataRules(this.collection.rules);
    }
    this.onChanges();
  }

  setDataRules(rules: CollectionRules[]) {
    const control = <FormArray>this.dataForm.controls['rules'];
    for (let rule of rules) {
      let FGr = this.initRule(rule);
      control.push(FGr);
    }
  }

  initRule(data: any = []) {
    return this.formBuilder.group({
      column: [data!.column, Validators.required],
      relation: [data!.relation, Validators.required],
      condition: [data!.condition, Validators.required],
    });
  }

  addRule(data: any = new CollectionRules()) {
    const control = <FormArray>this.dataForm.controls['rules'];
    const addrCtrl = this.initRule(data);
    control.push(addrCtrl);
  }

  removeRule(i: number) {
    const control = <FormArray>this.dataForm.controls['rules'];
    control.removeAt(i);
  }

  changeTitle(value: any) {
    this.collection.metafield_title = value;
    if (value != null) {
      if (this.collection.title.length > 70) {
        this.collection.metafield_title = value.slice(0, 70);
      }
    }
    this.collection.handle = this.productService.toSeoUrl(value);
    if (this.collection.metafield_title != null && this.collection.metafield_title.length > 160) {
      this.collection.metafield_title = this.collection.metafield_title.slice(0, 160);
    }
  }

  onChanges() {
    this.dataForm.valueChanges.subscribe(data => {
      if (data.body_html != null) {
        this.collection.metafield_description = this.productService.removeHtmlTag(data.body_html);
      }
    });
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
    this.loading = true;
    if (model.id == -1) {
      //insert
      delete model.id;
      this.collectionService.create(model).subscribe(
        data => {
          if (data.code == 200) {
            this.uploadImage(data.collection.id);
          } else {
            this.alertService.error(data.msg);
          }
        }
      )
    } else {
      //update
      this.collectionService.update(model, this.collection.id).subscribe(
        data => {
          if (data.code == 200) {
            //upload image
            this.scrollToTop();
            this.alertService.success("Update product success");
            this.uploadImage(this.collection.id);
          }
        }
      );
    }
  }

  deleteCollection() {
    this.collectionService.delete(this.collection.id).subscribe(
      data => {
        if (data.code == 200) {
          this.router.navigate(['/collections']);
        }
      }
    );

  }

  uploadImage(ID: number) {
    const files: Array<File> = this.filesToUpload;
    if (_.get(files, 'size', 'issetSize') !== 'issetSize') {
      const formData: any = new FormData();
      formData.append("image", files);
      this.collectionService.uploadImage(formData, ID).subscribe(
        result => {
          return this.router.navigate(['/collections', ID]);
        }
      )
    } else {
      this.router.navigate(['/collections', ID]);
    }

  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      for (const key in  event.target.files) {
        let reader = new FileReader();
        let file = event.target.files[key];
        reader.readAsDataURL(file);
        reader.onload = () => {
          let image = new ProductImages();
          image.src = reader.result;
          this.collection.image_url = image.src;
          this.filesToUpload = file;
        };
      }
    }
  }

  deleteImage() {
    this.collectionService.deleteImage(this.collection.image_id, this.collection.id).subscribe(
      data => {
        if (data.code == 200) {
          this.collection.image_url = null;
          this.collection.image_id = null;
          this.popupCollectionDelete.hide();
        } else {
          this.alertService.error(data.msg);
        }
      }
    );
  }

  loadmoreProducts() {
    this.product = this.productTemp;
    this.product = this.product.filter((item: any, index: any) => index <= this.loadmoreProduct * 10);
    this.loadmoreProduct++;
  }

  onChangeProductSort(value: string) {
    this.collectionService.collectionProductsSort(this.collection.id, {sort_order: value}).subscribe(
      data => {
        this.loadmoreProduct = 1;
        this.productTemp = data.products;
        this.loadmoreProducts();
      }
    );
  }

  choseDate(value: any) {
    let control = this.dataForm.controls;
    control.published_at.setValue(moment.parseZone(value).utc().format());
    control.published.setValue(true);
  }

  getDataProductsAdd(page: number, search: any = []) {
    this.productService.getAllProducts(page, search).subscribe(
      data => {
        this.productAddPagination = data.pagination;
        this.productAdd = data.products;
        this.productAddTemp = JSON.parse(JSON.stringify(data.products))
      }
    )
  }

  searchProduct() {
    this.searchProductSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
    ).subscribe((value) => {
      if (!value) {
        this.productAdd = this.productAddTemp;
        return;
      }
      this.productService.getAllProducts(1, [{
        param: 'q[title_cont]',
        value: value
      }]).subscribe(
        data => {
          this.productAdd = data.products;
        }
      )
    });
  }

  checkProductAdd(productID: number) {
    if (!this.product.length) {
      return -1;
    }
    return _.findIndex(this.product, function (o: any) {
      return o.id == productID;
    });
  }

  scroll(event: any) {
    const height = event.path[0].scrollHeight - event.path[0].offsetHeight;
    const scrollTop = event.path[0].scrollTop;
    if (scrollTop / height * 100 >= 90 && this.loading === false) {
      this.loading = true;
      if (this.productAddPagination.number < this.productAddPagination.totalPages) {
        this.productService.getAllProducts(this.productAddPagination.number + 1, []).subscribe(
          data => {
            this.productAddPagination = data.pagination;
            this.productAdd = _.unionWith(this.productAdd, data.products, _.isEqual);
            this.productAddTemp = JSON.parse(JSON.stringify(this.productAdd));
            setTimeout(() => {
              this.loading = false;
            }, 1000);
          }
        )

      }
    }

  }

  addProductToCollection(productID: number) {
    if (this.checkProductAdd(productID) == -1) {
      const data: any = {
        collection_id: this.collection.id,
        product_id: productID
      }
      this.collectionService.addProductToCollection(data).subscribe((response) => {
        if (response.code == 200) {
          this.getData(this.collection.id);
        }
      });
    }
  }

  removeProductToCollection(productID: number) {
    this.collectionService.removeProductToCollection(`${productID}-${this.collection.id}`).subscribe((response) => {
      if (response.code == 200) {
        this.getData(this.collection.id);
      }
    })
  }

  getAllProductType() {
    this.productService.getAllProductType().subscribe(
      data => {
        this.collectionType = data;
      }
    )
  }

  getAllProductVendor() {
    this.productService.getAllProductVendor().subscribe(
      data => {
        this.collectionVendor = data;
      }
    )
  }

  getAllProductTag() {
    this.productService.getAllTag().subscribe(
      data => {
        this.collectionTag = data;
      }
    )
  }

  addConditionRule(index: number, value: string) {
    let control = this.dataForm.controls.rules['controls'][index]['controls'];
    control.condition.setValue(value);
  }

  showConditionTooltip(index: number, column: string) {
    this.hideConditionTooltip();
    document.getElementById(`ui-popover-${column}-${index}`).classList.add('ui-popover--is-active');
  }

  hideConditionTooltip() {
    let elems = document.querySelectorAll(".show-condition-tooltip");
    [].forEach.call(elems, function (el: any) {
      el.classList.remove('ui-popover--is-active');
    });
  }
}
