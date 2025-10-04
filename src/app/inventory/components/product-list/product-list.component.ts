import {Component, Input} from '@angular/core';
import {Product} from '../../model/product.entity';
import {ProductItemComponent} from '../product-item/product-item.component';

@Component({
  selector: 'app-product-list',
  imports: [
    ProductItemComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  @Input() products: Product[] = [];
}
