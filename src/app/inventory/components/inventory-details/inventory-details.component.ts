import {Component, inject, ViewChild} from '@angular/core';
import {Product} from '../../model/product.entity';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {
  MatCell,
  MatCellDef,
  MatColumnDef, MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow,
  MatHeaderRowDef, MatRow,
  MatRowDef,
  MatTable, MatTableDataSource
} from '@angular/material/table';
import {NgClass} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {ProductService} from '../../services/product.service';

@Component({
  selector: 'app-inventory-details',
  imports: [
    MatTable,
    MatSort,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatPaginator,
    NgClass,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatRowDef,
    MatHeaderRow,
    MatRow,
    MatSortHeader,
    MatIcon
  ],
  templateUrl: './inventory-details.component.html',
  styleUrl: './inventory-details.component.css'
})
export class InventoryDetailsComponent {

  protected productData!: Product;

  protected columnsToDisplay: string[] = ['image', 'name', 'description', 'actions'];

  @ViewChild(MatPaginator, {static: false})
  protected paginator!: MatPaginator;

  @ViewChild(MatSort)
  protected sort!: MatSort;

  protected editMode: boolean = false;

  protected dataSource!: MatTableDataSource<Product>;

  private productService: ProductService = inject(ProductService);

  constructor() {
    this.editMode = false;
    this.productData = new Product({});

  }
}
