export const OPTIONS = ['Size', 'Color', 'Material'];

export class ProductOption {
  id: number = -1;
  product_id: number = -1;
  name: string = 'Size';
  position: number = 1;
  values: any = []
}
