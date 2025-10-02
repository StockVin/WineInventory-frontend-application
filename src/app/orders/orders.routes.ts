import { Routes } from '@angular/router';
import { OrderListComponent } from './components/order-list/order-list.component';
import { NewOrderComponent } from './pages/new-order/new-order.component';
import { OrderDetailComponent } from './pages/order-detail/order-detail.component';

export const ordersRoutes: Routes = [
  { path: 'orders', component: OrderListComponent },
  { path: 'new-order', component: NewOrderComponent },
  { path: 'order-detail/:id', component: OrderDetailComponent }, // Para ver detalles de una orden específica
  { path: '', redirectTo: '/orders', pathMatch: 'full' } // Redirige al listado de órdenes por defecto
];

