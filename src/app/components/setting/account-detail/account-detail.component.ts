import {Component, ElementRef, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ValidationService} from "../../../services/validation.service";
import {Collection} from "../../../models/collection";
import {COLLECTION_COLUMN, COLLECTION_RELATION} from "../../../models/collection-rules";
import {PageScrollInstance, PageScrollService} from "ng2-page-scroll";
import {AppComponent} from "../../app.component";
import {DOCUMENT} from "@angular/common";
import {AlertService} from "../../../services/alert.service";
import {CollectionService} from "../../../services/collection.service";
import {Subject} from "rxjs/Subject";
import {ModalDirective} from "ngx-bootstrap";
import {Pagination} from "../../../models/pagination";
import {ProductTypeVendor} from "../../../models/product-type-vendor";
import {ProductService} from "../../../services/product.service";

import {AccountService} from "../../../services/account.service";
import {Account} from "../../../models/account";
import {CustomValidators} from "ng2-validation";
import * as _ from "lodash";
import {ProductImages} from "../../../models/product-images";
import * as moment from "moment";
import {AuthenticationService} from "../../../services/authentication.service";
import {LocalStoreManagerService} from "../../../services/local-store-manager.service";

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html'
})
export class AccountDetailComponent implements OnInit {
  account: any = new Account();
  loading = false;
  dataForm: FormGroup;
  dataFormChangePassword: FormGroup;
  validationMessages: any;
  validationMessagesChangePassword: any;
  @ViewChild('fileInput') fileInput: ElementRef;
  filesToUpload: any = [];
  @ViewChild('popupDeleteAccount') popupDeleteAccount: any;
  adminUser: any = [];
  isShowChangePassword: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute,
              private alertService: AlertService,
              private formBuilder: FormBuilder,
              private elementRef: ElementRef,
              private validationService: ValidationService,
              private authenticationService: AuthenticationService,
              private accountService: AccountService,
              private pageScrollService: PageScrollService,
              @Inject(DOCUMENT) private document: any,
              private appComponent: AppComponent,
              private localStoreManagerService: LocalStoreManagerService) {
    this.appComponent.bodyClass = 'page-users-show';
    this.adminUser = this.localStoreManagerService.getData('adminUser');

  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
        if (params.id) {
          this.getData(params.id);
          this.buildFormChangePassword();
        } else {
          this.buildForm(new Account());
        }
      }
    );
  }

  buildForm(data: any = []): void {
    this.validationMessages = {
      'id': {
        'required': 'id is require',
      },
      'first_name': {
        'required': 'First name is require',
      },
      'last_name': {
        'required': 'Last name is require',
      },
      'phone': {
        'number': 'Phone must be a numeric'
      },
      'email': {
        'required': 'Email is require',
        'email': 'Email is not correct',
      },
      'password': {
        'required': 'Password is require',
        'min': 'Password min length 6 character',
      },
      'confirm_password': {
        'required': 'Confirm password is require',
        'min': 'Password confirmation min length 6 character',
        'equalTo': 'Password confirmation doesn\'t match Password',
      }
    };
    if (data.id == -1) {
      //insert
      let password = new FormControl(data!.password, [
          Validators.required,
          Validators.minLength(6)
        ]
      );
      let confirmPassword = new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        CustomValidators.equalTo(password)
      ]);
      this.dataForm = this.formBuilder.group({
        id: [data!.id, [
          Validators.required
        ]
        ],
        first_name: [data!.first_name, [
          Validators.required,
        ]
        ],
        last_name: [data!.last_name, [
          Validators.required
        ]
        ],
        password: password,
        confirm_password: confirmPassword,
        phone: [data!.phone, [
          CustomValidators.number
        ]
        ],
        email: [data!.email, [
          Validators.required,
          Validators.email
        ]
        ],
        image_url: [data!.image_url, []],
        image_id: [data!.image_id, []],
        bio: [data!.bio, []],
        pwa: [data!.pwa, []],
        receive_announcements: [data!.receive_announcements, []],
        has_full_permissions: [data!.has_full_permissions, []]
      });
    } else {
      // update
      this.dataForm = this.formBuilder.group({
        id: [data!.id, [
          Validators.required
        ]
        ],
        first_name: [data!.first_name, [
          Validators.required,
        ]
        ],
        last_name: [data!.last_name, [
          Validators.required
        ]
        ],
        phone: [data!.phone, [
          CustomValidators.number
        ]
        ],
        email: [data!.email, [
          Validators.required,
          Validators.email
        ]
        ],
        image_url: [data!.image_url, []],
        image_id: [data!.image_id, []],
        bio: [data!.bio, []],
        pwa: [data!.pwa, []],
        receive_announcements: [data!.receive_announcements, []],
        has_full_permissions: [data!.has_full_permissions, []]
      });
    }

    this.account = data;
    this.account.full_name = `${this.account.first_name} ${this.account.last_name}`;
  }

  buildFormChangePassword(): void {
    this.validationMessagesChangePassword = {
      'old_password': {
        'required': 'Current password is require',
        'min': 'Current password min length 6 character',
      },
      'new_password': {
        'required': 'New password is require',
        'min': 'New password min length 6 character',
      },
      'confirm_password': {
        'required': 'Confirm password is require',
        'min': 'Password confirmation min length 6 character',
        'equalTo': 'Password confirmation doesn\'t match Password',
      }
    };
    let password = new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ]
    );
    let confirmPassword = new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      CustomValidators.equalTo(password)
    ]);
    this.dataFormChangePassword = this.formBuilder.group({
      old_password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]
      ],
      new_password: password,
      confirm_password: confirmPassword,
    });
  }

  getData(id: number) {
    this.accountService.getDataByID(id).subscribe(
      data => {
        this.buildForm(data.admin_user);
      },
      error => {
        this.router.navigate(['/settings/account']);
      }
    );
  }

  uploadImage(ID: number) {
    const files: Array<File> = this.filesToUpload;
    if (_.get(files, 'size', 'issetSize') !== 'issetSize') {
      const formData: any = new FormData();
      formData.append("image", files);
      this.accountService.uploadImage(formData, ID).subscribe(
        result => {
          if (this.isShowChangePassword) {
            return true;
          } else {
            return this.router.navigate(['/settings/account', ID]);
          }

        }
      )
    }
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      for (const key in  event.target.files) {
        let reader = new FileReader();
        let file = event.target.files[key];
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.account.image_url = reader.result;
          this.filesToUpload = file;
        };
      }
    }
  }

  deleteImage() {
    this.accountService.deleteImage(this.account.image_id, this.account.id).subscribe(
      data => {
        this.account.image_url = null;
        this.account.image_id = null;
      },
      error => {
        this.scrollToTop();
        this.alertService.error(error.msg);
      }
    );
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
    this.loading = true;
    if (model.id == -1) {
      //insert
      delete model.id;
      this.accountService.create(model).subscribe(
        data => {
          this.uploadImage(data.admin_user.id);
        },
        error => {
          this.scrollToTop();
          this.alertService.error(error.msg);
        }
      )
    } else {
      //update
      this.accountService.update(model, this.account.id).subscribe(
        data => {
          //upload image
          this.uploadImage(this.account.id);
          //change password
          if (this.isShowChangePassword) {
            const validationCP = this.validationService.validation(this.dataFormChangePassword, this.validationMessagesChangePassword);
            if (validationCP != '') {
              this.scrollToTop();
              this.alertService.error(validationCP);
              return;
            }
            const modelCP = this.dataFormChangePassword.value;
            this.accountService.changePassword(modelCP).subscribe(
              response => {
                this.scrollToTop();
                this.alertService.success('Success update user info');
              },
              error => {
                this.scrollToTop();
                this.alertService.error(error.msg);
                return;
              }
            );
          }
        },
        error => {
          this.scrollToTop();
          this.alertService.error(error.msg);
        }
      );
    }
  }

  deleteAccount(password: string) {
    this.authenticationService.checkPassword({email: this.adminUser.email, password: password}).subscribe(
      result => {
        this.accountService.delete(this.account.id).subscribe(
          response => {
            this.router.navigate(['/settings/account']);
          });
      },
      error => {
        this.alertService.error('Wrong password');
      })

  }
}
