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


@NgModule({
    imports: [
        CommonModule,
        AlertModule,
        ReactiveFormsModule,
        RouterModule,
        ClickOutsideModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyCOtKWiQLysOXdzJ8h1a69wHlbbyfiiZzU',
            libraries: ["places"]
        }),
        MainRoutingModule,
    ],
    declarations: [MainComponent],
})
export class MainModule {

}
