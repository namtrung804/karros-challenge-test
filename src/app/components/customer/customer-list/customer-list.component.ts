import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';

import {LazyLoadEvent} from 'primeng/primeng';
import {ModalDirective} from 'ngx-bootstrap/modal';

import {CustomerService} from '../../../services/customer.service';

import {AppComponent} from '../../app.component';
import {Pagination} from '../../../models/pagination';

import {
    debounceTime, distinctUntilChanged
} from 'rxjs/operators';

import {Subject} from 'rxjs/Subject';

@Component({
    selector: 'app-customer-list',
    templateUrl: './customer-list.component.html'
})
export class CustomerListComponent implements OnInit {
    // data variables
    loading = false;
    rootSource: any = [];
    dataCustomer: any = [];
    pagination = new Pagination();
    customerTagTemp: any = [];
    customerTag: any = [];
    @Input() selectedValues: string[] = [];
    selectList: any = [];

    // variables for display
    isShowBulkAction = false;
    isModalShow = false;
    isShowNote = false;
    isShowFlashMessage = false;
    flash_message: string;
    isShowFilter = false;

    // show popover
    titlecustomerPopup: string;
    @ViewChild('popupCustomerTag') public popupCustomerTag: ModalDirective;
    @ViewChild('popupCustomerDelete') public popupCustomerDelete: ModalDirective;
    titleCustomerTag: string;
    // filtering
    filterArray: any = [];
    selectedFilter: string;
    selectedFilterParam: string = '';
    filterValue: any;
    @ViewChild('searchBox') searchBox: any;
    searchTerms = new Subject<string>();

    constructor(private customerService: CustomerService,
                private router: Router,
                private appComponent: AppComponent) {
        this.appComponent.bodyClass = 'page-customers-index';
    }

    ngOnInit() {
        this.getDataCustomer(this.pagination.number, this.filterArray);
        this.getAllCustomerTags();
        // search box
        this.search();
    }

    // Filter and search
    selectItemFilter(param: string, value: any) {
        this.addFilter(param, value);
        const TabPanels = document.querySelectorAll('.next-tab');
        const TabPanel_All = document.querySelector('.next-tab.next-tab-panel--all');
        const TabPanel_CustomSearch = document.querySelector('.next-tab.next-tab-panel--custom-search');
        if (!this.filterArray.length) {
            TabPanel_CustomSearch.parentElement.classList.add('hide');
            [].forEach.call(TabPanels, function (el: any) {
                el.classList.remove('next-tab--is-active');
            });
            TabPanel_All.classList.add('next-tab--is-active');
        } else {
            this.selectTab('customer-search', TabPanel_CustomSearch);
        }
    }

    addFilter(param: string, value: any) {
        this.isShowFilter = false;
        this.refreshFilter();

        if (this.filterArray.length) {
            let newItem = true;
            for (let key in this.filterArray) {
                if (this.filterArray[key].param == param) {
                    if (!value) {
                        this.filterArray = this.filterArray.filter((item: any) => item.param != param);
                    } else {
                        this.filterArray[key].value = value;
                    }
                    newItem = false;
                    break;
                }
            }
            if (newItem) {
                this.filterArray.push({
                    param: param,
                    value: value
                });
            }
        } else {
            this.filterArray.push({
                param: param,
                value: value
            });
        }
        // get data with query search
        this.pagination.number = 1;
        this.getDataCustomer(this.pagination.number, this.filterArray);
    }

    refreshFilter() {
        this.selectedFilter = '';
        this.selectedFilterParam = '';
        this.filterValue = null;
    }

    search() {
        this.searchTerms.pipe(
            debounceTime(500),
            distinctUntilChanged(),
        ).subscribe((value) => {
            this.addFilter('q[first_name_cont]', value);
        });
    }

    // End Filter and search
    // Get data customers
    getDataCustomer(page: number, search: any = []) {
        this.loading = true;
        this.customerService.getAllCustomers(page, search).subscribe(data => {
                this.loading = false;
                this.pagination = data.pagination;
                this.rootSource = data.customers;
                this.dataCustomer = this.rootSource;
            }
        );
    }

    getAllCustomerTags() {
        this.customerService.getAllTag().subscribe(
            data => {
                this.customerTagTemp = data;
                this.customerTag = data.filter((item: any, index: any) => index <= 10);
            }
        )
    }

    // END Get data customers

    paginationLoad(event: LazyLoadEvent) {
        setTimeout(() => {
            if (this.dataCustomer) {
                this.dataCustomer = this.dataCustomer.slice(event.first, (event.first + event.rows));
            }
        }, 250);
        console.log(event);
    }

    // select customer on table
    gotoDetail(event: any) {
        let selectedCustomer = event.data;
        this.router.navigate(['/customers', selectedCustomer.id]);
    }

    // END select customer on table

    // select tab panel
    selectTab(status: string, event: any) {
        let elems = document.querySelectorAll('.next-tab');
        [].forEach.call(elems, function (el: any) {
            el.classList.remove('next-tab--is-active');
        });

        if (event.target) {
            event.target.classList.add('next-tab--is-active');
            const TabPanel_CustomSearch = document.querySelector('.next-tab.next-tab-panel--custom-search');
            TabPanel_CustomSearch.parentElement.classList.add('hide');
        } else {
            event.parentElement.classList.remove('hide');
            event.classList.add('next-tab--is-active');
        }
        switch (status) {
            case 'all':
                setTimeout(() => {
                    this.filterArray = [];
                    this.getDataCustomer(this.pagination.number, this.filterArray);
                    console.log('all');
                }, 2000);
                break;
            case 'accepts-marketing':
                this.loading = true;
                setTimeout(() => {
                    this.loading = false;
                    this.filterArray = [];
                    this.addFilter('q[accept_marketing_eq]', true)
                }, 2000);
                break;
            case 'customer-search':
                this.loading = true;
                setTimeout(() => {
                    this.loading = false;
                }, 2000);
                break;
        }
    }

    // END select tab panel

    // Checkbox customers
    // Select all customer
    clickSelectAll(element: HTMLInputElement) {
        let elems = document.querySelectorAll('.input-checkbox');
        if (element.checked) {
            // Select all
            [].forEach.call(elems, function (el: any) {
                el.checked = true;
            });
            for (const item of this.dataCustomer) {
                this.selectList.push(item.id);
            }
        } else {
            [].forEach.call(elems, function (el: any) {
                el.checked = false;
            });
            this.selectList = [];
        }
    }

    clickSelect(id: number, checked: boolean) {
        if (checked) {
            this.selectList.push(id);
        } else {
            this.selectList = this.selectList.filter((item: any, index: any) => item !== id);
        }
    }

    refreshSelectList() {
        let checkAll = <HTMLInputElement>document.getElementById('bulk-actions__select-all');
        checkAll.checked = false;
        this.selectList = [];
    }

    // END Checkbox customers

    // Bulk action
    // Edit multi customer
    bulkAction() {
        this.router.navigate(['/customers/bulk', {ids: this.selectList}]);
    }

    // END Edit multi customer
    // destroy, add_tag, remove_tag customers
    bulkSelectedItem(ops: string, value: any = []) {
        let model = {
            operation: ops,
            customer_ids: this.selectList,
            value: value
        };

        let flashMessageList = {
            destroy: 'Deleted customer!',
            add_tag: 'Added tag ' + this.selectList.length + ' customer!',
            remove_tag: 'Removed tag ' + this.selectList.length + ' customer!'
        };

        this.isShowBulkAction = false;
        this.popupCustomerDelete.hide();
        this.popupCustomerTag.hide();

        this.customerService.bulkPages(model)
            .subscribe(res => {
                    if (res.code === 200) {
                        this.refreshSelectList();
                        this.getDataCustomer(this.pagination.number, this.filterArray);
                        this.isShowFlashMessage = true;
                        this.flash_message = flashMessageList[ops];
                        setTimeout(() => {
                            this.isShowFlashMessage = false;
                        }, 4000);
                    } else {
                        console.log('Failed!');
                    }
                },
                error => {
                    this.loading = false;
                    console.log('Error');
                });
    }

    // END destroy, add_tag, remove_tag customers
    // END Bulk action: edit multi customer

    // Popover bulk action customer
    showPopupTag(title: string) {
        this.titleCustomerTag = title;
        this.popupCustomerTag.show();
    }

    // END Popover bulk action customer
}
