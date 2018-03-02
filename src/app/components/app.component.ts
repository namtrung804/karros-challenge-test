import {Component, HostBinding, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  @HostBinding('class') public bodyClass = '';
}
