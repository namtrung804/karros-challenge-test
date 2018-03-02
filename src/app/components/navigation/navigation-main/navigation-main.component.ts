import { Component, OnInit } from '@angular/core';
import {AppComponent} from '../../app.component';
import {Router} from '@angular/router';
import {MenuService} from '../../../services/menu.service';
@Component({
  selector: 'navigation-main',
  templateUrl: './navigation-main.component.html'
})
export class NavigationMainComponent implements OnInit {
    link_lists: any = [];
    loading = false;
    constructor(private appComponent: AppComponent,
                private menuService: MenuService,
                private router: Router
    ) {
        this.appComponent.bodyClass = 'page-link-lists-index';
    }
    ngOnInit() {
        this.getDataSource();
    }
    getDataSource() {
        this.menuService.getAllMenu().subscribe(
            data => {
                this.link_lists = data.link_lists;
            }
        );
    }
    gotoDetail(event: any) {
        let selectedMenu = event.data;
        this.router.navigate(['/navigation/link_lists/', selectedMenu.id])
    }
}
