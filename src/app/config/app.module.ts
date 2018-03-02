import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BaseRequestOptions, Http, HttpModule} from '@angular/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {ReCaptchaModule} from 'angular2-recaptcha';
import {ModalModule} from 'ngx-bootstrap';
// used to create fake backend
// import { fakeBackendProvider } from '../helpers/fake-backend';
import {MockBackend} from '@angular/http/testing';
import {AgmCoreModule} from '@agm/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Ng2PageScrollModule} from 'ng2-page-scroll';
import {DragulaModule, DragulaService} from 'ng2-dragula';
// import {DatePickerModule} from 'ng2-datepicker';
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
import {AppConfig} from './app.config';
import {ValidationService} from '../services/validation.service';
import {HttpCacheService} from '../services/http-cache.service';
import {AppComponent} from '../components/app.component';
import {MomentPipe} from '../pipes/moment.pipe';
import {MatFormFieldModule, MatTableModule} from '@angular/material';
import {ProductService} from '../services/product.service';
import {CustomerService} from '../services/customer.service';
import {MenuService} from '../services/menu.service';
import {OrderService} from '../services/order.service';
import {CollectionService} from '../services/collection.service';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {environment} from '../../environments/environment';
import {PageService} from '../services/page.service';
import {BlogListComponent} from '../components/blog-post/blog-list/blog-list.component';
import {DndModule} from 'ng2-dnd';
import {ThemeService} from '../services/theme.service';
import {LocaleDatePipe} from '../pipes/LocaleDate.pipe';
import {AccountService} from "../services/account.service";
import {RouteReuseStrategy} from "@angular/router";
import {CustomReuseStrategy} from "./custom-reuse-strategy";
import {ServiceWorkerModule} from "@angular/service-worker";


// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './i18n/', '.json');
}

// Sentry
// Raven
//   .config('https://bdc6d1b9c49b46aaa6e9342c4bef38f0@logging.coded.work/2', {
//     ignoreUrls: [/insights\.hotjar\.com/]
//   })
//   .install();

export class RavenErrorHandler implements ErrorHandler {
  handleError(err: any): void {
    if (environment.production) {
      let msisdn = JSON.parse(sessionStorage.getItem('msisdnLogin'));
      Raven.setUserContext({
        username: msisdn ? msisdn.msisdn : 0
      });
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
      apiKey: 'AIzaSyCOtKWiQLysOXdzJ8h1a69wHlbbyfiiZzU'
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
    UserService,
    AppConfig,
    ProductService,
    CustomerService,
    MenuService,
    OrderService,
    CollectionService,
    PageService,
    BlogListComponent,
    ThemeService,
    AccountService,
    // providers used to create fake backend
    // fakeBackendProvider,
    MockBackend,
    BaseRequestOptions,
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
