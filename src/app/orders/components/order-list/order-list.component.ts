import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';
import { OrdersService } from '../../services/orders.service';
import { Order, OrderStatus } from '../../models/order.entity';

interface StatusFilter {
  value: OrderStatus | 'all';
  labelKey: string;
}

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe, CurrencyPipe, TranslateModule],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent {
  private readonly ordersService = inject(OrdersService);
  private readonly router = inject(Router);

  private readonly statusFilterSubject = new BehaviorSubject<OrderStatus | 'all'>('all');

  readonly statusFilter$ = this.statusFilterSubject.asObservable();
  readonly orders$ = this.ordersService.getOrders();

  readonly filteredOrders$ = combineLatest([this.orders$, this.statusFilter$]).pipe(
    map(([orders, filter]) => {
      if (filter === 'all') {
        return orders;
      }

      return orders.filter(order => order.status === filter);
    })
  );

  readonly statusFilters: StatusFilter[] = [
    { value: 'all', labelKey: 'orders.status.all' },
    { value: 'pending', labelKey: 'orders.status.pending' },
    { value: 'processing', labelKey: 'orders.status.processing' },
    { value: 'completed', labelKey: 'orders.status.completed' },
    { value: 'cancelled', labelKey: 'orders.status.cancelled' }
  ];

  readonly statusBadges: Record<OrderStatus, string> = {
    pending: 'badge--pending',
    processing: 'badge--processing',
    completed: 'badge--completed',
    cancelled: 'badge--cancelled'
  };

  readonly statusLabelKeys: Record<OrderStatus, string> = {
    pending: 'orders.status.pending',
    processing: 'orders.status.processing',
    completed: 'orders.status.completed',
    cancelled: 'orders.status.cancelled'
  };

  setFilter(filter: StatusFilter['value']): void {
    this.statusFilterSubject.next(filter);
  }

  trackByOrderId(_: number, order: Order): number {
    return order.id;
  }

  goToOrderDetail(order: Order): void {
    this.router.navigate(['/orders', order.id, 'details']);
  }
}
