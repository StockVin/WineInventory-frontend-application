// inventory/pages/inventory/inventory.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; 
import { RegisterOutComponent } from '../../components/register-out/register-out.component';
import { SideNavbarComponent } from '../../../shared/presentation/components/side-navbar/side-navbar.component'; 
import { LanguageSwitcher } from '../../../shared/presentation/components/language-switcher/language-switcher.component';

import { 
    Observable, 
    BehaviorSubject, 
    switchMap, 
    debounceTime, 
    distinctUntilChanged, 
    map 
} from 'rxjs';
import { FormsModule } from '@angular/forms';

// Importación de componentes y servicios
import { InventoryViewComponent } from '../../components/inventory-view/inventory-view.component'; 
import { NewProductComponent } from '../../components/new-product/new-product.component'; 
import { ProductDetailComponent } from '../../components/product-detail/product-detail.component'; 
import { InventoryService } from '../../services/inventory.service'; 
import { InventoryItemProps } from '../../models/inventory.entity';


@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatButtonModule, 
    MatIconModule, 
    MatInputModule,
    MatDialogModule,
    InventoryViewComponent,
    SideNavbarComponent,
    LanguageSwitcher 
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent implements OnInit {
  
  // Sujeto para forzar la recarga de datos después de una acción (POST/PUT/SALIDA)
  private refreshTrigger = new BehaviorSubject<void>(undefined); 
  
  // Nuevo Sujeto: Emite cada vez que cambia el término de búsqueda
  private searchSubject = new BehaviorSubject<string>(''); 
  
  // Stream de datos que alimenta la tabla (ahora filtrado)
  inventory$!: Observable<InventoryItemProps[]>;
  
  // Variable para el campo de búsqueda (conectada a [(ngModel)] en el HTML)
  searchTerm: string = '';

  constructor(
    private inventoryService: InventoryService, 
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // 1. Stream base: Carga el inventario completo desde el servicio cada vez que se dispara refreshTrigger
    const allInventory$ = this.refreshTrigger.pipe(
        // NOTA: Usamos getAllProps() como está en tu servicio.
        switchMap(() => this.inventoryService.getAllProps()) 
    );

    // 2. Stream principal (inventory$): Combina el término de búsqueda con el inventario base
    this.inventory$ = this.searchSubject.pipe(
      // Espera 300ms de pausa en la escritura antes de reaccionar
      debounceTime(300), 
      // Solo continúa si el nuevo término es diferente al anterior
      distinctUntilChanged(), 
      // Cuando el término de búsqueda cambia, re-ejecuta el filtro sobre la lista completa
      switchMap(term => allInventory$.pipe(
        map(products => this.filterProducts(products, term))
      ))
    );
  }

  /**
   * Captura el cambio en el input (llamado desde (ngModelChange) en el HTML) y 
   * lo emite al searchSubject.
   */
  onSearchChange(): void {
    // Emitimos el término en minúsculas para una búsqueda insensible a mayúsculas/minúsculas
    this.searchSubject.next(this.searchTerm.toLowerCase());
  }

  /**
   * Lógica de filtrado de productos.
   */
  private filterProducts(products: InventoryItemProps[], term: string): InventoryItemProps[] {
    if (!term) {
      return products; // Si no hay término, devuelve la lista completa
    }
    
    return products.filter(product => 
      // Filtra por Nombre o Tipo.
      product.name.toLowerCase().includes(term) ||
      product.type.toLowerCase().includes(term)
    );
  }
  
  /**
   * Forzar la recarga de datos de la tabla (usado después de crear, editar, o registrar una salida).
   */
  refreshInventory(): void {
    // Dispara el BehaviorSubject, lo que reactiva el switchMap y recarga los datos.
    this.refreshTrigger.next(); 
  }


  // --- MÉTODOS DE ACCIÓN ---

  /**
   * Abre el modal de "Nuevo Producto".
   */
  openNewProductModal(): void {
    const dialogRef = this.dialog.open(NewProductComponent, {
      width: '800px', 
      disableClose: true 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) { 
        this.refreshInventory(); 
      }
    });
  }

  /**
   * Abre el modal de Detalle de Producto.
   */
  openProductDetailModal(productId: string): void {
    this.dialog.open(ProductDetailComponent, {
      data: { productId: productId }, 
      panelClass: 'product-detail-popup' 
    });
  }

  /**
   * Abre el modal de "Registrar Salida".
   */
  openRegisterOutModal(): void {
    const dialogRef = this.dialog.open(RegisterOutComponent, {
      width: '500px', 
      // Clase para aplicar el tema oscuro de fondo al modal
      panelClass: 'custom-dark-dialog-container', 
      disableClose: true 
    });

    dialogRef.afterClosed().subscribe(registeredData => {
      // Si el modal se cierra con data (asumimos que 'true' o un objeto significa éxito)
      if (registeredData) {
        console.log('Salida registrada. Recargando inventario...', registeredData);
        // 💡 CORRECCIÓN CLAVE: Llama a refreshInventory() para actualizar la tabla.
        this.refreshInventory(); 
      }
    });
  }
}