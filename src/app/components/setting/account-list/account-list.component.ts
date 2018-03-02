import {Component, ElementRef, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {ValidationService} from "../../../services/validation.service";
import {PageScrollService} from "ng2-page-scroll";
import {AppComponent} from "../../app.component";
import {DOCUMENT} from "@angular/common";
import {AlertService} from "../../../services/alert.service";
import {CollectionService} from "../../../services/collection.service";
import {Subject} from "rxjs/Subject";
import {ModalDirective} from "ngx-bootstrap";
import {Pagination} from "../../../models/pagination";
import {AppConfig} from "../../../config/app.config";
import {AccountService} from "../../../services/account.service";

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html'
})
export class AccountListComponent implements OnInit {
  loading = false;
  @Input() dataSource: any = [];
  adminUser: any = [];

  constructor(private router: Router, private route: ActivatedRoute,
              private alertService: AlertService,
              private formBuilder: FormBuilder,
              private elementRef: ElementRef,
              private config: AppConfig,
              private validationService: ValidationService,
              private accountService: AccountService,
              private pageScrollService: PageScrollService,
              @Inject(DOCUMENT) private document: any,
              private appComponent: AppComponent) {
    this.appComponent.bodyClass = 'page-settings-accounts-index';
    this.adminUser = JSON.parse(sessionStorage.getItem('adminUser'));
  }

  ngOnInit() {
    this.getData();
  }

  getData(search: any = []) {
    this.accountService.getAllData(search).subscribe(
      data => {
        this.dataSource = data.admin_users;
      }
    )
  }
}
