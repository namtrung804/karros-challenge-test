import {LinesItem} from "./lines-item";
import {BillingAddress} from "./billing-address";
import {Fulfillments} from "./fulfillments";
import {Customer} from "./customer";

export const FINANCIAL_STATUS = ['Unpaid', 'Paid', 'Partial paid', 'Refunded', 'Partial refunded', 'Pending', 'Voided', 'Authorized'];
export const FULFILLMENT_STATUS = ['Unfulfilled', 'Partial fulfilled', 'Fulfilled'];

export class Order {
  id: number = -1;
  email: string = '';
  closed_at: string = null;
  cancelled_at: string = null;
  cancel_reason: string = null;
  created_at: string = '';
  updated_at: string = '';
  number: number = 0;
  note: string = '';
  token: string = '';
  gateway: string = '';
  test: boolean = false;
  total_price: string = '';
  subtotal_price: number = 0;
  total_weight: number = 0;
  total_tax: number = 0;
  taxes_included: boolean = false;
  currency: string = '';
  financial_status: string = '';
  confirmed: boolean = false;
  total_discounts: number = 0;
  total_line_items_price: number = 0;
  cart_token: string = '';
  buyer_accepts_marketing: boolean = false;
  name: string = '';
  referring_site: string = '';
  landing_site: string = '';
  total_price_usd: number = 0;
  checkout_token: string = '';
  reference: string = '';
  user_id: number = 0;
  location_id: string = '';
  source_identifier: string = '';
  source_url: string = '';
  processed_at: string = '';
  device_id: number = 0;
  phone: number = 0;
  customer_locale: string = '';
  app_id: number = 0;
  browser_ip: string = '';
  landing_site_ref: string = '';
  order_number: number = 0;
  discount_codes: any = [];
  note_attributes: any = [];
  payment_gateway_names: any = [];
  processing_method: string = '';
  checkout_id: number = 0;
  source_name: string = '';
  fulfillment_status: string = '';
  tax_lines: any = [];
  tags: string = '';
  contact_email: string = '';
  order_status_url: string = '';
  line_items: any = [];
  shipping_lines: any = [];
  billing_address: any = [];
  shipping_address: any = [];
  fulfillments: any = [];
  refunds: any = [];
  customer: any = [];

  constructor() {
    this.line_items.push(new LinesItem());
    this.shipping_address = this.billing_address = new BillingAddress();
    this.fulfillments.push(new Fulfillments());
    this.customer = new Customer();
  }
}
