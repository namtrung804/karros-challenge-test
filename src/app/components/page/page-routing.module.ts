import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {PageComponent} from './page.component';
import {PageListComponent} from './page-list/page-list.component';
import {PageDetailComponent} from './page-detail/page-detail.component';
import {PageBulkComponent} from './page-bulk/page-bulk.component';

const routes: Routes = [
  {
    path: '',
    component: PageComponent,
    children: [
      {
        path: '',
        component: PageListComponent
      },
      {
        path: 'bulk',
        component: PageBulkComponent
      },
      {
        path: 'new',
        component: PageDetailComponent
      },
      {
        path: ':id',
        component: PageDetailComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageRoutingModule {
}
