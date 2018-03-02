import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { DataTableModule, SharedModule, DragDropModule} from 'primeng/primeng';
import {RouterModule} from '@angular/router';
import {ModalModule} from 'ngx-bootstrap';
import { LayoutMainModule } from '../layout-main/layout-main.module';
import {DragulaModule} from 'ng2-dragula';

import { NavigationRoutingModule } from './navigation-routing.module';
import { NavigationComponent } from './navigation.component';
import { NavigationMainComponent } from './navigation-main/navigation-main.component';
import { NavigationDetailComponent } from './navigation-detail/navigation-detail.component';

import { ValidationService } from '../../services/validation.service';
import {AlertModule} from '../alert/alert.module';


@NgModule({
  imports: [
    CommonModule,
    LayoutMainModule,
    FormsModule,
    ReactiveFormsModule,
    NavigationRoutingModule,
    DragDropModule,
    DataTableModule,
    DragulaModule,
    SharedModule,
    RouterModule,
    AlertModule,
    ModalModule.forRoot()
  ],
  declarations: [
      NavigationComponent,
      NavigationMainComponent,
      NavigationDetailComponent,
  ],
  providers: [ValidationService]
})
export class NavigationModule { }
