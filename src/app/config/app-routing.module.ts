import {BrowserModule} from '@angular/platform-browser';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {SelectivePreloadingStrategy} from './selective-preloading-strategy';
import {environment} from '../../environments/environment';

const routes: Routes = [
    {path: '', redirectTo: 'search', pathMatch: 'full'},
    {
        path: 'search',
        loadChildren: 'app/components/main/main.module#MainModule'
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
