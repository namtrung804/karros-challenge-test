import {Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChange, ViewChild} from '@angular/core';
import {DOCUMENT} from '@angular/common';

import {Subject} from 'rxjs/Subject';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

const _ = require('lodash');

@Component({
  selector: 'app-popup-manager-tags',
  templateUrl: './popup-manager-tags.component.html'
})
export class PopupManagerTagsComponent implements OnChanges {
  @ViewChild('popupAllTag') popupAllTag: any;
  @Input() tagsExists: any = []; // Source's tags exists
  @Input() dataTags: any = []; // All tags exists
  tagsExistsTemp: any = [];
  dataTagsTemp: any = [];
  isShowFreqTags = false; // To show freq pop-up
  @Output() reloadData = new EventEmitter<any>();
  // Tag search
  @ViewChild('inputTags') inputTags: any;
  public boxSearchTags = new Subject<string>();
  tagSearch: string = '';
  errorMessageTag = false;

  constructor(@Inject(DOCUMENT) private document: any) {
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (const propName in changes) {
      const changedProp = changes[propName];
      this[propName] = changedProp.currentValue;
    }
    this.tagsExistsTemp = JSON.parse(JSON.stringify(this.tagsExists));
    this.searchTag();
  }

  showFreqTags() {
    this.isShowFreqTags = true;
    this.dataTagsTemp = this.dataTags.filter((item: any, index: number) => item != null && this.tagsExists.indexOf(item) == -1);
  }

  addRemoveTag(tag: string, close: boolean = false) {
    if (this.tagsExists.indexOf(tag) != -1) {
      if (close) {
        this.tagSearch = '';
        this.isShowFreqTags = false;
        return
      }
      this.tagsExists = this.tagsExists.filter((item: any) => item != tag);
    } else {
      this.tagsExists.push(tag);
    }
    this.dataTagsTemp = this.dataTags.filter((item: any, index: number) => item != null && this.tagsExists.indexOf(item) == -1);
    if (close) {
      this.tagSearch = '';
      this.isShowFreqTags = false;
    }
    this.inputTags.nativeElement.value = '';
    this.reloadData.emit({isChanged: true, tagsExists: this.tagsExists, isShowBar: true});
  }

  cancelChange() {
    this.tagsExists = this.tagsExistsTemp;
    this.popupAllTag.hide();
  }

  searchTag() {
    this.boxSearchTags.pipe(
      debounceTime(500),
      distinctUntilChanged(),
    ).subscribe((value) => {
      this.isShowFreqTags = true;
      this.tagSearch = value;
      if (!value) {
        this.dataTagsTemp = this.dataTags.filter((item: any, index: number) => item != null && this.tagsExists.indexOf(item) === -1);
        return;
      }
      this.dataTagsTemp = this.dataTags.filter((item: any, index: number) => this.tagsExists.indexOf(item) === -1
        && item != null && item.toLowerCase().indexOf(value.toLowerCase()) > -1);
    });
  }

  isActiveTag(tag: any) {
    return this.tagsExists.indexOf(tag) !== -1
  }

  clickOutSide() {
    this.isShowFreqTags = false;
    this.inputTags.nativeElement.value = '';
    this.tagSearch = '';
  }
}
