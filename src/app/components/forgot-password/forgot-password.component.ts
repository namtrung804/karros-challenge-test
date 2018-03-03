import {Component, ElementRef, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from "@ngx-translate/core";
import {UserService} from "../../services/user.service";
import {AuthenticationService} from "../../services/authentication.service";
import {AlertService} from "../../services/alert.service";
import {ValidationService} from "../../services/validation.service";
import {AppComponent} from "../app.component";
import {CHECK_EMAIL_REGEX} from "../../config/global-const";

@Component({
  selector: 'forgot-password',
  templateUrl: 'forgot-password.component.html',
  // styleUrls: ['../../../assets/css/dialog-fresh.css'],
  encapsulation: ViewEncapsulation.None
})
export class ForgotPasswordComponent implements OnInit {
  dataForm: FormGroup;
  loading = false;
  errorMessage: string;
  returnUrl: string;
  disableSubmitForm: boolean = false;
  validationMessages: any;

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute,
              private authenticationService: AuthenticationService,
              private alertService: AlertService,
              private formBuilder: FormBuilder,
              private elementRef: ElementRef,
              private translate: TranslateService,
              private validationService: ValidationService,
              private appComponent: AppComponent) {

    this.appComponent.bodyClass = 'page-auth-recover';

  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm(): void {
    this.validationMessages = {
      'email': {
        'required': 'Your email or password was incorrect',
        'pattern': 'Your email or password was incorrect',
      },
    };
    this.dataForm = this.formBuilder.group({
      'email': [null, [
        Validators.required,
        Validators.pattern(CHECK_EMAIL_REGEX),
      ]
      ],
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
      this.loading = true;
      this.authenticationService.resetPassword(model).subscribe(
        data => {
          this.errorMessage = data.msg;
          return;
        },
        error => {
          this.errorMessage = error.error;
          return;
        });
      this.disableSubmitForm = false;
    }
  }
}
