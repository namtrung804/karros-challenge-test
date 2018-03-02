import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { OrderComponent } from './order.component';
import { OrderListComponent } from './order-list/order-list.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {LayoutMainModule} from "../layout-main/layout-main.module";
import {AlertModule} from "../alert/alert.module";
import {CheckboxModule, DataTableModule, InputTextareaModule, SharedModule} from "primeng/primeng";
import {ModalModule, TabsModule} from "ngx-bootstrap";
import {FroalaEditorModule, FroalaViewModule} from "angular-froala-wysiwyg";
import {CustomFormsModule} from "ng2-validation";
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrderFulfillAndShipComponent } from './order-fulfill-and-ship/order-fulfill-and-ship.component';
import {ClickOutsideModule} from "ng-click-outside";
import {SharedModuleModule} from "../shared-module/shared-module.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    LayoutMainModule,
    AlertModule,
    CheckboxModule,
    DataTableModule,
    SharedModule,
    ModalModule.forRoot(),
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    CustomFormsModule,
    TabsModule.forRoot(),
    ClickOutsideModule,
    SharedModuleModule,
    InputTextareaModule,
    OrderRoutingModule
  ],
  declarations: [OrderComponent, OrderListComponent, OrderDetailComponent, OrderFulfillAndShipComponent]
})
export class OrderModule { }
