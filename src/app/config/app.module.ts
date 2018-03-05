import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {ReCaptchaModule} from 'angular2-recaptcha';
import {ModalModule} from 'ngx-bootstrap';
import {AgmCoreModule} from '@agm/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Ng2PageScrollModule} from 'ng2-page-scroll';
import {DragulaModule, DragulaService} from 'ng2-dragula';
import {CalendarModule} from 'primeng/primeng';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import * as Raven from 'raven-js';
import {AppRoutingModule} from './app-routing.module';
import {AuthInterceptor} from '../interceptor/auth.interceptor';
import {AuthGuard} from '../guards/auth.guard';
import {AlertService} from '../services/alert.service';
import {AlertPopupService} from '../services/alert-popup.service';
import {AuthenticationService} from '../services/authentication.service';
import {UserService} from '../services/user.service';
import {ValidationService} from '../services/validation.service';
import {HttpCacheService} from '../services/http-cache.service';
import {AppComponent} from '../components/app.component';
import {MomentPipe} from '../pipes/moment.pipe';
import {MatFormFieldModule, MatTableModule} from '@angular/material';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {environment} from '../../environments/environment';
import {DndModule} from 'ng2-dnd';
import {LocaleDatePipe} from '../pipes/LocaleDate.pipe';
import {ServiceWorkerModule} from '@angular/service-worker';
import {LocalStoreManagerService} from '../services/local-store-manager.service';
import {YelpService} from '../services/yelp.service';
import {API_KEY_GOOGLE_MAP} from './global-const';


// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export class RavenErrorHandler implements ErrorHandler {
    handleError(err: any): void {
        if (environment.production) {
            Raven.setExtraContext({data: JSON.stringify(err)});
            Raven.captureException(err.toString())
        }
    }
}

@NgModule({
    declarations: [
        // Page
        AppComponent,
        // Pipes
        MomentPipe,
        LocaleDatePipe
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        // Libraries
        ModalModule.forRoot(),
        Ng2PageScrollModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        ReactiveFormsModule,
        ReCaptchaModule,
        AgmCoreModule.forRoot({
            apiKey: API_KEY_GOOGLE_MAP
        }),
        // DatePickerModule,
        CalendarModule,
        DragulaModule,
        DndModule.forRoot(),
        ServiceWorkerModule.register('./ngsw-worker.js', {enabled: environment.production}),
        // App Routing
        AppRoutingModule,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        AuthGuard,
        AlertService,
        AlertPopupService,
        AuthenticationService,
        YelpService,
        LocalStoreManagerService,
        ValidationService,
        HttpCacheService,
        {
            provide: ErrorHandler,
            useClass: RavenErrorHandler
        },
        DragulaService,
        // {provide: RouteReuseStrategy, useClass: CustomReuseStrategy}
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
