import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {SettingComponent} from './setting.component';
import {SettingMainComponent} from './setting-main/setting-main.component';
import {SettingGeneralComponent} from './setting-general/setting-general.component';
import {AccountListComponent} from "./account-list/account-list.component";
import {AccountDetailComponent} from "./account-detail/account-detail.component";

const routes: Routes = [
  {
    path: '',
    component: SettingComponent,
    children: [
      {path: '', pathMatch: 'prefix', redirectTo: 'main'},
      {
        path: 'main',
        component: SettingMainComponent
      },
      {
        path: 'general',
        component: SettingGeneralComponent,
      },
      {
        path: 'account',
        children: [
          {
            path: '',
            component: AccountListComponent,
          },
          {
            path: 'new',
            component: AccountDetailComponent,
          },
          {
            path: ':id',
            component: AccountDetailComponent,
          },
        ]
      },

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule {
}
