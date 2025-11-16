import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideNavbarComponent } from '../../components/side-navbar/side-navbar.component';
import { LanguageSwitcher } from "../../components/language-switcher/language-switcher.component";
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { InventoryService } from '../../../../inventory/services/inventory.service';
import { InventoryItemProps } from '../../../../inventory/models/inventory.entity';
import { OrdersService } from '../../../../orders/services/orders.service';
import { Order, OrderStatus } from '../../../../orders/models/order.entity';

interface RecentOrder {
  orderNumber: string;
  customerName: string;
  status: OrderStatus;
  orderedAt: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    SideNavbarComponent,
    LanguageSwitcher,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  totalProductos: number = 0;
  productosStockBajo: number = 0;
  productosPorVencer: number = 0;
  ordenesPendientes: number = 0;

  productosRecientes: InventoryItemProps[] = [];
  ordenesRecientes: RecentOrder[] = [];

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly inventoryService: InventoryService,
    private readonly ordersService: OrdersService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboardData(): void {
    this.loadInventoryData();
    this.loadOrdersData();
  }

  private loadInventoryData(): void {
    this.inventoryService.getAllProps()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (items: InventoryItemProps[]) => this.processInventoryData(items),
        error: (error: unknown) => console.error('Error loading inventory data:', error)
      });
  }

  private loadOrdersData(): void {
    this.ordersService.getOrders()
      .pipe(takeUntil(this.destroy$))
      .subscribe((orders: Order[] | undefined) => this.processOrdersData(orders ?? []));

    this.ordersService.refreshOrders()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: (error: unknown) => console.error('Error loading orders data:', error)
      });
  }

  private processInventoryData(inventory: InventoryItemProps[]): void {
    this.totalProductos = inventory.length;
    this.productosRecientes = inventory.slice(0, 5);

    this.productosStockBajo = inventory.filter(item =>
      item.currentStock <= item.minStockLevel && item.currentStock > 0
    ).length;

    const today = new Date();
    const sevenDaysFromNow = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000));

    this.productosPorVencer = inventory.filter(item => {
      if (!item.expirationDate) return false;
      const expirationDate = item.expirationDate instanceof Date
        ? item.expirationDate
        : new Date(item.expirationDate);
      return expirationDate <= sevenDaysFromNow && expirationDate >= today;
    }).length;
  }

  private processOrdersData(orders: Order[]): void {
    this.ordenesPendientes = orders.filter(order =>
      order.status === 'pending' || order.status === 'processing'
    ).length;

    const sorted = [...orders]
      .sort((a, b) => new Date(b.orderedAt).getTime() - new Date(a.orderedAt).getTime())
      .slice(0, 5);

    this.ordenesRecientes = sorted.map(order => ({
      orderNumber: order.orderNumber,
      customerName: order.delivery?.recipientName ?? order.customerEmail ?? '—',
      status: order.status,
      orderedAt: order.orderedAt
    }));
  }

  /**
   * Gets the stock status class
   * @param currentStock - Current stock
   * @param minStockLevel - Minimum stock level
   * @returns Stock status class
   */
  getStockStatusClass(currentStock: number, minStockLevel: number): string {
    if (currentStock === 0) return 'status-empty';
    if (currentStock <= minStockLevel) return 'status-low';
    return 'status-good';
  }

  /**
   * Gets the stock status text
   * @param currentStock - Current stock
   * @param minStockLevel - Minimum stock level
   * @returns Stock status text
   */
  getStockStatusText(currentStock: number, minStockLevel: number): string {
    if (currentStock === 0) return 'Agotado';
    if (currentStock <= minStockLevel) return 'Stock Bajo';
    return 'Disponible';
  }

  /**
   * Gets the order status text
   * @param status - Order status
   * @returns Order status text
   */
  getStatusText(status: string): string {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'processing': return 'Procesando';
      case 'completed': return 'Completada';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  }

}
