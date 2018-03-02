import {Component, ElementRef, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {LazyLoadEvent} from 'primeng/primeng';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {Location} from '@angular/common';

import {AppConfig} from '../../../config/app.config';

import {AuthenticationService} from '../../../services/authentication.service';
import {AlertService} from '../../../services/alert.service';
import {ValidationService} from '../../../services/validation.service';

import {AppComponent} from '../../app.component';

import {PageService} from '../../../services/page.service';
import {PageFilter} from '../../../models/page-filter';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {Subject} from 'rxjs/Subject';
import * as moment from 'moment';

@Component({
  selector: 'app-page-list',
  templateUrl: './page-list.component.html'
})
export class PageListComponent implements OnInit {
  loading = false;
  rootSource: any = [];
  dataPage: any = [];
  @Input() selectedValues: string[] = [];
  selectList: any = [];

  // variables for display
  isShowBulkAction = false;
  isModalShow = false;
  isModalShowDelete = false;
  isShowFlashMessage = false;
  flash_message: string;
  titlepagePopup: string;
  last_modified: number;
  // filtering
  public searchTerms = new Subject<string>();
  isCustomFilter = false;
  filterArray: any = [];
  selectedFilter: string;

  constructor(private pageService: PageService,
              private router: Router, private route: ActivatedRoute, private location: Location,
              private authenticationService: AuthenticationService,
              private alertService: AlertService,
              private fb: FormBuilder,
              private elementRef: ElementRef,
              private translate: TranslateService,
              private config: AppConfig,
              private validationService: ValidationService,
              private appComponent: AppComponent) {
    this.appComponent.bodyClass = 'page-pages-index';
  }

  ngOnInit() {
    this.getDataPage();
    // search box
    this.search();
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
    this.getDataPage(this.filterArray);
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

  getDataPage(search: any = []) {
    this.loading = true;
    this.pageService.getAllPages(search).subscribe(data => {
        this.loading = false;
        this.rootSource = data.pages;
        this.dataPage = this.rootSource;
      }
    );
  }

  // Select all customer
  clickSelectAll(element: HTMLInputElement) {
    let elems = document.querySelectorAll('.input-checkbox');
    if (element.checked) {
      // Select all
      [].forEach.call(elems, function (el: any) {
        el.checked = true;
      });
      for (const item of this.dataPage) {
        this.selectList.push(item.id);
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

  bulkSelectedItem(ops: string) {
    let model = {operation: ops, page_ids: []};
    model.page_ids = this.selectList;

    let flashMessageList = {
      destroy: 'Deleted page!',
      publish: 'Published ' + this.selectList.length + ' page!',
      unpublish: 'Hid ' + this.selectList.length + ' page!'
    };
    this.isShowBulkAction = false;
    this.pageService.bulkPages(model)
      .subscribe(res => {
          if (res.code === 200) {
            this.refreshSelectList();
            this.getDataPage();
            this.isModalShowDelete = false;
            this.isShowFlashMessage = true;
            this.flash_message = flashMessageList[ops];
            setTimeout(() => {
              this.isShowFlashMessage = false;
            }, 4000);
          } else {
            console.log('Failed!');
          }
        },
        error => {
          this.loading = false;
          console.log('Error');
        });
  }

  refreshSelectList() {
    let checkAll = <HTMLInputElement>document.getElementById('bulk-actions__select-all');
    checkAll.checked = false;
    this.selectList = [];
  }

  // Bulk action
  bulkAction() {
    this.router.navigate(['/pages/bulk', {ids: this.selectList}]);
  }


  showPopupMakePage(title: string) {
    this.isModalShow = true;
    this.titlepagePopup = title;
  }

  showPopupDeletePage() {
    this.isModalShowDelete = true;
  }

  onHidden() {
    this.isModalShow = false;
    this.isModalShowDelete = false;
  }
}
