import { Component, Input } from '@angular/core';
import { AlertEntity } from '../../models/alert.entity';
import {MatDivider} from '@angular/material/divider';
import {MatCard, MatCardTitle} from '@angular/material/card';
import {NgForOf, NgIf} from '@angular/common';
import {AlertItemComponent} from '../alert-item/alert-item.component';

@Component({
  selector: 'app-alert-list',
  templateUrl: './alert-list.component.html',
  imports: [
    MatDivider,
    MatCardTitle,
    MatCard,
    NgForOf,
    NgIf,
    AlertItemComponent
  ],
  styleUrls: ['./alert-list.component.css']
})
export class AlertListComponent {
  /**
   * List of backend alerts of type PRODUCTLOWSTOCK
   */
  @Input() stockAlerts: AlertEntity[] = [];
  /**
   * List of backend alerts of type EXPIRATION_WARNING
   */
  @Input() expirationAlerts: AlertEntity[] = [];
  /**
   * Loading state for backend alerts
   */
  @Input() backendLoading: boolean = false;
  /**
   * Error message for backend alerts
   */
  @Input() backendErrorMsg: string = '';
  /**
   * Function to get the color for a given severity
   */
  @Input() getSeverityColor: (severity: string) => string = () => '#757575';
  /**
   * Function to get the icon for a given severity
   */
  @Input() getSeverityIcon: (severity: string) => string = () => 'ℹ️';
  /**
   * Function to get the minimum stock for a productId
   */
  @Input() getMinimumStock: (productId: string) => number | null = () => null;

  showAllRestocks = false;
  showAllExpirations = false;

  /**
   * Returns the stock alerts to display (all or first 3)
   */
  get displayedStockAlerts(): AlertEntity[] {
    return this.showAllRestocks ? this.stockAlerts : this.stockAlerts.slice(0, 3);
  }

  /**
   * Returns the expiration alerts to display (all or first 3)
   */
  get displayedExpirationAlerts(): AlertEntity[] {
    return this.showAllExpirations ? this.expirationAlerts : this.expirationAlerts.slice(0, 3);
  }

  toggleRestocks() {
    this.showAllRestocks = !this.showAllRestocks;
  }

  toggleExpirations() {
    this.showAllExpirations = !this.showAllExpirations;
  }
}