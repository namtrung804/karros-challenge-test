import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutMainModule} from '../layout-main/layout-main.module';

import {CheckboxModule, DataTableModule, SharedModule} from 'primeng/primeng';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {ModalModule} from 'ngx-bootstrap';

import {CustomerRoutingModule} from './customer-routing.module';
import {CustomerComponent} from './customer.component';
import {CustomerListComponent} from './customer-list/customer-list.component';
import {CustomerCreateComponent} from './customer-create/customer-create.component';
import {CustomerDetailComponent} from './customer-detail/customer-detail.component';
import {CustomerBulkComponent} from './customer-bulk/customer-bulk.component';
import {PopupManagerTagsComponent} from './popup-manager-tags/popup-manager-tags.component';
import {AlertModule} from '../alert/alert.module';
import {Ng2PageScrollModule} from 'ng2-page-scroll';


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
        Ng2PageScrollModule,
        ModalModule.forRoot(),
        CustomerRoutingModule
    ],
    declarations: [CustomerComponent, CustomerListComponent, CustomerCreateComponent,
        CustomerDetailComponent, CustomerBulkComponent, PopupManagerTagsComponent]
})
export class CustomerModule {
}
