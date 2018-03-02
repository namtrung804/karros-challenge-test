import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {Page} from '../../../models/page';
import {PageService} from '../../../services/page.service';
import {ProductService} from '../../../services/product.service';

import {AppComponent} from '../../app.component';

@Component({
  selector: 'app-page-detail',
  templateUrl: './page-detail.component.html'
})
export class PageDetailComponent implements OnInit {
  page: any = new Page();
  pageForm: FormGroup;
  loading = false;
  editSearchEngine = false;
  isShowDelete = false;
  isShowFlashMessage = false;
  isShowSetLink = false;
  flash_message = '';
  pageId: number;
  publishDate: Date;
  ToDay: Date = new Date();
  vi: any;

  constructor(private fb: FormBuilder,
              private router: Router, private route: ActivatedRoute,
              private pageService: PageService,
              private productService: ProductService,
              private appComponent: AppComponent) {

  }

  ngOnInit() {
    this.vi = {
      firstDayOfWeek: 0,
      dayNames: ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ tư', 'Thứ 5', 'Thứ sáu', 'Thứ 7'],
      dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
      dayNamesMin: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
      monthNames: ['Tháng một', 'Tháng hai', 'Tháng ba', 'Tháng bốn', 'Tháng năm', 'Tháng sáu',
        'Tháng bảy', 'Tháng tám', 'Tháng chín', 'Tháng mười', 'Tháng mười một', 'Tháng mười hai'],
      monthNamesShort: ['Một', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy', 'Tám', 'Chín', 'Mười', 'Mười một', 'Mười hai'],
      today: 'Hôm nay',
      clear: 'Làm mới'
    };
    this.route.params.subscribe((params) => {
        if (params.id) {
          this.pageId = params.id;
          this.getData(params.id);
        }
        if (this.pageId) {
          this.appComponent.bodyClass = 'page-pages-show';
        } else {
          this.appComponent.bodyClass = 'page-pages-new';
        }
      }
    );
    this.buildForm();
  }

  buildForm(): void {
    this.pageForm = this.fb.group({
      page: this.fb.group({
        title: [null, [
          Validators.required
        ]
        ],
        body_html: [null, [
          Validators.required
        ]
        ],
        handle: [null, [
          Validators.required
        ]
        ],
        published: [null, [
          Validators.required,
        ]
        ],
        published_at: [null, [
          Validators.required,
        ]
        ],
        metafields_global_title_tag: [null, [
          Validators.required,
          Validators.maxLength(70)
        ]
        ],
        metafields_global_description_tag: [null, [
          Validators.required,
          Validators.maxLength(160)
        ]
        ],
        author: [null, [
          Validators.required
        ]
        ],
        template_suffix: ['', [
          Validators.required
        ]
        ],
      }),
    });
    this.onChangesForm();
  }

  focusTitle() {
    const title = this.pageForm.get('page').get('title');
    const handle = this.pageForm.get('page').get('handle');

    if (title.value === handle.value.replace('-', ' ')) {
      title.valueChanges.subscribe(data => {
        handle.setValue(this.productService.toSeoUrl(data));
      });
    }
  }

  changeTitle(value: any) {
    this.page.metafields_global_title_tag = value;
    if (value != null) {
      if (this.page.metafields_global_title_tag.length > 70) {
        this.page.metafields_global_title_tag = value.slice(0, 70);
      }
    }
  }

  changeBodyHTML(value: any) {
    this.page.metafields_global_description_tag = value;
    if (value != null) {
      if (this.page.metafields_global_description_tag.length > 160) {
        this.page.metafields_global_description_tag = value.slice(0, 160);
      }
    }
  }

  onChangesForm() {
    this.pageForm.valueChanges.subscribe(data => {
      if (data.page.body_html !== '') {
        const bodyHTML = document.createElement('p');
        bodyHTML.innerHTML = data.page.body_html;

        this.page.metafields_global_description_tag = (bodyHTML.outerText);
        if (this.page.metafields_global_description_tag.length > 160) {
          this.page.metafields_global_description_tag = (bodyHTML.outerText).slice(0, 160);
        }
      }
    })
  }

  submitFormPage() {
    const model = this.pageForm.get('page').value;
    if (this.pageId) {
      this.pageService.update(model, this.pageId).subscribe(
        data => {
          if (data.code === 200) {
            this.page = data.page;
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
      )
    } else {
      this.pageService.create(model).subscribe(
        data => {
          if (data.code === 200) {
            this.router.navigate(['/pages']);
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
  }

  getData(pageId: number) {
    this.pageService.getById(pageId).subscribe(
      data => {
        this.page = data.page;
        this.publishDate = new Date(this.page.published_at);
      }
    );
  }

  submitDeletePage(pageID: number) {
    this.pageService.deleteById(pageID).subscribe(
      data => {
        if (data.code === 200) {
          this.isShowDelete = false;
          this.router.navigate(['/pages']);
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

  showFlassMessage(msg: string) {
    this.isShowFlashMessage = true;
    this.flash_message = msg;
    setTimeout(() => {
      this.isShowFlashMessage = false;
    }, 4000);
  }

  onHidden(): Boolean {
    return this.isShowDelete;
  }

  setHiddenDate() {
    this.isShowSetLink = false;
    delete this.publishDate;
  }

  setVisibleDate() {
    this.publishDate = new Date();
  }
}
