import {Component, Input} from '@angular/core';
import {Warehouse} from '../../model/warehouse.entity';
import {WarehouseItemComponent} from '../warehouse-item/warehouse-item.component';
import {MatGridListModule} from '@angular/material/grid-list';

@Component({
  selector: 'app-warehouse-list',
  imports: [
    WarehouseItemComponent,

    MatGridListModule
  ],
  templateUrl: './warehouse-list.component.html',
  styleUrl: './warehouse-list.component.css'
})
export class WarehouseListComponent {

  @Input() warehouses!: Warehouse[];
}
