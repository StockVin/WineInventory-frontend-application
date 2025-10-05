import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InventoryService } from '../../services/inventory.service';
import { InventoryItemProps } from '../../models/inventory.entity'; // Asegúrate de que esta ruta sea correcta
import { MatIconModule } from '@angular/material/icon';
import { Observable, Subscription } from 'rxjs';

// Interfaz para los datos que recibe el modal
export interface ProductDetailData {
  productId: string;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  
  product$!: Observable<InventoryItemProps>;
  // Variable para simular una imagen, ya que no tenemos un campo de imagen real en la entidad.
  imagePlaceholderUrl: string = 'assets/images/vino-blanco.png'; // Sustituir por la URL real

  constructor(
    public dialogRef: MatDialogRef<ProductDetailComponent>,
    private inventoryService: InventoryService,
    @Inject(MAT_DIALOG_DATA) public data: ProductDetailData
  ) {}

  ngOnInit(): void {
    if (this.data.productId) {
      // Usamos el ID para cargar los detalles del producto
      this.product$ = this.inventoryService.getById(this.data.productId); 
    }
  }

  // Cierra el modal
  closeModal(): void {
    this.dialogRef.close();
  }

  // Implementación vacía para OnDestroy (buena práctica)
  ngOnDestroy(): void {}
}