import { Component, Input, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { InventoryItemProps } from '../../models/inventory.entity'; 

@Component({
  selector: 'app-inventory-view',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatIconModule],
  templateUrl: './inventory-view.component.html',
  styleUrls: ['./inventory-view.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush 
})
export class InventoryViewComponent {
  
  @Input() inventory$!: Observable<InventoryItemProps[]>; 
  
  displayedColumns: string[] = [
    'select', 
    'name', 
    'type', 
    'expirationDate', 
    'currentStock', 
    'minStockLevel', 
    'price', 
    'actions'
  ];

  @Output() productDetail = new EventEmitter<string>();

  @Output() registerOut = new EventEmitter<string>(); 

  onViewDetail(productId: string): void {
    this.productDetail.emit(productId);
  }
}