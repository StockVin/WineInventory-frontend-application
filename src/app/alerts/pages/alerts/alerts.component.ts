import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { AlertEntity } from '../../models/alert.entity';
import { AlertListComponent } from '../../components/alert-list/alert-list.component';
import { FormsModule } from '@angular/forms';
import { SideNavbarComponent } from '../../../shared/presentation/components/side-navbar/side-navbar.component';
import { LanguageSwitcher } from '../../../shared/presentation/components/language-switcher/language-switcher.component';

@Component({
  selector: 'app-alerts-and-notifications',
  templateUrl: './alerts.component.html',
  imports: [
    AlertListComponent,
    FormsModule,
    SideNavbarComponent,
    LanguageSwitcher
],
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {
  stockAlerts: AlertEntity[] = [];
  expirationAlerts: AlertEntity[] = [];
  backendLoading = false;
  backendErrorMsg = '';

  constructor(
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadBackendAlerts();
  }

  loadBackendAlerts() {
    const accountId = localStorage.getItem('accountId');
    if (!accountId) {
      console.warn('No account ID found in localStorage');
      return;
    }
    this.backendLoading = true;
    this.backendErrorMsg = '';
    this.alertService.getAlerts(accountId).subscribe({
      next: (alerts) => {
        this.stockAlerts = alerts.filter(alert => alert.type === 'PRODUCTLOWSTOCK');
        this.expirationAlerts = alerts.filter(alert => alert.type === 'EXPIRATION_WARNING' && alert.state === 'ACTIVE');
        this.backendLoading = false;
      },
      error: () => {
        this.backendErrorMsg = 'Error loading backend alerts.';
        this.backendLoading = false;
      }
    });
  }

  /**
   * Returns the minimum stock for a given productId
   */
  getMinimumStock = (productId: string): number | null => {
    return null;
  };

  getSeverityColor(severity: string): string {
    switch (severity) {
      case 'WARNING': return '#f44336';
      case 'HIGH': return '#ff9800';
      case 'MEDIUM': return '#ffc107';
      case 'LOW': return '#4caf50';
      default: return '#757575';
    }
  }

  getSeverityIcon(severity: string): string {
    switch (severity) {
      case 'WARNING': return '⚠️';
      case 'HIGH': return '🔴';
      case 'MEDIUM': return '🟡';
      case 'LOW': return '🟢';
      default: return 'ℹ️';
    }
  }
}