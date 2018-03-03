import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import {LayoutMainModule} from "../layout-main/layout-main.module";
import { HomeComponent } from './home/home.component';
import {AuthGuard} from "../../guards/auth.guard";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    LayoutMainModule,
    TranslateModule
  ],
  declarations: [DashboardComponent, HomeComponent],
  providers: [
    AuthGuard
  ]
})
export class DashboardModule { }
