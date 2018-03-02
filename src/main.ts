import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from './environments/environment';
import {AppModule} from './app/config/app.module';
import 'hammerjs';
import "froala-editor/js/froala_editor.pkgd.min.js";

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
