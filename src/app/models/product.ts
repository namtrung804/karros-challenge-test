import {Variant} from './variant';
import {ProductAvatar} from './product-avatar';
import {ProductImages} from './product-images';
import {ProductOption} from "./product-option";
import {Collection} from "./collection";

export class Product {
  id: number = -1;
  title: string = '';
  body_html: string = '';
  created_at: string = '';
  handle: string = '';
  metafield_title: string = '';
  metafield_description: string = '';
  updated_at: string = '';
  published_at: string = '';
  template_suffix: string = '';
  published: string = '';
  vendor: string = '';
  product_type: string = '';
  tags: any = [];
  variant: any = [];
  variants: any = [];
  images: any = [];
  image: any;
  options: any = [];
  custom_collections: any = [];
  smart_collections: any = [];
  collection_ids: any = [];

  constructor() {
    this.variants.push(new Variant());
    this.images.push(new ProductImages());
    this.image = new ProductImages();
    this.variant = new Variant();
    this.options.push(new ProductOption());
  }
}
