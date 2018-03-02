import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ThemesComponent} from './themes.component';
import {ThemesMainComponent} from './themes-main/themes-main.component';

const routes: Routes = [
  {
    path: '',
    component: ThemesComponent,
    children: [
      {
        path: '',
        component: ThemesMainComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThemesRoutingModule {
}
