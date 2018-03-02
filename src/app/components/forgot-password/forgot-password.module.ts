import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';
import {ForgotPasswordComponent} from "./forgot-password.component";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";

@NgModule({
  imports: [
    CommonModule,
    ForgotPasswordRoutingModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  declarations: [ForgotPasswordComponent]
})
export class ForgotPasswordModule { }
