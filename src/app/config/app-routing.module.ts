import {BrowserModule} from '@angular/platform-browser';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {SelectivePreloadingStrategy} from "./selective-preloading-strategy";
import {environment} from '../../environments/environment';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {
    path: 'login',
    loadChildren: 'app/components/login/login.module#LoginModule'
  },
  {
    path: 'forgot-password',
    loadChildren: 'app/components/forgot-password/forgot-password.module#ForgotPasswordModule'
  },
  {
    path: 'dashboard',
    loadChildren: 'app/components/dashboard/dashboard.module#DashboardModule'
  },
  {
    path: 'products',
    loadChildren: 'app/components/product/product.module#ProductModule'
  },
  {
    path: 'collections',
    loadChildren: 'app/components/collection/collection.module#CollectionModule'
  },
  {
    path: 'themes',
    loadChildren: 'app/components/themes/themes.module#ThemesModule'
  },
  {
    path: 'navigation',
    loadChildren: 'app/components/navigation/navigation.module#NavigationModule'
  },
  {
    path: 'settings',
    loadChildren: 'app/components/setting/setting.module#SettingModule'
  },
  {
    path: 'customers',
    loadChildren: 'app/components/customer/customer.module#CustomerModule'
  },
  {
    path: 'orders',
    loadChildren: 'app/components/order/order.module#OrderModule'
  },
  {
    path: 'pages',
    loadChildren: 'app/components/page/page.module#PageModule'
  },
];
const Routing: ModuleWithProviders = RouterModule.forRoot(
  routes, {
    enableTracing: environment.production ? false : true,
    preloadingStrategy: SelectivePreloadingStrategy,
    useHash: true
  },
);

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    Routing,
  ],
  exports: [RouterModule],
  providers: [SelectivePreloadingStrategy]
})
export class AppRoutingModule {
}
