import { Component } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  imports: [
    FormsModule
  ],
  styleUrls: ['./new-order.component.css']
})
export class NewOrderComponent {
  emailProveedor: string | undefined;
  productos: { nombre: string, cantidad: number }[] = [];

  constructor(private ordersService: OrdersService) {}

  agregarProducto(nombre: string, cantidad: number): void {
    this.productos.push({ nombre, cantidad });
  }

  enviarOrden(): void {
    const orden = {
      proveedor: this.emailProveedor,
      productos: this.productos
    };
    this.ordersService.createOrder(orden).subscribe(response => {
      console.log('Orden enviada', response);
    });
  }
}
