import { TranslateModule } from '@ngx-translate/core';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InventoryService } from '../../services/inventory.service';
import { InventoryItemProps } from '../../models/inventory.entity'; 
import { MatIconModule } from '@angular/material/icon';
import { Observable, Subscription } from 'rxjs';

export interface ProductDetailData {
  productId: string;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslateModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  
  product$!: Observable<InventoryItemProps>;
  imagePlaceholderUrl: string = 'assets/images/vino-blanco.png'; 

  constructor(
    public dialogRef: MatDialogRef<ProductDetailComponent>,
    private inventoryService: InventoryService,
    @Inject(MAT_DIALOG_DATA) public data: ProductDetailData
  ) {}

  ngOnInit(): void {
    if (this.data.productId) {
      this.product$ = this.inventoryService.getById(this.data.productId); 
    }
  }
  closeModal(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {}
}