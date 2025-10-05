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
import { TranslateModule } from '@ngx-translate/core';
import { 
    Observable, 
    BehaviorSubject, 
    switchMap, 
    debounceTime, 
    distinctUntilChanged, 
    map 
} from 'rxjs';
import { FormsModule } from '@angular/forms';
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
    LanguageSwitcher,
    TranslateModule 
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent implements OnInit {
  
  private refreshTrigger = new BehaviorSubject<void>(undefined); 
  private searchSubject = new BehaviorSubject<string>(''); 
  inventory$!: Observable<InventoryItemProps[]>;
  searchTerm: string = '';

  constructor(
    private inventoryService: InventoryService, 
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const allInventory$ = this.refreshTrigger.pipe(
        switchMap(() => this.inventoryService.getAllProps()) 
    );

    this.inventory$ = this.searchSubject.pipe(
      debounceTime(300), 
      distinctUntilChanged(), 
      switchMap(term => allInventory$.pipe(
        map(products => this.filterProducts(products, term))
      ))
    );
  }

  /**
  * Captures the change in the input called from (ngModelChange) in the HTML and emits it to the searchSubject.
  */
  onSearchChange(): void {
    this.searchSubject.next(this.searchTerm.toLowerCase());
  }

  /**
   * Logic for filtering products.
   */
  private filterProducts(products: InventoryItemProps[], term: string): InventoryItemProps[] {
    if (!term) {
      return products; 
    }
    
    return products.filter(product => 
      product.name.toLowerCase().includes(term) ||
      product.type.toLowerCase().includes(term)
    );
  }
  
  /**
   * Force reload of table data (used after creating, editing, or registering an output).
   */
  refreshInventory(): void {
    this.refreshTrigger.next(); 
  }

  /**
   * Opens the "New Product" modal.
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
   * Opens the "Product Detail" modal.
   */
  openProductDetailModal(productId: string): void {
    this.dialog.open(ProductDetailComponent, {
      data: { productId: productId }, 
      panelClass: 'product-detail-popup' 
    });
  }

  /**
   * Opens the "Register Output" modal.
   */
  openRegisterOutModal(productId?: string): void {
    const dialogRef = this.dialog.open(RegisterOutComponent, {
      width: '650px',
      maxWidth: '90vw',
      panelClass: 'custom-dark-dialog-container',
      disableClose: true,
      data: productId ? { productId: productId } : undefined
    });

    dialogRef.afterClosed().subscribe(registeredData => {
      if (registeredData) {
        console.log('Salida registrada. Recargando inventario...', registeredData);
        this.refreshInventory(); 
      }
    });
  }
}