import {Component, OnInit} from '@angular/core';
import {WarehouseListComponent} from '../../components/warehouse-list/warehouse-list.component';
import {Warehouse} from '../../model/warehouse.entity';
import {ActivatedRoute, Router} from '@angular/router';
import {WarehouseService} from '../../services/warehouse.service';
import {MatFabButton} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {UserService} from "../../../authentication/services/user.service";
import {ToolBarComponent} from '../../../public/components/tool-bar/tool-bar.component';
import {SideNavbarComponent} from '../../../public/components/side-navbar/side-navbar.component';
import {NgIf} from '@angular/common';
import {
  PurchaseOrderComponent
} from '../../../order-operation-and-monitoring/pages/purchase-order/purchase-order.component';
import {SalesOrderComponent} from '../../../order-operation-and-monitoring/pages/sales-order/sales-order.component';

@Component({
  selector: 'app-warehouses',
  imports: [
    WarehouseListComponent,
    MatIconModule,
    MatFabButton,
    ToolBarComponent,
    SideNavbarComponent,
    NgIf,
  ],
  templateUrl: './warehouses.component.html',
  styleUrl: './warehouses.component.css'
})
export class WarehousesComponent implements OnInit {
  profileId: number = 0;
  warehouses: Warehouse[] = [];

  constructor(private route: ActivatedRoute, private warehouseService: WarehouseService, private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.loadWarehouses();
  }

  loadWarehouses(): void {

    this.warehouseService.getWarehouses().subscribe({
      next: (data) => {
        console.log('Warehouses data received:', data);
        this.warehouses = data;
      },
      error: (error) => {
        console.error('Error loading warehouses:', error);
      }
    });
  }

  navigateToCreate(): void {
    void this.router.navigate(['/warehouses', 'new']);
  }
}
