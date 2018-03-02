import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModuleRoutingModule } from './shared-module-routing.module';
import {TagInputModule} from "ngx-chips";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  CheckboxModule, ChipsModule, DataTableModule, DialogModule, FileUploadModule,
  SharedModule
} from "primeng/primeng";
import {Ng2PageScrollModule} from "ng2-page-scroll";
import {DragulaModule} from "ng2-dragula";
import {FroalaEditorModule, FroalaViewModule} from "angular-froala-wysiwyg";
import {ClickOutsideModule} from "ng-click-outside";
import {AlertModule} from "../alert/alert.module";
import {ModalModule} from "ngx-bootstrap";
import {DndModule} from "ng2-dnd";
import {CustomFormsModule} from "ng2-validation";
import {RouterModule} from "@angular/router";
import {LayoutMainModule} from "../layout-main/layout-main.module";
import {PopupManagerImagesComponent} from "./popup-manager-images/popup-manager-images.component";
import {PopupTagsComponent} from "./popup-tags/popup-tags.component";

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
    SharedModuleRoutingModule
  ],
  declarations: [
    PopupManagerImagesComponent,
    PopupTagsComponent
  ],
  exports: [
    PopupManagerImagesComponent,
    PopupTagsComponent
  ],
})
export class SharedModuleModule { }
