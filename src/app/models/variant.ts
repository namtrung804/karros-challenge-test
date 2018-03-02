export class Variant {
  id: number = -1;
  product_id: number = 0;
  barcode: string = '';
  compare_at_price: number = 0;
  grams: number = 0;
  weight_unit: string = 'kg';
  metafield: string = '';
  position: number = 0;
  price: number = 0;
  sku: string = '';
  created_at: string = '';
  updated_at: string = '';
  inventory_policy: number = 0;
  inventory_quantity: number = 0;
  inventory_management: string = '';
  image_url: string = null;
  image_id: number = null;
  metafields_global_harmonized_system_code: string = '';
  option1: string = 'Default Title';
  option2: string = '';
  option3: string = '';
  requires_shipping: boolean = false;
  taxable: boolean = false;
  title: string = 'Default Title';
  fulfillment_service: string = '';
}
