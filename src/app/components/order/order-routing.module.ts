import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {OrderComponent} from './order.component';
import {AuthGuard} from '../../guards/auth.guard';
import {OrderListComponent} from './order-list/order-list.component';
import {OrderDetailComponent} from './order-detail/order-detail.component';
import {OrderFulfillAndShipComponent} from './order-fulfill-and-ship/order-fulfill-and-ship.component';

const routes: Routes = [
  {
    path: '',
    component: OrderComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: OrderListComponent
      },
      {
        path: 'new',
        component: OrderDetailComponent
      },
      {
        path: ':id',
        component: OrderDetailComponent,
      },
      {
        path: ':orderId',
        children: [
          {
            path: 'fulfill-and-ship',
            component: OrderFulfillAndShipComponent
          }
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule {
}
