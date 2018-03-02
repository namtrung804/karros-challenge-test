import {Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DOCUMENT} from '@angular/common';

import {CustomerService} from '../../../services/customer.service';
import {Customer} from '../../../models/customer';
import {HeaderMainComponent} from '../../layout-main/header-main/header-main.component';

const _ = require('lodash');

@Component({
    selector: 'app-popup-manager-tags',
    templateUrl: './popup-manager-tags.component.html'
})
export class PopupManagerTagsComponent implements OnInit {
    @ViewChild('popupCustomerTag') popupCustomerTag: any;
    @Input() customer = new Customer();
    @Input() customerTags: any = [];
    @Input() appliedTagsTemp: any = [];
    appliedTags: any = [];
    isShowBar = false;
    @Output() reloadData = new EventEmitter<any>();

    constructor(private customerService: CustomerService,
                @Inject(DOCUMENT) private document: any) {
    }

    ngOnInit() {
    }
    // TODO : làm thêm phần view chọn tags xài chung
    showPopup(customer: Customer, customerTags: any, appliedTagsTemp: any) {
        this.customer = customer;
        this.customerTags = customerTags;
        this.appliedTagsTemp = appliedTagsTemp;
        this.popupCustomerTag.show();
    }

    addTag(source: any, value: any) {
        if (!source.includes(value) && !this.customer.tags.includes(value) && !this.appliedTagsTemp.includes(value)) {
            source.push(value);
            this.isShowBar = true;
        }
    }

    removeTag(source: any, value: any) {
        return source.filter(
            tag => tag !== value
        );
    }

    cancelChange() {
        this.appliedTags = [];
        this.popupCustomerTag.hide();
    }

    applyChange() {
        this.reloadData.emit({appliedTags: this.appliedTags});
        this.appliedTags = [];
        this.popupCustomerTag.hide();
    }
}
