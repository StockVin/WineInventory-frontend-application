import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { AlertEntity } from '../../models/alert.entity';
import { AlertListComponent } from '../../components/alert-list/alert-list.component';
import { ProductService } from '../../../inventory/services/product.service';
import { Product } from '../../../inventory-management/model/product.entity';
import { FormsModule } from '@angular/forms';
import { ToolBarComponent } from '../../../public/services/components/tool-bar/tool-bar.component';
import { SideNavbarComponent } from '../../../public/services//side-navbar.component';

@Component({
  selector: 'app-alerts-and-notifications',
  templateUrl: './alerts.component.html',
  imports: [
    AlertListComponent,
    FormsModule,
    ToolBarComponent,
    SideNavbarComponent
  ],
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {
  stockAlerts: BackendAlert[] = [];
  expirationAlerts: BackendAlert[] = [];
  backendLoading = false;
  backendErrorMsg = '';
  products: Product[] = [];

  constructor(
    private alertService: AlertService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadBackendAlerts();
  }

  loadProducts() {
    this.productService.getProductsByAccountId().subscribe({
      next: (products) => this.products = products,
      error: () => this.products = []
    });
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
    const product = this.products.find(p => p.id.toString() === productId);
    return product ? product.minimumStock : null;
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