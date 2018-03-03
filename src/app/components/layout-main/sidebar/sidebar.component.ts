import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from "@ngx-translate/core";
import * as moment from 'moment';
import {UserService} from "../../../services/user.service";
import {AuthenticationService} from "../../../services/authentication.service";
import {AlertService} from "../../../services/alert.service";

import {ValidationService} from "../../../services/validation.service";

@Component({
  selector: 'sidebar',
  templateUrl: 'sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  dataForm: FormGroup;
  loading = false;

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute,
              private authenticationService: AuthenticationService,
              private alertService: AlertService,
              private formBuilder: FormBuilder,
              private elementRef: ElementRef,
              private translate: TranslateService,
              private validationService: ValidationService) {

  }

  ngOnInit() {
  }
}
