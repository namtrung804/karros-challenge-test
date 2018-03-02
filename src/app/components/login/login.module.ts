import {ErrorHandler, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LoginRoutingModule} from './login-routing.module';
import {LoginComponent} from './login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {RouterModule} from "@angular/router";
import {AlertModule} from "../alert/alert.module";


@NgModule({
  imports: [
    CommonModule,
    AlertModule,
    ReactiveFormsModule,
    RouterModule,
    LoginRoutingModule,
  ],
  declarations: [LoginComponent],
})
export class LoginModule {

}
