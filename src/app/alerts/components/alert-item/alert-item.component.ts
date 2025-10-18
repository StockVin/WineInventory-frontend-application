import { Component, Input } from '@angular/core';
import { AlertEntity } from '../../models/alert.entity';
import {MatDivider} from '@angular/material/divider';
import {NgIf} from '@angular/common';
import { InventoryItemProps } from '../../../inventory/models/inventory.entity';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-alert-item',
  templateUrl: './alert-item.component.html',
  imports: [
    MatDivider,
    NgIf,
    TranslateModule
  ],
})
export class AlertItemComponent {
  @Input() alert!: AlertEntity;
  @Input() getMinimumStock: (productId: string) => number | null = () => null;
  @Input() getSeverityColor: (severity: string) => string = () => '#757575';
  @Input() getSeverityIcon: (severity: string) => string = () => 'ℹ️';
  @Input() inventoryItems: InventoryItemProps[] = [];
  @Input() isLast: boolean = false;
  expiration: any;

  /**
   * Returns the current stock for a given productId
   */
  getCurrentStock = (productId: string): number | null => {
    const item = this.inventoryItems.find(item => item.id === productId);
    return item ? item.currentStock : null;
  };

  /**
   * Returns the expiration date for a given productId
   */
  getExpirationDate = (productId: string): string | null => {
    const item = this.inventoryItems.find(item => item.id === productId);
    if (item && item.expirationDate) {
      return new Date(item.expirationDate).toLocaleDateString();
    }
    return null;
  };

  /**
   * Returns the days until expiration for a given productId
   */
  getDaysUntilExpiration = (productId: string): number | null => {
    const item = this.inventoryItems.find(item => item.id === productId);
    if (item && item.expirationDate) {
      const today = new Date();
      const expirationDate = new Date(item.expirationDate);
      const diffTime = expirationDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return null;
  };
}