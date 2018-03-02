import {Component, OnInit} from '@angular/core';
import {ThemeService} from '../../../services/theme.service';
import {Theme} from '../../../models/theme';
const _ = require('lodash');
require('lodash.product');
@Component({
    selector: 'app-themes-main',
    templateUrl: './themes-main.component.html',
})
export class ThemesMainComponent implements OnInit {
    loading = false;
    rootSource: any = [];
    dataTheme: any = [];
    isShowUpdateTheme: string = '';
    isShowActivator = false;
    currentTheme = new Theme();
    updateTheme = new Theme();
    arr2 = {
        products: [
            {
                id: 217,
                title: 'no variants 1 ',
                body_html: '<p>no variants</p>',
                image: {
                    id: 532,
                    product_id: 217,
                    position: '2.0',
                    created_at: '2018-01-05T08:35:43.689Z',
                    updated_at: '2018-01-05T08:35:43.705Z',
                    src: 'http://banxinh.de3.coded.work/system/images/images/000/000/532/large/namtrung.jpg?1515141342',
                    variant_ids: []
                },
                metafield_title: 'no variants 1http://banxinh.de3.coded.work/system/images/images/000/000/532/large/namtrung.jpg?1515141342',
                metafield_description: 'no variants',
                handle: 'no-variants-1',
                variants: [
                    {
                        id: 499,
                        price: 'fbsaf',
                        compare_at_price: 80,
                        barcode: '456',
                        grams: 0,
                        weight_unit: null,
                        sku: '123',
                        product_id: 217,
                        metafield: null,
                        position: 0,
                        inventory_policy: 0,
                        inventory_quantity: 0,
                        inventory_management: 0,
                        image_url: null,
                        image_id: 0,
                        metafields_global_harmonized_system_code: 123456,
                        option1: 'Default Title',
                        option2: null,
                        option3: null,
                        requires_shipping: false,
                        taxable: false,
                        title: 'Default Title',
                        fulfillment_service: null
                    }
                ],
                options: [],
                vendor: 'NEWLAND',
                product_type: 'Cleansing / Mask Pack',
                tags: [
                    'Skin Care',
                    'Cre8skin',
                    'Basic Care'
                ]
            },
            {
                id: 215,
                title: 'test variants 5',
                body_html: '<p>test variants 5</p>',
                image: {
                    id: 528,
                    product_id: 215,
                    position: '0.5',
                    created_at: '2018-01-03T02:19:05.178Z',
                    updated_at: '2018-01-10T02:52:26.555Z',
                    src: 'http://banxinh.de3.coded.work/system/images/images/000/000/528/large/hoa-sinh-nhat-tang-me-3.jpg?1514945944',
                    variant_ids: []
                },
                metafield_title: 'test variants 5',
                metafield_description: 'test variants 5',
                handle: 'test-variants-5',
                variants: [
                    {
                        id: 495,
                        price: 110,
                        compare_at_price: 90,
                        barcode: '456',
                        grams: 0,
                        weight_unit: null,
                        sku: '123',
                        product_id: 215,
                        metafield: null,
                        position: 0,
                        inventory_policy: 0,
                        inventory_quantity: 0,
                        inventory_management: null,
                        image_url: 'http://banxinh.de3.coded.work/system/images/images/000/000/531/original/IMG_23062016_153811.png?1514969045',
                        image_id: 531,
                        metafields_global_harmonized_system_code: '',
                        option1: 'Black',
                        option2: 'L',
                        option3: '123',
                        requires_shipping: false,
                        taxable: true,
                        title: 'Black / L / 123',
                        fulfillment_service: null
                    },
                    {
                        id: 498,
                        price: 130,
                        compare_at_price: 90,
                        barcode: '456',
                        grams: 0,
                        weight_unit: null,
                        sku: '123',
                        product_id: 215,
                        metafield: null,
                        position: 0,
                        inventory_policy: 0,
                        inventory_quantity: 0,
                        inventory_management: null,
                        image_url: 'http://banxinh.de3.coded.work/system/images/images/000/000/531/original/IMG_23062016_153811.png?1514969045',
                        image_id: 531,
                        metafields_global_harmonized_system_code: '',
                        option1: 'Blue',
                        option2: 'L',
                        option3: '123',
                        requires_shipping: false,
                        taxable: false,
                        title: 'Blue / L / 123',
                        fulfillment_service: null
                    },
                    {
                        id: 497,
                        price: 100,
                        compare_at_price: 90,
                        barcode: '456',
                        grams: 0,
                        weight_unit: null,
                        sku: '123',
                        product_id: 215,
                        metafield: null,
                        position: 0,
                        inventory_policy: 0,
                        inventory_quantity: 0,
                        inventory_management: null,
                        image_url: 'http://banxinh.de3.coded.work/system/images/images/000/000/531/original/IMG_23062016_153811.png?1514969045',
                        image_id: 531,
                        metafields_global_harmonized_system_code: '',
                        option1: 'Blue',
                        option2: 'M',
                        option3: '123',
                        requires_shipping: false,
                        taxable: false,
                        title: 'Blue / M / 123',
                        fulfillment_service: null
                    },
                    {
                        id: 496,
                        price: 130,
                        compare_at_price: 90,
                        barcode: '456',
                        grams: 0,
                        weight_unit: null,
                        sku: '123',
                        product_id: 215,
                        metafield: null,
                        position: 0,
                        inventory_policy: 0,
                        inventory_quantity: 0,
                        inventory_management: null,
                        image_url: 'http://banxinh.de3.coded.work/system/images/images/000/000/531/original/IMG_23062016_153811.png?1514969045',
                        image_id: 531,
                        metafields_global_harmonized_system_code: '',
                        option1: 'Black',
                        option2: 'M',
                        option3: '123',
                        requires_shipping: false,
                        taxable: true,
                        title: 'Black / M / 123',
                        fulfillment_service: null
                    }
                ],
                options: [],
                vendor: 'NEWLAND',
                product_type: 'Cleansing / Mask Pack',
                tags: [
                    'SKINCARE_Basic care',
                    'Basic Care',
                    'BRANDS_Cre8skin',
                    'Cre8skin',
                    'Brands'
                ]
            },
            {
                id: 214,
                title: 'test variants 4',
                body_html: '<p>test variants 4</p>',
                image: {
                    id: 537,
                    product_id: 214,
                    position: '2.0',
                    created_at: '2018-01-10T03:30:27.740Z',
                    updated_at: '2018-01-10T10:23:09.229Z',
                    src: 'http://banxinh.de3.coded.work/system/images/images/000/000/537/large/50-hinh-anh-banh-sinh-nhat-dep-de-thuong-13.jpg?1515555027',
                    variant_ids: [
                        -1
                    ]
                },
                metafield_title: 'test variants 4',
                metafield_description: 'test variants 4',
                handle: 'test-variants-4',
                variants: [
                    {
                        id: 506,
                        price: 150,
                        compare_at_price: 90,
                        barcode: '456',
                        grams: 0,
                        weight_unit: null,
                        sku: '123',
                        product_id: 214,
                        metafield: null,
                        position: 0,
                        inventory_policy: 0,
                        inventory_quantity: 0,
                        inventory_management: null,
                        image_url: 'http://banxinh.de3.coded.work/system/images/images/000/000/538/original/cach-lam-banh-kem-sinh-nhat-don-gian-nhat-16.png?1515555037',
                        image_id: 538,
                        metafields_global_harmonized_system_code: '',
                        option1: 'S',
                        option2: 'Red',
                        option3: '123',
                        requires_shipping: false,
                        taxable: false,
                        title: 'S / Red / 123',
                        fulfillment_service: null
                    },
                    {
                        id: 510,
                        price: 100,
                        compare_at_price: 90,
                        barcode: '456',
                        grams: 500,
                        weight_unit: null,
                        sku: '123',
                        product_id: 214,
                        metafield: null,
                        position: 0,
                        inventory_policy: 1,
                        inventory_quantity: 100,
                        inventory_management: 0,
                        image_url: null,
                        image_id: null,
                        metafields_global_harmonized_system_code: '123456',
                        option1: 'XL',
                        option2: 'Green',
                        option3: '456',
                        requires_shipping: true,
                        taxable: false,
                        title: 'XL / Green / 456',
                        fulfillment_service: 'manual'
                    },
                    {
                        id: 505,
                        price: 150,
                        compare_at_price: 90,
                        barcode: '456',
                        grams: 0,
                        weight_unit: null,
                        sku: '123',
                        product_id: 214,
                        metafield: null,
                        position: 0,
                        inventory_policy: 0,
                        inventory_quantity: 0,
                        inventory_management: null,
                        image_url: 'http://banxinh.de3.coded.work/system/images/images/000/000/540/original/IMG_23062016_153811.png?1515573679',
                        image_id: 540,
                        metafields_global_harmonized_system_code: '',
                        option1: 'M',
                        option2: 'Black',
                        option3: '123',
                        requires_shipping: false,
                        taxable: false,
                        title: 'M / Black / 123',
                        fulfillment_service: null
                    }
                ],
                options: [],
                vendor: 'BEAUTYLAB',
                product_type: 'Make-up',
                tags: [
                    'Brands',
                    'Cre8skin',
                    'BRANDS_Moeim'
                ]
            }
        ]
    };
    arr1 = {
        products: {
            id: {
                required: 'id is required'
            },
            title: {
                required: 'title is required'
            },
            metafield_title: {
                required: 'metafield title is required',
                max: 70,
                maxMsg: 'metafield title max length is 70 characters'
            },
            metafield_description: {
                required: 'metafield_title is required',
                max: 160,
                maxMsg: 'metafield description max length is 160 characters'
            },
            handle: {
                required: 'handle is required'
            },
            variants: {
                is_array: true,
                price: {
                    required: 'variant is required',
                    numberic: 'variant must be numberic'
                },
                compare_at_price: {
                    required: 'compare at price is required',
                    numberic: 'compare at price must be numberic'
                },
                metafields_global_harmonized_system_code: {
                    numberic: 'metafields global harmonized system code must be numberic'
                },
            }
        }
    };
    errorMsg: any = [];
    constructor(private themeService: ThemeService) {
    }

