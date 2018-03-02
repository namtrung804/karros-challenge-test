import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CheckboxModule, DataTableModule, SharedModule, CalendarModule} from 'primeng/primeng';
import {FroalaEditorModule, FroalaViewModule} from 'angular-froala-wysiwyg';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {ModalModule} from 'ngx-bootstrap';

import {LayoutMainModule} from '../layout-main/layout-main.module';
import {PageRoutingModule} from './page-routing.module';

import {PageComponent} from './page.component';
import {PageListComponent} from './page-list/page-list.component';
import {PageDetailComponent} from './page-detail/page-detail.component';
import {LocaleDatePipe} from '../../pipes/LocaleDate.pipe';
import {OuterTextPipe} from '../../pipes/OuterText.pipe';
import {PageBulkComponent} from './page-bulk/page-bulk.component';
import {ClickOutsideModule} from "ng-click-outside";
import {AlertModule} from "../alert/alert.module";

@NgModule({
  imports: [
    CommonModule,
    PageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CheckboxModule,
    DataTableModule,
    SharedModule,
    CalendarModule,
    FroalaEditorModule,
    FroalaViewModule,
    LayoutMainModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    ClickOutsideModule,
    AlertModule,
    ModalModule.forRoot(),
  ],
  declarations: [PageComponent, PageListComponent, PageDetailComponent, OuterTextPipe, PageBulkComponent]
})
export class PageModule {
}
