import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {ModalModule} from 'ngx-bootstrap';
import { SettingRoutingModule } from './setting-routing.module';
import { LayoutMainModule } from '../layout-main/layout-main.module';

import { SettingGeneralComponent } from './setting-general/setting-general.component';
import { SettingComponent } from './setting.component';
import { SettingMainComponent } from './setting-main/setting-main.component';
import { AccountListComponent } from './account-list/account-list.component';
import { AccountDetailComponent } from './account-detail/account-detail.component';
import {AlertModule} from "../alert/alert.module";
import {DialogModule} from "primeng/primeng";

@NgModule({
  imports: [
    CommonModule,
    SettingRoutingModule,
    LayoutMainModule,
    RouterModule,
    FormsModule,
    AlertModule,
    ReactiveFormsModule,
    DialogModule,
    ModalModule.forRoot(),
  ],
  declarations: [SettingComponent, SettingGeneralComponent, SettingMainComponent, AccountListComponent, AccountDetailComponent]
})
export class SettingModule { }
