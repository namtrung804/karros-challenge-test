import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ProductComponent} from "./product.component";
import {ProductListComponent} from "./product-list/product-list.component";
import {ProductDetailComponent} from "./product-detail/product-detail.component";
import {AuthGuard} from "../../guards/auth.guard";
import {ProductVariantsBulkComponent} from "./product-variants-bulk/product-variants-bulk.component";
import {ProductBulkComponent} from "./product-bulk/product-bulk.component";
import {ProductAddVariantComponent} from "./product-add-variant/product-add-variant.component";

const routes: Routes = [
  {
    path: '',
    component: ProductComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: ProductListComponent
      },
      {
        path: 'bulk',
        component: ProductBulkComponent
      },
      {
        path: 'new',
        component: ProductDetailComponent
      },
      {
        path: ':id',
        component: ProductDetailComponent
      },
      {
        path: ':productId',
        children: [
          {
            path: 'variants-bulk',
            component: ProductVariantsBulkComponent
          },
          {
            path: 'variants/new',
            component: ProductAddVariantComponent
          },
          {
            path: 'variants/:id',
            component: ProductAddVariantComponent
          },
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule {
}
