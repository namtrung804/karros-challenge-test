import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {CustomerComponent} from './customer.component';
import {CustomerListComponent} from './customer-list/customer-list.component';
import {CustomerCreateComponent} from './customer-create/customer-create.component';
import {CustomerDetailComponent} from './customer-detail/customer-detail.component';
import {CustomerBulkComponent} from './customer-bulk/customer-bulk.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerComponent,
    children: [
      {
        path: '',
        component: CustomerListComponent
      },
      {
        path: 'bulk',
        component: CustomerBulkComponent
      },
      {
        path: 'new',
        component: CustomerCreateComponent
      },
      {
        path: ':id',
        component: CustomerDetailComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule {
}
