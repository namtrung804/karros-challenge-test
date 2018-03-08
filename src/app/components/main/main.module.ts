import {ErrorHandler, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {AlertModule} from '../alert/alert.module';
import {MainComponent} from './main.component';
import {MainRoutingModule} from './main-routing.module';
import {ClickOutsideModule} from 'ng-click-outside';
import {AgmCoreModule} from '@agm/core';
import {PaginatorModule} from 'primeng/primeng';
import {API_KEY_GOOGLE_MAP} from '../../config/global-const';
import {NgPipesModule} from 'ngx-pipes';


@NgModule({
  imports: [
    CommonModule,
    AlertModule,
    ReactiveFormsModule,
    RouterModule,
    ClickOutsideModule,
    AgmCoreModule.forRoot({
      apiKey: API_KEY_GOOGLE_MAP,
      libraries: ['places']
    }),
    PaginatorModule,
    NgPipesModule,
    MainRoutingModule,
  ],
  declarations: [MainComponent],
})
export class MainModule {

}
