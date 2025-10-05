import {Component, Input} from '@angular/core';
import { MatCardModule} from '@angular/material/card';
import {Warehouse} from '../../model/warehouse.entity';
import {MatButtonModule} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {Router} from "@angular/router";
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-warehouse-item',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatCardModule,
    MatIcon,
    TranslatePipe,
  ],
  templateUrl: './warehouse-item.component.html',
  styleUrl: './warehouse-item.component.css'
})
export class WarehouseItemComponent {
  @Input() warehouses!: Warehouse;

  constructor(private router: Router) {}

  navigateToCreate(): void {
    void this.router.navigate(['/warehouses', 'edit', this.warehouses.warehouseId]);
  }

  navigateToZones(): void {
    void this.router.navigate(['/warehouses', 'zones', this.warehouses.warehouseId]);
  }
}
