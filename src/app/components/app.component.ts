import {Component, HostBinding, ViewEncapsulation} from '@angular/core';
import {LocalStoreManagerService} from "../services/local-store-manager.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  @HostBinding('class') public bodyClass = '';

  constructor(private localStoreManagerService: LocalStoreManagerService,
              private translate: TranslateService) {
    localStoreManagerService.initialiseStorageSyncListener();
  }

  ngOnInit() {
    this.translate.addLangs(["en", "vi"]);
    this.translate.setDefaultLang('vi');
    // Config khi muốn lấy mặc định ngôn ngữ của browser
    // const browserLang = this.translate.getBrowserLang();
    // this.translate.use(browserLang.match(/vi|en/) ? browserLang : 'vi');
  }


  setLang(lang: string): void {
    this.translate.use(lang);

  }

  isCurrentLang(lang: string) {
    return lang === this.translate.currentLang;
  }
}
