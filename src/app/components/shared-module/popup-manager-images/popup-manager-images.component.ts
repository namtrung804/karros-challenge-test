import {Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {AuthenticationService} from "../../../services/authentication.service";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {AlertService} from "../../../services/alert.service";
import {DOCUMENT} from "@angular/common";
import {PageScrollService} from "ng2-page-scroll";
import {AppComponent} from "../../app.component";
import {CollectionService} from "../../../services/collection.service";

import {ProductService} from "../../../services/product.service";
import {ValidationService} from "../../../services/validation.service";
import {Variant} from "../../../models/variant";
import {Observable} from "rxjs/Observable";
import {Product} from "../../../models/product";
import {ProductImages} from "../../../models/product-images";

const _ = require('lodash');
require('lodash.product');

@Component({
  selector: 'app-popup-manager-images',
  templateUrl: './popup-manager-images.component.html'
})
export class PopupManagerImagesComponent implements OnInit {
  product: any = new Product();
  filesToUpload: any = [];
  productImages: any = [];
  @ViewChild('popupChangeImageVariant') popupChangeImageVariant: any;
  imgIDVariantSelected: number = 0;
  listVariantsID: any = [];
  listVariantsObject: any = [];
  @Output('reload-data') reloadData = new EventEmitter<any>();

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute,
              private authenticationService: AuthenticationService,
              private alertService: AlertService,
              private formBuilder: FormBuilder,
              private elementRef: ElementRef,
              private translate: TranslateService,
              private validationService: ValidationService,
              private productService: ProductService,
              private pageScrollService: PageScrollService,
              private collectionService: CollectionService,
              @Inject(DOCUMENT) private document: any,
              private appComponent: AppComponent) {
  }

  ngOnInit() {
  }

  showPopup(product: any, imgVariSelected: number, listVarisID: any, listVarisObject: any) {
    this.product = product;
    this.productImages = product.images;
    this.popupChangeImageVariant.show();
    this.imgIDVariantSelected = imgVariSelected;
    this.listVariantsID = listVarisID;
    this.listVariantsObject = listVarisObject;
  }

  changeImageVariant(imageID: number) {
    if (this.listVariantsID.length) {
      this.updateVariants('image_id', imageID).subscribe((respone) => {
        this.popupChangeImageVariant.hide();
        this.reloadData.emit({reload: true});
      });
    } else {
      this.reloadData.emit({imageID: imageID});
      this.popupChangeImageVariant.hide();
    }
  }

  updateVariants(col: string = '', value: any = '') {
    const temp: any = [];
    for (let vari of this.listVariantsObject) {
      if (col != '') {
        vari[col] = value;
      }
      temp.push(this.productService.updateVariant(vari, this.product.id).map(
        result => result)
      );
    }
    return Observable.forkJoin(temp);
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.filesToUpload = [];
      for (const key in  event.target.files) {
        let reader = new FileReader();
        let file = event.target.files[key];
        if (!_.isUndefined(file.size)) {
          reader.readAsDataURL(file);
          reader.onload = () => {
            let image = new ProductImages();
            image.src = reader.result;
            this.productImages.push(image);
            this.filesToUpload.push(file);
          };
        }
      }
      // upload file when product != -1
      setTimeout(() => {
        if (this.product.id != -1) {
          this.uploadImage(this.product.id).subscribe((respone: any) => {
            this.reloadData.emit({reload: true});
          });
        }
      }, 100);

    }
  }

  uploadImage(productID: number) {
    const files: Array<File> = this.filesToUpload;
    const temp: any = [];
    if (files.length) {
      for (const key in files) {
        const formData: any = new FormData();
        formData.append('image', files[key]);
        temp.push(this.productService.uploadImage(formData, productID).map(
          result => result)
        );
      }
      return Observable.forkJoin(temp);
    }
  }
}
