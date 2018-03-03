import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {Observable} from "rxjs";
import * as moment from 'moment';
import {HttpClient} from "@angular/common/http";

import {AuthenticationService} from "./authentication.service";
import {JSONObject} from "../models/JSONObject";
import {User} from "../models/user";
import {Product} from "../models/product";
import {Variant} from "../models/variant";

const _ = require('lodash');
require('lodash.product');

@Injectable()
export class ProductService {
  constructor(private http: HttpClient,

              private authentication: AuthenticationService) {
  }

  create(product: any): Observable<any> {
    return this.http.post<JSONObject>('/products.json', JSON.stringify({product: product})).map((response) => {
      return response;
    });
  }

  update(product: any, id: number): Observable<any> {
    return this.http.put<JSONObject>('/products/' + id + '.json', JSON.stringify({product: product}))
      .map((response) => {
        return response;
      });
  }

  getAllProducts(page: number, param: any = []): Observable<any> {
    let string = this.queryStringParams(param);
    return this.http.get<JSONObject>(`/products.json?page=${page}&order=created_at_desc${string}`)
      .map((response) => {
        if (response.code == 200) {
          return response;
        }
        console.log(response);
      });
  }

  getAllProductType(param: any = []): Observable<any> {
    let string = this.queryStringParams(param);
    return this.http.get<JSONObject>('/product_types.json?' + string)
      .map((response) => {
        if (response.code == 200) {
          return response.product_types;
        }
        console.log(response);
      });
  }

  getAllProductVendor(param: any = []): Observable<any> {
    let string = this.queryStringParams(param);
    return this.http.get<JSONObject>('/vendors.json?' + string)
      .map((response) => {
        if (response.code == 200) {
          return response.vendors;
        }
        console.log(response);
      });
  }

  getProductByID(id: number): Observable<Product> {
    return this.http.get<JSONObject>('/products/' + id + '.json')
      .map((response) => {
        if (response.code == 200) {
          return response.product;
        }
        console.log(response);
      });
  }

  uploadImage(data: any, productId: number): Observable<any> {
    return this.http.post<JSONObject>('/products/' + productId + '/images.json', data)
      .map((response) => {
        return response;
      });
  }

  deleteImage(imageID: number, productId: number): Observable<any> {
    return this.http.delete<JSONObject>('/products/' + productId + '/images/' + imageID + '.json')
      .map((response) => {
        return response;
      });
  }

  reoderImage(data: any, productId: number, imageId: number): Observable<any> {
    return this.http.post<JSONObject>('/products/' + productId + '/images/' + imageId + '/reorder.json', data)
      .map((response) => {
        return response;
      });
  }

  productBulkAction(data: any): Observable<any> {
    return this.http.put<JSONObject>('/products/set.json', JSON.stringify(data))
      .map((response) => {
        return response;
      });
  }

  getAllTag(param: any = []): Observable<any> {
    let string = this.queryStringParams(param);
    return this.http.get<JSONObject>('/tags/products.json?' + string)
      .map((response) => {
        if (response.code == 200) {
          return response.tags;
        }
        console.log(response);
      });
  }

  // Variant
  deleteVariant(variantID: number, productId: number): Observable<any> {
    return this.http.delete<JSONObject>('/products/' + productId + '/product_variants/' + variantID + '.json')
      .map((response) => {
        return response;
      });
  }

  updateVariant(data: Variant, productId: number): Observable<any> {
    return this.http.put<JSONObject>('/products/' + productId + '/product_variants/' + data.id + '.json', JSON.stringify({product_variant: data}))
      .map((response) => {
        return response;
      });
  }

  addVariant(data: Variant, productId: number): Observable<any> {
    return this.http.post<JSONObject>('/products/' + productId + '/product_variants.json', JSON.stringify({product_variant: data}))
      .map((response) => {
        return response;
      });
  }

  variantsBulkAction(data: any, productId: number): Observable<any> {
    return this.http.post<JSONObject>('/products/' + productId + '/product_variants/set.json', JSON.stringify(data))
      .map((response) => {
        return response;
      });
  }

  // End variant

  toSeoUrl(str: string) {
    if (str != null) {
      // Chuyển hết sang chữ thường
      str = str.toLowerCase();

      // xóa dấu
      str = str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a');
      str = str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
      str = str.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
      str = str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
      str = str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u');
      str = str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
      str = str.replace(/(đ)/g, 'd');

      // Xóa ký tự đặc biệt
      str = str.replace(/([^0-9a-z-\s])/g, '');

      // Xóa khoảng trắng thay bằng ký tự -
      str = str.replace(/(\s+)/g, '-');

      // xóa phần dự - ở đầu
      str = str.replace(/^-+/g, '');

      // xóa phần dư - ở cuối
      str = str.replace(/-+$/g, '');

      // return
      return str;
    }
    return '';
  }

  removeHtmlTag(text: string) {
    let result = '';
    if (text != null) {
      let regex = /(<([^>]+)>)/ig;
      result = text.replace(regex, "");
    }
    return result;
  }

  queryStringParams(param: any = []) {
    let string = "&";
    for (let key in param) {
      if (param.hasOwnProperty(key)) {
        string += param[key].param + "=" + param[key].value + "&";
      }
    }
    return string.substring(0, string.length - 1);
  }

  reCalculatorOptionsVariants(product: Product, listVariantsDelete: any) {
    for (let key in product.options) {
      let values = [];
      for (let variant of product.variants) {
        let option = variant['option' + (parseInt(key) + 1)];
        if (_.isArray(listVariantsDelete)) {
          if (listVariantsDelete.indexOf(variant.id) == -1) {
            if (values.indexOf(option) == -1) {
              values.push(option);
            }
          } else {
            product.variants = product.variants.filter((item: any, index: number) => item.id != variant.id);
          }
        } else {
          if (listVariantsDelete != variant.id) {
            if (values.indexOf(option) == -1) {
              values.push(option);
            }
          } else {
            product.variants = product.variants.filter((item: any, index: number) => item.id != variant.id);
          }
        }

      }
      product.options[key].values = values;
    }
    return product;
  }
}
