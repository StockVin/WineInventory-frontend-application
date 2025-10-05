import {Component, Input} from '@angular/core';
import {Product} from '../../model/product.entity';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-product-item',
  imports: [
    NgIf
  ],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.css'
})
export class ProductItemComponent {
  @Input() product!: Product;
}
