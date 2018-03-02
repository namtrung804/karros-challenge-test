import {Component, OnInit} from '@angular/core';
import {AppComponent} from '../app.component';

@Component({
    selector: 'app-themes',
    templateUrl: '../layout-main/layout-main.component.html'
})
export class ThemesComponent implements OnInit {

    constructor(private appComponent: AppComponent) {
        this.appComponent.bodyClass = 'page-themes-index';
    }

    ngOnInit() {
    }

}
