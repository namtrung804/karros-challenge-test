import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {AppComponent} from '../../app.component';

@Component({
  selector: 'setting-general',
  templateUrl: './setting-general.component.html',
})
export class SettingGeneralComponent implements OnInit {
  amount: any;
  showMoneyFormat: Boolean = false;
  generalForm: FormGroup;
  constructor(private fb: FormBuilder,
              private appComponent: AppComponent) {
    this.appComponent.bodyClass = 'page-settings-general-show';
  }

  ngOnInit() {
    this.buildForm();
  }
  buildForm(): void {
      this.generalForm = this.fb.group({
          store_detail: this.fb.group({
              name: ['mybeautyfriend', [
                  Validators.required
              ]
              ],
              account_email: ['yd.kim@tripath.co.kr1', [
                  Validators.required
              ]
              ],
              customer_email: ['contact@tripath.vn', [
                  Validators.required
              ]
              ],
          }),
          store_address: this.fb.group({
              company_name: [null, [
                  Validators.required
              ]
              ],
              phone: ['827075747676', [
                  Validators.required
              ]
              ],
              address1: ['Gasan digital 1-ro, Geumcheon-gu', [
                  Validators.required
              ]
              ],
              address2: ['208, 30', [
                  Validators.required
              ]
              ],
              city: ['Seoul', [
                  Validators.required
              ]
              ],
              zip: ['08591', [Validators.required]],
              country: ['South Korea', [Validators.required]],
              province: ['Seoul', [Validators.required]],
          }),
          standards_formats: this.fb.group({
              prefix: ['#', [
                Validators.required
              ]
              ],
              suffix: [null, [
                Validators.required
              ]
              ],
          })
      });
  }
}
