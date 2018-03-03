import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {FormBuilder, FormGroup, FormArrayName, FormArray, Validators, FormControl} from '@angular/forms';


import {AppComponent} from '../../app.component';

import {MenuService} from '../../../services/menu.service';
import {ProductService} from '../../../services/product.service';
import {CollectionService} from '../../../services/collection.service';
import {ValidationService} from '../../../services/validation.service';
import {AlertService} from '../../../services/alert.service';
import {PageService} from '../../../services/page.service';
import {Menu} from '../../../models/menu';


@Component({
  selector: 'navigation-detail',
  templateUrl: './navigation-detail.component.html',
})
export class NavigationDetailComponent implements OnInit {
  // data variables
  menu: any = new Menu();
  loading = false;
  menuId: number;
  isNewMenu = false;
  link_lists: any;
  dataProduct: any;
  dataCollection: any;
  dataPage: any;
  title_bar: string = '';
  menuForm: FormGroup;

  // add/remove menu item
  itemCreate: any = [];
  itemDelete: any = [];

  // popup, message variables
  isShowDelete = false;
  isShowFlashMessage = false;
  flash_message = '';

  homepage = '/';
  validationMessages: any;

  constructor(private fb: FormBuilder,
              private appComponent: AppComponent,
              private router: Router,
              private route: ActivatedRoute,
              private menuService: MenuService,
              private productService: ProductService,
              private collectionService: CollectionService,
              private pageService: PageService,
              private validationService: ValidationService,
              private alertService: AlertService) {
    this.appComponent.bodyClass = 'page-menus-new';
    this.appComponent.bodyClass = 'page-menus-show';
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.menuId = params.id;
      }
    });
    this.getDataSource(this.menuId);
    this.getDataCollection();
    this.getDataProduct();
    this.getDataPage();
  }

  buildForm(data: any = []): void {
    this.menuId ? this.isNewMenu = true : this.isNewMenu = false;
    this.validationMessages = {
      menu: {
        title: {
          'required': 'Title is require',
        },
        handle: {
          'required': 'Handle is require',
        },
      },
      menu_item: {
        title: {
          'required': 'Menu item\'s title is require',
        }
      }
    };
    this.menuForm = this.fb.group({
      menu: this.fb.group({
        title: [data!.title, [
          Validators.required
        ]
        ],
        handle: [{value: data!.handle, disabled: this.isNewMenu}, [
          Validators.required
        ],
        ]
      }),
      menu_item: this.fb.array([]),
    });
    this.menu = data;
    if (this.menu.links.length) {
      this.setDataToForm(this.menu.links);
    }
    this.menuForm.get('menu').get('title').valueChanges.subscribe(data => {
      this.menuForm.get('menu').get('handle').setValue(this.productService.toSeoUrl(data));
    });
  }

  getDataSource(id: number) {
    if (this.menuId) {
      this.isNewMenu = true;
      this.menuService.getById(id).subscribe((data) => {
        this.buildForm(data.link_lists);
        this.title_bar = this.menu.title;
      });
    } else {
      this.title_bar = 'Add menu';
      this.addItem();
    }
  }

  getDataCollection() {
    if (!this.dataCollection) {
      this.collectionService.getAllCollections(1).subscribe(data => {
        this.dataCollection = data.collections;
      });
    }
  }

  getDataProduct() {
    if (!this.dataProduct) {
      this.productService.getAllProducts(1).subscribe(
        data => this.dataProduct = data.products
      );
    }
  }

  getDataPage() {
    if (!this.dataProduct) {
      this.pageService.getAllPages().subscribe(
        data => this.dataPage = data.pages
      );
    }
  }

  setDataToForm(links: any) {
    const control = <FormArray>this.menuForm.controls['menu_item'];
    for (const link of links) {
      const FGr = this.fb.group({
        title: [link.title, Validators.required],
        subject: [link.subject],
        position: [link.position],
        subject_params: [link.subject_params],
        linkable_type: [link.linkable_type],
        linkable_id: [link.linkable_id]
      });
      control.push(FGr);
    }
  }

  initItem() {
    return this.fb.group({
      title: ['', Validators.required],
      subject: [''],
      position: [''],
      subject_params: [''],
      linkable_type: ['HomePage'],
      linkable_id: [''],
    });
  }

  addItem() {
    const control = <FormArray>this.menuForm.controls['menu_item'];
    const menuCtrl = this.initItem();
    control.push(menuCtrl);
    this.itemCreate.push(menuCtrl);
  }


  removeItem(id: any) {
    const control = <FormArray>this.menuForm.get('menu_item');
    if (control.controls[id].get('id') !== null) {
      this.itemDelete.push(control.controls[id].get('id').value);
    }
    control.removeAt(id);
  }

  submitAddMenu() {
    const validation = this.validationService.validation(this.menuForm, this.validationMessages);
    if (validation !== '') {
      this.alertService.error(validation);
      return;
    }
    const model = this.menuForm.value;
    this.menuService.create(model).subscribe(
      data => {
        if (data.code === 200) {
          this.router.navigate(['/navigation']);
        } else {
          console.log('Failed!');
        }
      }
    )
  }

  submitUpdateMenu() {
    let modelUpdate = JSON.parse(JSON.stringify(this.menuForm.value));

    this.menuService.update(modelUpdate, this.menuId).subscribe(
      data => {
        if (data.code === 200) {
          this.resetMenuItem();
          this.link_lists = data.link_lists;
          this.setDataToForm(this.link_lists.links);
          this.showFlassMessage('Your menu has been updated!');
          console.log('Successful!');
        } else {
          console.log('Failed!');
        }
      },
      error => {
        this.loading = false;
        console.log('Error');
      }
    );
  }

  submitDeleteMenu(id: number) {
    this.menuService.deleteById(id).subscribe(
      data => {
        if (data.code === 200) {
          this.router.navigate(['/navigation/links']);
          console.log('Successful!');
        } else {
          console.log('Failed!');
        }
      },
      error => {
        this.loading = false;
        console.log('Error');
      }
    )
  }

  onHidden(): Boolean {
    return this.isShowDelete;
  }

  showFlassMessage(msg: string) {
    this.isShowFlashMessage = true;
    this.flash_message = msg;
    setTimeout(() => {
      this.isShowFlashMessage = false;
    }, 4000);
  }

  resetMenuItem() {
    const control = <FormArray>this.menuForm.controls['menu_item'];
    control.controls = [];
  }
}
