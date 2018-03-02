import {CollectionRules} from "./collection-rules";

export class Collection {
  id: number = -1;
  body_html: string = '';
  metafield: string = '';
  published: boolean = false;
  published_at: string = '';
  sort_order: string = 'best-selling';
  template_suffix: string = '';
  title: string = '';
  created_at: string = '';
  updated_at: string = '';
  handle: string = '';
  metafield_title: string = '';
  metafield_description: string = '';
  disjunctive: boolean = false;
  collection_type: string = 'smart';
  image_url: string = null;
  image_id: number = null;
  rules: any = [];

  constructor() {
    this.rules.push(new CollectionRules());
  }

}
