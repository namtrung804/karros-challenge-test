import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {AppComponent} from "../../app.component";
import {UserService} from "../../../services/user.service";
import {TranslateService} from "@ngx-translate/core";
import {ValidationService} from "../../../services/validation.service";
import {AuthenticationService} from "../../../services/authentication.service";
import {AlertService} from "../../../services/alert.service";
import {AppConfig} from "../../../config/app.config";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";

const _ = require('lodash');
require('lodash.product');

@Component({
  selector: 'header-main',
  templateUrl: 'header-main.component.html',
  styleUrls: ['../../../../assets/css/admin_style.css'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderMainComponent implements OnInit {
  loading = false;
  flash_message: string = '';
  @Output() reloadData = new EventEmitter<any>();
  @Input() isShowBar = false;
  @Input() isChanged = false;
  @ViewChild('popupContext') public popupContext: ModalDirective;
  @ViewChild('popupMessage') public popupMessage: ModalDirective;
  isShowUserInfo: boolean = false;
  adminUser: any = [];

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute,
              private authenticationService: AuthenticationService,
              private alertService: AlertService,
              private formBuilder: FormBuilder,
              private elementRef: ElementRef,
              private translate: TranslateService,
              private config: AppConfig,
              private validationService: ValidationService,
              private appComponent: AppComponent) {
    this.adminUser = JSON.parse(sessionStorage.getItem('adminUser'));
  }

  ngOnInit() {
  }

  showBar(isShowBar: boolean) {
    this.isShowBar = isShowBar;
  }

  showFlashMessage(msg: string) {
    this.flash_message = msg;
    this.popupMessage.show();
    setTimeout(() => {
      this.flash_message = '';
      this.popupMessage.hide();
    }, 4000);
  }

  save() {
    this.reloadData.emit({update: true});
  }

  discardChanges() {
    this.reloadData.emit({DiscardChanges: true});
    this.popupContext.hide();
    this.isShowBar = false;
  }

  logout() {
    this.authenticationService.logout().subscribe(
      result => {
        this.router.navigate(['login']);
      },
      error => {
        console.log(error);
      }
    )
  }
}
