import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard} from "../../guards/auth.guard";
import {CollectionListComponent} from "./collection-list/collection-list.component";
import {CollectionDetailComponent} from "./collection-detail/collection-detail.component";
import {CollectionComponent} from "./collection.component";
import {CollectionBulkComponent} from "./collection-bulk/collection-bulk.component";

const routes: Routes = [{
  path: '',
  component: CollectionComponent,
  canActivate: [AuthGuard],
  children: [
    {
      path: '',
      component: CollectionListComponent
    },
    {
      path: 'bulk',
      component: CollectionBulkComponent
    },
    {
      path: 'new',
      component: CollectionDetailComponent
    },
    {
      path: ':id',
      component: CollectionDetailComponent
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollectionRoutingModule { }
