import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {ModalModule} from "ngx-bootstrap";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FroalaEditorModule, FroalaViewModule} from "angular-froala-wysiwyg";
import {CustomFormsModule} from "ng2-validation";
import {AlertComponent} from "../alert/alert.component";
import {AlertRoutingModule} from "./alert-routing.module";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AlertRoutingModule
  ],
  declarations: [
    AlertComponent
  ],
  exports: [AlertComponent],
})
export class AlertModule {
}
