import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProductListComponent} from './product-list/product-list.component';
import {ProductDetailComponent} from './product-detail/product-detail.component';
import {ProductComponent} from './product.component';
import {ProductRoutingModule} from "./product-routing.module";
import {LayoutMainModule} from "../layout-main/layout-main.module";

import {
  CheckboxModule, ChipsModule, DataTableModule, DialogModule, EditorModule, FileUploadModule,
  SharedModule
} from 'primeng/primeng';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {ModalModule} from "ngx-bootstrap";
import {FroalaEditorModule, FroalaViewModule} from "angular-froala-wysiwyg";
import {CustomFormsModule} from "ng2-validation";
import {AlertModule} from "../alert/alert.module";
import {AuthGuard} from "../../guards/auth.guard";
import {Ng2PageScrollModule} from "ng2-page-scroll";
import { TagInputModule } from 'ngx-chips';
import {DragulaModule} from "ng2-dragula";
import {DndModule} from "ng2-dnd";
import { ProductVariantsBulkComponent } from './product-variants-bulk/product-variants-bulk.component';
import { ProductBulkComponent } from './product-bulk/product-bulk.component';
import { ProductAddVariantComponent } from './product-add-variant/product-add-variant.component';
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
    FileUploadModule,
    Ng2PageScrollModule,
    TagInputModule,
    ChipsModule,
    DialogModule,
    DragulaModule,
    DndModule,
    ClickOutsideModule,
    SharedModuleModule,
    ProductRoutingModule
  ],
  declarations: [
    ProductListComponent,
    ProductDetailComponent,
    ProductComponent,
    ProductVariantsBulkComponent,
    ProductBulkComponent,
    ProductAddVariantComponent
  ],
  providers: [
    AuthGuard
  ],
  exports: [
    ProductDetailComponent
  ],
})
export class ProductModule {
}
