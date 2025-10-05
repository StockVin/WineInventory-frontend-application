import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideNavbarComponent } from '../../components/side-navbar/side-navbar.component';
import { LanguageSwitcher } from "../../components/language-switcher/language-switcher.component";
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

interface InventoryItem {
  id: string;
  name: string;
  currentStock: number;
  minStockLevel: number;
  expirationDate?: string;
}

interface Order {
  id: string;
  code: string;
  customerName: string;
  status: string;
  createdAt: string;
}

interface User {
  id: number;
  username: string;
  role: string;
  isActive: boolean;
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
export class DashboardComponent implements OnInit {
  totalProductos: number = 0;
  productosStockBajo: number = 0;
  productosPorVencer: number = 0;
  ordenesPendientes: number = 0;

  productosRecientes: InventoryItem[] = [];
  ordenesRecientes: Order[] = [];

  totalUsuarios: number = 0;
  usuariosActivos: number = 0;
  administradores: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.http.get<any>('http://localhost:3000/inventory').subscribe({
      next: (inventoryData) => {
        this.processInventoryData(inventoryData);
      },
      error: (error) => {
        console.error('Error loading inventory data:', error);
      }
    });

    this.http.get<any[]>('http://localhost:3000/orders').subscribe({
      next: (ordersData) => {
        this.processOrdersData(ordersData);
      },
      error: (error) => {
        console.error('Error loading orders data:', error);
      }
    });

    this.http.get<any[]>('http://localhost:3000/users').subscribe({
      next: (usersData) => {
        this.processUsersData(usersData);
      },
      error: (error) => {
        console.error('Error loading users data:', error);
      }
    });
  }

  /**
   * Processes inventory data
    * @param inventory - Inventory data
   */
  private processInventoryData(inventory: InventoryItem[]): void {
    this.totalProductos = inventory.length;
    this.productosRecientes = inventory.slice(0, 5);

    this.productosStockBajo = inventory.filter(item =>
      item.currentStock <= item.minStockLevel && item.currentStock > 0
    ).length;
    const today = new Date();
    const sevenDaysFromNow = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000));

    this.productosPorVencer = inventory.filter(item => {
      if (!item.expirationDate) return false;
      const expirationDate = new Date(item.expirationDate);
      return expirationDate <= sevenDaysFromNow && expirationDate >= today;
    }).length;
  }

  /**
   * Processes order data
   * @param orders - Order data
   */
  private processOrdersData(orders: Order[]): void {
    this.ordenesPendientes = orders.filter(order =>
      order.status === 'pending' || order.status === 'processing'
    ).length;

    this.ordenesRecientes = orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }

  /**
   * Processes user data
   * @param users - User data
   */
  private processUsersData(users: User[]): void {
    this.totalUsuarios = users.length;
    this.usuariosActivos = users.filter(user => user.isActive).length;
    this.administradores = users.filter(user => user.role === 'ADMIN').length;
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
