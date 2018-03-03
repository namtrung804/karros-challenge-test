import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HeaderMainComponent} from "./header-main/header-main.component";
import {SidebarComponent} from "./sidebar/sidebar.component";
import {FooterComponent} from './footer/footer.component';
import {RouterModule} from "@angular/router";
import {LayoutMainComponent} from './layout-main.component';
import {ModalModule} from 'ngx-bootstrap';
import {ClickOutsideModule} from "ng-click-outside";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ClickOutsideModule,
    ModalModule,
    TranslateModule
  ],
  declarations: [
    LayoutMainComponent,
    HeaderMainComponent,
    SidebarComponent,
    FooterComponent
  ],
  exports: [
    LayoutMainComponent,
    HeaderMainComponent,
    SidebarComponent,
    FooterComponent
  ],
})
export class LayoutMainModule {
}
