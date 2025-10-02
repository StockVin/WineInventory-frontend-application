import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order.entity';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private apiUrl = 'https://api.example.com/orders';  // Cambiar a tu URL real

  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  createOrder(order: {
    proveedor: string | undefined;
    productos: { nombre: string; cantidad: number }[]
  }): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order);
  }
}
