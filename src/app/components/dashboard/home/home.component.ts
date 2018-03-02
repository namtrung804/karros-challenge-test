import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from "@ngx-translate/core";
import {User} from "../../../models/user";
import {UserService} from "../../../services/user.service";
import {AuthenticationService} from "../../../services/authentication.service";
import {AlertService} from "../../../services/alert.service";
import {AppConfig} from "../../../config/app.config";
import {ValidationService} from "../../../services/validation.service";
import {AppComponent} from "../../app.component";

@Component({
  selector: 'home',
  templateUrl: 'home.component.html',
})
export class HomeComponent implements OnInit {
  @Input() currentUser: User;
  dataForm: FormGroup;
  loading = false;

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute,
              private authenticationService: AuthenticationService,
              private alertService: AlertService,
              private formBuilder: FormBuilder,
              private elementRef: ElementRef,
              private translate: TranslateService,
              private config: AppConfig,
              private validationService: ValidationService,
              private appComponent: AppComponent) {
    this.appComponent.bodyClass = 'page-home-index';
  }

  ngOnInit() {
  }
}
