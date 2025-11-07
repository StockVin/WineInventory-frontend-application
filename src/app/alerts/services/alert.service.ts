import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
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
    return this.http
      .get<AlertEntity[]>(`${this.apiUrl}/accounts/${accountId}/alerts`)
      .pipe(map(alerts => alerts ?? []));
  }

  /**
   * Get a specific alert by ID
   * @param alertId The alert ID
   * @returns Observable of the specific alert
   */
  getAlertById(alertId: string): Observable<AlertEntity> {
    return this.http.get<AlertEntity>(`${this.apiUrl}/alerts/${alertId}`);
  }
}
