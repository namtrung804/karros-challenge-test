import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {ModalModule} from 'ngx-bootstrap';

import { ThemesRoutingModule } from './themes-routing.module';
import { LayoutMainModule } from '../layout-main/layout-main.module';

import { ThemesComponent } from './themes.component';
import { ThemesMainComponent } from './themes-main/themes-main.component';

@NgModule({
    imports: [
        CommonModule,
        LayoutMainModule,
        ThemesRoutingModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        ModalModule.forRoot(),
    ],
    declarations: [ThemesComponent, ThemesMainComponent],
})
export class ThemesModule { }
