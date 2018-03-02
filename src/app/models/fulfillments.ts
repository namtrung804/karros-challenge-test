import {LinesItem} from "./lines-item";

export class Fulfillments {
  id: number = -1;
  order_id: number = 0;
  status: string = '';
  created_at: string = '';
  service: string = '';
  updated_at: string = '';
  tracking_company: string = '';
  shipment_status: string = '';
  tracking_number: string = '';
  tracking_numbers: any = [];
  tracking_url: string = '';
  tracking_urls: any = [];
  receipt: any = [];
  line_items: any = [];

  constructor() {
    this.line_items.push(new LinesItem());
  }
}
