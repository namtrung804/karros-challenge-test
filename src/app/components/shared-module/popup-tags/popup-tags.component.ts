import {Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild} from '@angular/core';
import {ProductService} from "../../../services/product.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {AuthenticationService} from "../../../services/authentication.service";
import {ValidationService} from "../../../services/validation.service";
import {AppConfig} from "../../../config/app.config";
import {CollectionService} from "../../../services/collection.service";
import {UserService} from "../../../services/user.service";
import {Product} from "../../../models/product";
import {AlertService} from "../../../services/alert.service";
import {DOCUMENT} from "@angular/common";
import {PageScrollService} from "ng2-page-scroll";
import {AppComponent} from "../../app.component";
import {ProductTypeVendor} from "../../../models/product-type-vendor";

@Component({
  selector: 'app-popup-tags',
  templateUrl: './popup-tags.component.html'
})
export class PopupTagsComponent implements OnInit {
  listTags: any = [];
  listTagsTemp: any = [];
  titleProductTag: string;
  selectedTag: any = [];
  @ViewChild('popupProductTag') popupProductTag: any;
  @Output('output-data') outputData = new EventEmitter<any>();

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute,
              private authenticationService: AuthenticationService,
              private alertService: AlertService,
              private formBuilder: FormBuilder,
              private elementRef: ElementRef,
              private translate: TranslateService,
              private config: AppConfig,
              private validationService: ValidationService,
              private productService: ProductService,
              private pageScrollService: PageScrollService,
              private collectionService: CollectionService,
              @Inject(DOCUMENT) private document: any,
              private appComponent: AppComponent) {
  }

  ngOnInit() {
  }

  showPopup(listTags: any, listTagsTemp: any, titleProductTag: string, selectedTag: any = []) {
    this.listTags = listTags;
    this.listTagsTemp = listTagsTemp;
    this.titleProductTag = titleProductTag;
    this.selectedTag = selectedTag;
    this.popupProductTag.show();
  }

  loadmoreAllProductTag() {
    this.listTags = this.listTagsTemp;
  }

  addTag(tag: ProductTypeVendor) {
    this.selectedTag.push(tag);
  }

  bulkTags() {
    this.popupProductTag.hide();
    this.outputData.emit({
      title: this.titleProductTag == 'Add tag' ? 'add_tag' : 'remove_tag',
      tags: this.selectedTag
    })
    ;
  }
}
