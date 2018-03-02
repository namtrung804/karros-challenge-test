export const COLLECTION_COLUMN = [
  {
    title: 'Product title',
    value: 'title'
  },
  {
    title: 'Product type',
    value: 'type'
  },
  {
    title: 'Product vendor',
    value: 'vendor'
  },
  {
    title: 'Product price',
    value: 'variant_price'
  },
  {
    title: 'Product tag',
    value: 'tag'
  },
  {
    title: 'Compare at price',
    value: 'variant_compare_at_price'
  },
  {
    title: 'Weight',
    value: 'variant_weight'
  },
  {
    title: 'Inventory stock',
    value: 'variant_inventory'
  },
  {
    title: "Variant's title",
    value: 'variant_title'
  },
];

export const COLLECTION_RELATION = [
  {
    title: 'is equal to',
    value: 'equals'
  },
  {
    title: 'is not equal to',
    value: 'not_equals'
  },
  {
    title: 'is greater than',
    value: 'greater_than'
  },
  {
    title: 'is less than',
    value: 'less_than'
  },
  {
    title: 'starts with',
    value: 'starts_with'
  },
  {
    title: 'ends with',
    value: 'ends_with'
  },
  {
    title: 'contains',
    value: 'contains'
  },
  {
    title: 'does not contain',
    value: 'not_contains'
  },
];

export class CollectionRules {
  column: string = COLLECTION_COLUMN[0].value;
  condition: string = '';
  relation: string = COLLECTION_RELATION[0].value;
}
