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
import {CollectionService} from "../../../services/collection.service";
import {Collection} from "../../../models/collection";
import * as moment from 'moment';

const _ = require('lodash');

@Component({
  selector: 'app-collection-bulk',
  templateUrl: './collection-bulk.component.html'
})
export class CollectionBulkComponent implements OnInit {
  dataForm: FormGroup;
  validationMessages: any;
  collections: any = [];
  isShowBulkAction = false;
  headerTable: any = [
    {
      col: 'title',
      name: 'Title'
    },
    {
      col: 'published',
      name: 'Availability - Online Store'
    },
    {
      col: 'template_suffix',
      name: 'Template'
    },
  ];
  overflowUnser: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute,
              private alertService: AlertService,
              private formBuilder: FormBuilder,
              private elementRef: ElementRef,
              private config: AppConfig,
              private validationService: ValidationService,
              private collectionService: CollectionService,
              private pageScrollService: PageScrollService,
              @Inject(DOCUMENT) private document: any,
              private appComponent: AppComponent) {
    this.appComponent.bodyClass = 'page-bulk-index';
  }

  ngOnInit() {
    this.buildForm();
    this.route.params.subscribe((params) => {
        if (_.isUndefined(params.ids)) {
          this.router.navigate(['collections']);
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
      'collections': [{
        'id': {
          'required': 'id is require',
        },
        'title': {
          'required': 'title is require',
        },
        'body_html': {
          // 'required': 'metafield title is require',
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
        'column': {
          'required': 'column is require',
        },
        'relation': {
          'required': 'relation is require',
        },
        'condition': {
          'required': 'condition is require',
        },
        'collection_type': {},
      }]
    };
    this.dataForm = this.formBuilder.group({
      collections: this.formBuilder.array([]),
    });
  }

  // Collections

  setDataCollections(collections: Collection[]) {
    this.clearAllCollections();
    const control = <FormArray>this.dataForm.controls['collections'];
    for (let collection of collections) {
      let FGr = this.initCollections(collection);
      control.push(FGr);
    }
  }

  initCollections(data: any = []) {
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
      published: [data!.published, [
        // Validators.required
      ]
      ],
      published_at: [data!.published_at, [
        // Validators.required
      ]
      ],
      image_url: [data!.image_url, [
        // Validators.required
      ]
      ],
      template_suffix: [data!.template_suffix, [
        // Validators.required
      ]
      ],
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
      ]
    });
  }

  addCollections(data: Collection) {
    const control = <FormArray>this.dataForm.controls['collections'];
    const addrCtrl = this.initCollections(data);
    control.push(addrCtrl);
  }

  removeCollection(i: number) {
    const control = <FormArray>this.dataForm.controls['collections'];
    control.removeAt(i);
  }


  clearAllCollections() {
    const options = <FormArray>this.dataForm.controls['collections'];
    if (options.length) {
      for (let i = options.length - 1; i >= 0; i--) {
        this.removeCollection(i);
      }
    }
  }

  // End collections


  getData(collectionId: number) {
    this.collectionService.getCollectionByID(collectionId).subscribe(
      data => {
        this.collections.push(data.collection);
        this.addCollections(data.collection);
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

  showTooltip(idTooltip: string, isShow: boolean = true) {
    this.hideTooltip();
    if (isShow) {
      document.getElementById(idTooltip).classList.add('ui-popover--is-active');
      document.getElementById('parent-' + idTooltip).classList.add('z-index');
    }
  }

  hideTooltip() {
    let elems = document.querySelectorAll(".tooltipDate");
    [].forEach.call(elems, function (el: any) {
      el.classList.remove('ui-popover--is-active');
    });
    let elems2 = document.querySelectorAll(".parent-tooltipDate");
    [].forEach.call(elems2, function (el: any) {
      el.classList.remove('z-index');
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
    const temp: any = [];
    for (let collection of model.collections) {
      temp.push(this.collectionService.update(collection, collection.id).map(
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

  choseDate(value: any, index: any) {
    let control = this.dataForm.controls.collections['controls'][index]['controls'];
    control.published_at.setValue(moment.parseZone(value).utc().format());
    control.published.setValue(true);
  }

  unPublicCollection(index: any) {
    let control = this.dataForm.controls.collections['controls'][index]['controls'];
    control.published_at.setValue(null);
    control.published.setValue(false);
    this.hideTooltip();
  }
}