    ngOnInit() {
        this.getData();
        for (const product of this.arr2.products) {
            this.errorMsg.push(this.validation(this.arr1.products, product));
        }
        console.log(this.errorMsg);
    }

    getData() {
        this.themeService.getAllThemes().subscribe(data => {
            this.rootSource = data.themes;
            this.dataTheme = this.rootSource;
            this.currentTheme = this.dataTheme.find(theme => theme.role === true);
        })
    }

    onHidden() {
        return this.isShowUpdateTheme;
    }

    validation(dictionary: any, object: any) {
        const errorMsg = {
            id: object.id,
            errors: []
        };

        const keysDict = Object.keys(dictionary);
        const keysObj = Object.keys(object);

        keysDict.forEach(key => {

            if (keysObj.findIndex(ele => ele === key) !== -1) {
                if (!dictionary[key].is_array) {
                    if (dictionary[key].required) {
                        if (object[key] === null) {
                            errorMsg.errors.push(dictionary[key].required);
                        }
                    }
                    if (dictionary[key].numberic) {
                        if (object[key] !== _.toNumber(object[key])) {
                            errorMsg.errors.push(dictionary[key].numberic);
                        }
                    }
                    if (dictionary[key].max) {
                        if (object[key].length > dictionary[key].max) {
                            errorMsg.errors.push(dictionary[key].maxMsg);
                        }
                    }
                } else {
                    errorMsg[key] = [];
                    object[key].forEach(item => {
                        errorMsg[key].push(this.validation(dictionary[key], item));
                    })
                }
            }
        });
        return errorMsg;
    }

    showingUpdateTheme(theme: Theme) {
        this.isShowActivator = false;
        this.isShowUpdateTheme = theme.name;
    }
    submitUpdate() {

    }
}
