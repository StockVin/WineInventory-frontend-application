import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import { AlertEntity } from '../models/alert.entity';
import { environment } from '../../../environments/environment';

/**
 * Service responsible for managing alerts and notifications
 * Handles urgent restock alerts and product expiration notifications
 */
@Injectable({ providedIn: 'root' })
export class AlertService {
  private readonly apiUrl = environment.baseServerUrl;

  constructor(private http: HttpClient) {}

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

  // Legacy methods for backward compatibility
  // These will be deprecated once the new backend integration is fully implemented
  private getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products`).pipe(
      map(products => {
        console.log('Productos obtenidos:', products);
        return products;
      })
    );
  }
}
