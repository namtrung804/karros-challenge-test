import {Component, ElementRef, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {LazyLoadEvent} from "primeng/primeng";
import {Pagination} from "../../../models/pagination";
import {ModalDirective} from "ngx-bootstrap";
import {UserService} from "../../../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../../../services/authentication.service";
import {AlertService} from "../../../services/alert.service";
import {FormBuilder} from "@angular/forms";

import {ValidationService} from "../../../services/validation.service";
import {AppComponent} from "../../app.component";
import {CollectionService} from "../../../services/collection.service";
import {PageScrollInstance, PageScrollService} from "ng2-page-scroll";
import {DOCUMENT} from "@angular/common";
import {debounceTime, distinctUntilChanged} from "rxjs/operators";
import {Subject} from "rxjs/Subject";

@Component({
  selector: 'app-collection-list',
  templateUrl: './collection-list.component.html'
})
export class CollectionListComponent implements OnInit {
  loading = false;
  @Input() dataSource: any = [];
  @Input() selectedValues: string[] = [];
  selectList: any = [];
  pagination = new Pagination();
  isShowBulkAction = false;
  titlePopup: string;
  @ViewChild('popupAvailable') public popupAvailable: ModalDirective;
  @ViewChild('popupDelete') public popupDelete: ModalDirective;
  filterArray: any = [];
  public searchTerms = new Subject<string>();
  isCustomFilter = false;
  selectedFilter: string;

  constructor(private router: Router, private route: ActivatedRoute,
              private alertService: AlertService,
              private formBuilder: FormBuilder,
              private elementRef: ElementRef,
              private validationService: ValidationService,
              private collectionService: CollectionService,
              private pageScrollService: PageScrollService,
              @Inject(DOCUMENT) private document: any,
              private appComponent: AppComponent) {
    this.appComponent.bodyClass = 'page-collections-index';
  }

  ngOnInit() {
    this.getData(this.pagination.number);
    // search box
    this.search();
  }

  search() {
    this.searchTerms.pipe(
      debounceTime(500),
      distinctUntilChanged(),
    ).subscribe((value) => {
      this.addFilter('q[title_cont]', value);
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
    this.getData(this.pagination.number, this.filterArray);
    this.isCustomFilter = false;
  }

  getData(page: number, search: any = []) {
    this.collectionService.getAllCollections(page, search).subscribe(
      data => {
        this.pagination = data.pagination;
        this.dataSource = data.collections;
      }
    )
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

  showPopupMake(title: string) {
    this.titlePopup = title;
    this.popupAvailable.show();
  }

  bulkCollections(param: string, value: any = []) {
    let data = {
      operation: param,
      collection_ids: this.selectList,
      value: value
    };
    this.collectionService.bulkAction(data).subscribe(
      response => {
        this.scrollToTop();
        this.isShowBulkAction = false;
        this.popupAvailable.hide();
        this.popupDelete.hide();
        if (response.code == 200) {
          this.getData(this.pagination.number, this.filterArray);
          this.alertService.success(response.msg);
          this.selectList = [];
        } else {
          this.alertService.error(response.msg);
        }
      }
    );
  }

  scrollToTop() {
    let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, 'body');
    this.pageScrollService.start(pageScrollInstance);
  }

}
