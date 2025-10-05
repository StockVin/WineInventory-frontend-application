import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../services/product.service';
import {Product} from '../../model/product.entity';
import {ToolBarComponent} from '../../../public/components/tool-bar/tool-bar.component';
import {ProductListComponent} from '../../components/product-list/product-list.component';
import {MatButtonToggle} from '@angular/material/button-toggle';
import {MatIcon} from '@angular/material/icon';
import {NgIf} from '@angular/common';
import {Router} from '@angular/router';
import {SideNavbarComponent} from '../../../public/components/side-navbar/side-navbar.component';

@Component({
  selector: 'app-storage',
  standalone: true,
  imports: [
    ToolBarComponent,
    ProductListComponent,
    NgIf,
    MatIcon,
    MatButtonToggle,
    SideNavbarComponent,
  ],
  templateUrl: './storage.component.html',
  styleUrl: './storage.component.css'
})

export class StorageComponent implements OnInit {
  products: Product[] = [];

  constructor(private router: Router, private productService: ProductService) {
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProductsByAccountId().subscribe({
      next: (products) => this.products = products,
      error: (err) => console.error('Error loading products:', err)
    });
  }

  goToCreateProduct() {

    this.router.navigate(['/product/new']);

  }
}
