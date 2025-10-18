import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable, combineLatest} from 'rxjs';
import { AlertEntity } from '../models/alert.entity';
import { environment } from '../../../environments/environment';
import { InventoryService } from '../../inventory/services/inventory.service';
import { InventoryItemProps } from '../../inventory/models/inventory.entity';

/**
 * Service responsible for managing alerts and notifications
 * Handles urgent restock alerts and product expiration notifications
 */
@Injectable({ providedIn: 'root' })
export class AlertService {
  private readonly apiUrl = environment.baseServerUrl;

  constructor(
    private http: HttpClient,
    private inventoryService: InventoryService
  ) {}

  /**
   * Get all alerts from the backend for a specific account
   * @param accountId The account ID to get alerts for
   * @returns Observable of backend alerts
   */
  getAlerts(accountId: string): Observable<AlertEntity[]> {
    return this.http.get<AlertEntity[]>(`${this.apiUrl}/accounts/${accountId}/alerts`);
  }

  /**
   * Get a specific alert by ID
   * @param alertId The alert ID
   * @returns Observable of the specific alert
   */
  getAlertById(alertId: string): Observable<AlertEntity> {
    return this.http.get<AlertEntity>(`${this.apiUrl}/alerts/${alertId}`);
  }

  /**
   * Get stock alerts from backend alerts
   * @param accountId The account ID
   * @returns Observable of stock alerts
   */
  getStockAlerts(accountId: string): Observable<AlertEntity[]> {
    return this.getAlerts(accountId).pipe(
      map(alerts => alerts.filter(alert => alert.type === 'PRODUCTLOWSTOCK'))
    );
  }

  /**
   * Get expiration alerts from backend alerts
   * @param accountId The account ID
   * @returns Observable of expiration alerts
   */
  getExpirationAlerts(accountId: string): Observable<AlertEntity[]> {
    return this.getAlerts(accountId).pipe(
      map(alerts => alerts.filter(alert => alert.type === 'EXPIRATION_WARNING'))
    );
  }

  /**
   * Generate alerts based on inventory data
   * @returns Observable of alerts generated from inventory data
   */
  generateInventoryAlerts(): Observable<{stockAlerts: AlertEntity[], expirationAlerts: AlertEntity[]}> {
    return this.inventoryService.getAllProps().pipe(
      map(inventoryItems => {
        const stockAlerts = this.generateStockAlerts(inventoryItems);
        const expirationAlerts = this.generateExpirationAlerts(inventoryItems);
        return { stockAlerts, expirationAlerts };
      })
    );
  }

  /**
   * Generate stock alerts for products with low stock
   * @param inventoryItems The inventory items to check
   * @returns Array of stock alerts
   */
  private generateStockAlerts(inventoryItems: InventoryItemProps[]): AlertEntity[] {
    const alerts: AlertEntity[] = [];

    inventoryItems.forEach(item => {
      if (item.currentStock <= item.minStockLevel && item.currentStock > 0) {
        const severity = this.calculateStockSeverity(item.currentStock, item.minStockLevel);

        alerts.push({
          id: `stock-${item.id}`,
          title: `Stock bajo: ${item.name}`,
          message: `El producto ${item.name} tiene ${item.currentStock} unidades disponibles, por debajo del mínimo requerido de ${item.minStockLevel}.`,
          severity: severity,
          type: 'PRODUCTLOWSTOCK',
          productId: item.id,
          warehouseId: '1', 
          state: 'ACTIVE'
        });
      } else if (item.currentStock === 0) {
        alerts.push({
          id: `stock-${item.id}`,
          title: `Sin stock: ${item.name}`,
          message: `El producto ${item.name} está agotado. Se requieren ${item.minStockLevel} unidades mínimas.`,
          severity: 'WARNING',
          type: 'PRODUCTLOWSTOCK',
          productId: item.id,
          warehouseId: '1', 
          state: 'ACTIVE'
        });
      }
    });

    return alerts;
  }

  /**
   * Generate expiration alerts for products expiring soon
   * @param inventoryItems The inventory items to check
   * @returns Array of expiration alerts
   */
  private generateExpirationAlerts(inventoryItems: InventoryItemProps[]): AlertEntity[] {
    const alerts: AlertEntity[] = [];
    const today = new Date();
    const sevenDaysFromNow = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000));

    // Filter items that expire within 7 days and sort by expiration date
    const expiringSoon = inventoryItems
      .filter(item => item.expirationDate && new Date(item.expirationDate) <= sevenDaysFromNow)
      .sort((a, b) => {
        if (!a.expirationDate || !b.expirationDate) return 0;
        return new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime();
      });

    expiringSoon.forEach(item => {
      if (item.expirationDate) {
        const expirationDate = new Date(item.expirationDate);
        const daysUntilExpiration = Math.ceil((expirationDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));

        let severity: 'WARNING' | 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
        if (daysUntilExpiration <= 1) {
          severity = 'WARNING';
        } else if (daysUntilExpiration <= 3) {
          severity = 'HIGH';
        } else if (daysUntilExpiration <= 7) {
          severity = 'MEDIUM';
        }

        alerts.push({
          id: `expiration-${item.id}`,
          title: `Próximo a vencer: ${item.name}`,
          message: `El producto ${item.name} expira en ${daysUntilExpiration} días (${expirationDate.toLocaleDateString()}).`,
          severity: severity,
          type: 'EXPIRATION_WARNING',
          productId: item.id,
          warehouseId: '1', 
          state: 'ACTIVE'
        });
      }
    });

    return alerts;
  }

  /**
   * Calculate severity for stock alerts
   * @param currentStock Current stock level
   * @param minStockLevel Minimum stock level
   * @returns Severity level
   */
  private calculateStockSeverity(currentStock: number, minStockLevel: number): 'WARNING' | 'HIGH' | 'MEDIUM' | 'LOW' {
    const stockRatio = currentStock / minStockLevel;

    if (stockRatio <= 0.25) {
      return 'WARNING';
    } else if (stockRatio <= 0.5) {
      return 'HIGH';
    } else if (stockRatio <= 0.75) {
      return 'MEDIUM';
    } else {
      return 'LOW';
    }
  }

  private getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products`).pipe(
      map(products => {
        console.log('Productos obtenidos:', products);
        return products;
      })
    );
  }
}
