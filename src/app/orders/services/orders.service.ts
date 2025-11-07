import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';

import { NewOrderInput, Order, OrderItem, OrderStatus } from '../models/order.entity';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly http = inject(HttpClient);
  private readonly ordersSubject = new BehaviorSubject<Order[]>([]);
  private readonly ordersEndpoint = `${environment.baseServerUrl}/orders`;
  private readonly pendingOrderLoads = new Set<string>();

  constructor() {
    this.refreshOrders().subscribe();
  }

  getOrders(): Observable<Order[]> {
    return this.ordersSubject.asObservable();
  }

  getOrderById(orderId: number): Observable<Order | undefined> {
    return this.ordersSubject.pipe(
      tap(orders => this.ensureOrderLoaded(orderId, orders)),
      map(orders => orders.find(order => order.id === orderId)),
      distinctUntilChanged()
    );
  }

  refreshOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.ordersEndpoint).pipe(
      map(orders => orders.map(order => this.normalizeOrder(order))),
      tap({
        next: orders => this.ordersSubject.next(orders),
        error: error => console.error('No se pudieron cargar las órdenes.', error)
      })
    );
  }

  createOrder(input: NewOrderInput): Observable<Order> {
    return this.http.post<Order>(this.ordersEndpoint, input).pipe(
      map(order => this.normalizeOrder(order)),
      tap({
        next: order => this.upsertOrderInCache(order),
        error: error => console.error('No se pudo crear la orden.', error)
      })
    );
  }

  updateOrderStatus(orderId: number, status: OrderStatus): Observable<Order | undefined> {
    const orders = this.ordersSubject.getValue();
    const index = orders.findIndex(order => order.id === orderId);
    if (index === -1) {
      return this.getOrderById(orderId);
    }

    const updatedOrder: Order = { ...orders[index], status };

    return this.http.patch<Order>(`${this.ordersEndpoint}/${orderId}/status`, { status }).pipe(
      tap({
        next: response => {
          const nextOrders = [...orders];
          nextOrders.splice(index, 1, { ...updatedOrder, ...response });
          this.ordersSubject.next(nextOrders);
        },
        error: error => console.error('No se pudo actualizar el estado de la orden.', error)
      }),
      map(response => ({ ...updatedOrder, ...response }))
    );
  }

  deleteOrder(orderId: number): Observable<void> {
    return this.http.delete<void>(`${this.ordersEndpoint}/${orderId}`).pipe(
      tap({
        next: () => {
          const orders = this.ordersSubject.getValue();
          const nextOrders = orders.filter(order => order.id !== orderId);
          this.ordersSubject.next(nextOrders);
        },
        error: error => console.error('No se pudo eliminar la orden.', error)
      })
    );
  }

  private ensureOrderLoaded(orderId: number, orders: Order[]): void {
    const existingOrder = orders.find(order => order.id === orderId);
    if (this.isOrderComplete(existingOrder)) {
      return;
    }

    this.requestOrderFromServer(orderId);
  }

  private requestOrderFromServer(orderId: number): void {
    const key = String(orderId);
    if (this.pendingOrderLoads.has(key)) {
      return;
    }

    this.pendingOrderLoads.add(key);

    this.http.get<Order>(`${this.ordersEndpoint}/${orderId}`).subscribe({
      next: order => {
        this.pendingOrderLoads.delete(key);
        if (order) {
          this.upsertOrderInCache(this.normalizeOrder(order));
        }
      },
      error: error => {
        console.error('No se pudo cargar la orden solicitada.', error);
        this.pendingOrderLoads.delete(key);
      }
    });
  }

  private upsertOrderInCache(order: Order): void {
    const orders = this.ordersSubject.getValue();
    const index = orders.findIndex(existing => existing.id === order.id);

    if (index === -1) {
      this.ordersSubject.next([...orders, order]);
      return;
    }

    const nextOrders = [...orders];
    nextOrders.splice(index, 1, { ...orders[index], ...order });
    this.ordersSubject.next(nextOrders);
  }

  private normalizeOrder(order: Order): Order {
    const status = this.normalizeStatus(order.status);
    return {
      ...order,
      status
    };
  }

  private normalizeStatus(status: string): OrderStatus {
    switch ((status ?? '').toLowerCase()) {
      case 'pending':
        return 'pending';
      case 'processing':
      case 'in_progress':
        return 'processing';
      case 'completed':
      case 'fulfilled':
        return 'completed';
      case 'cancelled':
      case 'canceled':
        return 'cancelled';
      default:
        console.warn(`Estado de orden no reconocido: ${status}. Se usará 'pending' por defecto.`);
        return 'pending';
    }
  }

  private isOrderComplete(order: Order | undefined): order is Order {
    return !!order && Array.isArray(order.items) && order.items.length > 0;
  }
}
