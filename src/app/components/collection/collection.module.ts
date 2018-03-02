import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CollectionRoutingModule} from './collection-routing.module';
import {CollectionComponent} from './collection.component';
import {
  CalendarModule, CheckboxModule, DataTableModule, DialogModule, FileUploadModule,
  SharedModule
} from "primeng/primeng";
import {FroalaEditorModule, FroalaViewModule} from "angular-froala-wysiwyg";
import {DndModule} from "ng2-dnd";
import {DragulaModule} from "ng2-dragula";
import {Ng2PageScrollModule} from "ng2-page-scroll";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {AlertModule} from "../alert/alert.module";
import {ModalModule} from "ngx-bootstrap";
import {CustomFormsModule} from "ng2-validation";
import {LayoutMainModule} from "../layout-main/layout-main.module";
import {TagInputModule} from "ngx-chips";
import {CollectionListComponent} from "./collection-list/collection-list.component";
import {CollectionDetailComponent} from "./collection-detail/collection-detail.component";
import {CollectionBulkComponent} from "./collection-bulk/collection-bulk.component";
import {ClickOutsideModule} from "ng-click-outside";

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
    DialogModule,
    DragulaModule,
    DndModule,
    CalendarModule,
    ClickOutsideModule,
    CollectionRoutingModule
  ],
  declarations: [CollectionComponent, CollectionListComponent, CollectionDetailComponent, CollectionBulkComponent]
})
export class CollectionModule {
}
