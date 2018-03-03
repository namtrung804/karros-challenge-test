import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {Http} from "@angular/http";
import {TranslateService} from "@ngx-translate/core";

import {FormArray, FormControl} from "@angular/forms";
import * as _ from "lodash";

@Injectable()
export class ValidationService {
  private subject = new Subject<any>();
  private keepAfterNavigationChange = false;

  constructor(private http: Http,
              
              private router: Router,
              private translate: TranslateService) {
  }

  validation(form?: any, validationMessages?: any, isObjectErrorResponse: boolean = false) {
    if (!form) {
      return;
    }
    let objectErrors: any;
    objectErrors = this.structureFormValidate(form, validationMessages);

    if (isObjectErrorResponse) {
      return objectErrors;
    }

    return this.parseObjectErrorsToMessage(objectErrors);

  }

  structureFormValidate(form, validationMessages) {
    let errorMsg = {};
    for (const field in validationMessages) {
      errorMsg[field] = [];
      if (_.isArray(validationMessages[field])) {
        // Form Array
        const controls = form.get(field).controls;
        let col = [];
        for (const key in controls) {
          if (!_.isUndefined(key)) {
            col.push(this.structureFormValidate(controls[key], validationMessages[field][0]));
          }
        }
        _.set(errorMsg, [field], col);
      } else {
        if (_.get(form.get(field), 'controls', 'isNotFormGroup') !== 'isNotFormGroup') {
          // Form Group
          let col = [];
          const controls = form.get(field);
          for (const key in controls.controls) {
            if (!_.isUndefined(key)) {
              col[key] = [];
              if (_.get(controls.get(key), 'controls', 'isNotFormGroup') !== 'isNotFormGroup') {
                col[key].push(this.structureFormValidate(controls.controls[key], validationMessages[field][key]));
              } else {
                let control = controls.controls[key];
                if (control && control.errors != null && !control.valid) {
                  // get errors
                  const messages = validationMessages[field][key];
                  for (const ckey in control.errors) {
                    let error = [];
                    error.push(messages[ckey]);
                    col[key].push(error);
                  }
                }
              }
            }
          }
          _.set(errorMsg, [field], col);
        } else {
          // get errors
          let control = form.controls[field];
          if (control && !control.valid && control.errors != null) {
            const messages = validationMessages[field];
            for (const key in control.errors) {
              let error = [];
              error.push(messages[key]);
              _.set(errorMsg, [field], error);
            }
          }
        }
      }
    }
    return errorMsg;
  }

  parseObjectErrorsToMessage(objectErrors: any, messages: string = '', arrTemp: any = []) {
    // debugger
    for (let key in objectErrors) {
      if (!_.isUndefined(key)) {
        if (_.isArray(objectErrors[key]) || (_.isObject(objectErrors[key]) && !_.isEmpty(objectErrors[key]))) {
          messages = this.parseObjectErrorsToMessage(objectErrors[key], messages, arrTemp);
        }
        if (_.isString(objectErrors[key])) {
          if (arrTemp.indexOf(objectErrors[key]) == -1) {
            arrTemp.push(objectErrors[key]);
            messages += '<p>' + objectErrors[key] + ' </p> ';
          }
        }

      }
    }
    return messages;
  }
}
