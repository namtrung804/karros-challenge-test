import {Component, ElementRef, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'moment';
import {UserService} from '../../services/user.service';
import {AuthenticationService} from '../../services/authentication.service';
import {AlertService} from '../../services/alert.service';
import {AppConfig} from '../../config/app.config';
import {ValidationService} from '../../services/validation.service';
import {AppComponent} from '../app.component';

import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: ['../../../assets/css/dialog-fresh.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  dataForm: FormGroup;
  loading = false;
  errorMessage: string;
  returnUrl: string;
  disableSubmitForm: boolean = false;
  validationMessages: any;
  endpoint: string = sessionStorage.getItem('endpoint');

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute,
              private authenticationService: AuthenticationService,
              private alertService: AlertService,
              private formBuilder: FormBuilder,
              private elementRef: ElementRef,
              private translate: TranslateService,
              private config: AppConfig,
              private validationService: ValidationService,
              private appComponent: AppComponent) {
    this.appComponent.bodyClass = 'page-auth-login';


  }

  ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    this.buildForm();
  }

  buildForm(): void {
    this.validationMessages = {
      'email': {
        'required': 'Your email or password was incorrect',
        'pattern': 'Your email or password was incorrect',
      },
      'password': {
        'required': 'Your email or password was incorrect',
      },
      'remember_me': {},
      'endpoint': {
        'required': 'Endpoint can\'t empty',
      },
    };
    this.dataForm = this.formBuilder.group({
      'email': [null, [
        Validators.required,
        Validators.pattern(this.config.checkEmailRegex),
      ]
      ],
      'password': [null, [
        Validators.required,
      ]],
      'remember_me': [null, []],
      'endpoint': [null, [
        Validators.required,
      ]],
    });
  }

  submitForm() {
    if (!this.disableSubmitForm) {
      this.errorMessage = null;
      this.disableSubmitForm = true;
      const validation = this.validationService.validation(this.dataForm, this.validationMessages);
      if (validation != '') {
        this.errorMessage = validation;
        this.disableSubmitForm = false;
        return;
      }
      const model = this.dataForm.value;
      if (model.remember_me == null) {
        model.remember_me = false;
      }
      // Set End point Domain API
      this.config.apiUrl = model.endpoint.indexOf('http') == -1 ? 'http://' + model.endpoint : model.endpoint;
      sessionStorage.setItem('endpoint', model.endpoint);
      // End Domain API
      this.loading = true;
      this.authenticationService.login(model).subscribe(
        data => {
          if (data.code != 200) {
            this.errorMessage = data.msg;
            return;
          }
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.errorMessage = error.msg;
        });
      this.disableSubmitForm = false;
    }
  }
}
