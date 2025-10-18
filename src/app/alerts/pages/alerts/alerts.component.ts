import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { AlertEntity } from '../../models/alert.entity';
import { AlertListComponent } from '../../components/alert-list/alert-list.component';
import { FormsModule } from '@angular/forms';
import { SideNavbarComponent } from '../../../shared/presentation/components/side-navbar/side-navbar.component';
import { LanguageSwitcher } from '../../../shared/presentation/components/language-switcher/language-switcher.component';
import { InventoryService } from '../../../inventory/services/inventory.service';
import { InventoryItemProps } from '../../../inventory/models/inventory.entity';

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
  inventoryItems: InventoryItemProps[] = [];

  constructor(
    private alertService: AlertService,
    private inventoryService: InventoryService
  ) {}

  ngOnInit(): void {
    this.loadInventoryAlerts();
  }

  loadInventoryAlerts() {
    this.backendLoading = true;
    this.backendErrorMsg = '';

    this.alertService.generateInventoryAlerts().subscribe({
      next: (alertData) => {
        this.stockAlerts = alertData.stockAlerts;
        this.expirationAlerts = alertData.expirationAlerts;
        this.backendLoading = false;
      },
      error: () => {
        this.backendErrorMsg = 'Error loading inventory alerts.';
        this.backendLoading = false;
      }
    });

    this.inventoryService.getAllProps().subscribe({
      next: (items: InventoryItemProps[]) => {
        this.inventoryItems = items;
      },
      error: (error: any) => {
        console.error('Error loading inventory items:', error);
      }
    });
  }

  /**
   * Returns the minimum stock for a given productId
   */
  getMinimumStock = (productId: string): number | null => {
    const item = this.inventoryItems.find(item => item.id === productId);
    return item ? item.minStockLevel : null;
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
      case 'WARNING': return '⚠';
      case 'HIGH': return '🔴';
      case 'MEDIUM': return '🟡';
      case 'LOW': return '🟢';
      default: return 'ℹ';
    }
  }
}