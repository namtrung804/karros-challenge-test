import {Component, ElementRef, Inject, OnInit} from '@angular/core';

import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Page} from '../../../models/page';
import {PageService} from '../../../services/page.service';
import {AppConfig} from "../../../config/app.config";
import {DOCUMENT} from "@angular/common";
import {ValidationService} from "../../../services/validation.service";
import {PageScrollInstance, PageScrollService} from "ng2-page-scroll";
import {AppComponent} from "../../app.component";
import {AlertService} from "../../../services/alert.service";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin'
import * as moment from "moment";

const _ = require('lodash');

@Component({
  selector: 'app-page-bulk',
  templateUrl: './page-bulk.component.html'
})
export class PageBulkComponent implements OnInit {
  dataForm: FormGroup;
  validationMessages: any;
  data: any = [];
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
              private pageService: PageService,
              private pageScrollService: PageScrollService,
              @Inject(DOCUMENT) private document: any,
              private appComponent: AppComponent) {
    this.appComponent.bodyClass = 'page-bulk-index';
  }

  ngOnInit() {
    this.buildForm();
    this.route.params.subscribe((params) => {
        if (_.isUndefined(params.ids)) {
          this.router.navigate(['pages']);
        }
        for (let id of params.ids.split(',')) {
          this.getData(parseInt(id));
        }

      }
    );
  }

  buildForm(): void {
    this.validationMessages = {
      'pages': [{
        'id': {
          'required': 'id is require',
        },
        'title': {
          'required': 'title is require',
        },
        'handle': {
          'required': 'title is require',
        },
        'metafields_global_title_tag': {
          'required': 'metafield title is require',
          'maxLength': 'metafield title max length is 70 characters',
        },
        'metafields_global_description_tag': {
          'required': 'metafield description is require',
          'maxLength': 'metafield description max length is 160 characters',
        },
      }]
    };
    this.dataForm = this.formBuilder.group({
      pages: this.formBuilder.array([]),
    });
  }

  initData(data: any = []) {
    return this.formBuilder.group({
      id: [data!.id, [
        Validators.required
      ]
      ],
      title: [data!.title, [
        Validators.required,

      ]
      ],
      published: [data!.published, []],
      published_at: [data!.published_at, []],
      template_suffix: [data!.template_suffix, []],
      handle: [data!.handle, [
        Validators.required
      ]
      ],
      metafields_global_title_tag: [data!.metafields_global_title_tag, [
        Validators.required,
        Validators.maxLength(70)
      ]
      ],
      metafields_global_description_tag: [data!.metafields_global_description_tag, [
        Validators.required,
        Validators.maxLength(160)
      ]
      ],
    });
  }

  addData(data: Page) {
    const control = <FormArray>this.dataForm.controls['pages'];
    const addrCtrl = this.initData(data);
    control.push(addrCtrl);
  }

  removeData(i: number) {
    const control = <FormArray>this.dataForm.controls['pages'];
    control.removeAt(i);
  }

  getData(pageId: number) {
    this.pageService.getById(pageId).subscribe(
      data => {
        this.addData(data.page);
      }
    );
  }

  checkHeaderTable(col) {
    return _.findIndex(this.headerTable, function (o) {
      return o.col == col;
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
    let temp: any = [];
    for (let page of model.pages) {
      temp.push(this.pageService.update(page, page.id).map(
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
    let control = this.dataForm.controls.pages['controls'][index]['controls'];
    control.published_at.setValue(moment.parseZone(value).utc().format());
    control.published.setValue(true);
  }

  unPublicCollection(index: any) {
    let control = this.dataForm.controls.pages['controls'][index]['controls'];
    control.published_at.setValue(null);
    control.published.setValue(false);
    this.hideTooltip();
  }
}
