import { Component } from '@angular/core';
import {OrderListComponent} from '../../components/order-list/order-list.component';
import {NewOrderComponent} from '../new-order/new-order.component';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  imports: [
    OrderListComponent,
    NewOrderComponent,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {}
