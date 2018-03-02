import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {NavigationComponent} from './navigation.component';
import {NavigationMainComponent} from './navigation-main/navigation-main.component';
import {NavigationDetailComponent} from './navigation-detail/navigation-detail.component';

const routes: Routes = [
  {
    path: '',
    component: NavigationComponent,
    children: [
      {path: '', pathMatch: 'prefix', redirectTo: 'links'},
      {
        path: 'links',
        component: NavigationMainComponent
      },
      {
        path: 'link_lists/new',
        component: NavigationDetailComponent
      },
      {
        path: 'link_lists/:id',
        component: NavigationDetailComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NavigationRoutingModule {
}
