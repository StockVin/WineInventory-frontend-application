import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // Importamos MatIconModule
import { InventoryService } from '../../services/inventory.service';
import { InventoryItemProps } from '../../models/inventory.entity'; 

@Component({
  selector: 'app-register-out',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatSelectModule, 
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './register-out.component.html',
  styleUrl: './register-out.component.css',
})
export class RegisterOutComponent implements OnInit {
  
  registerOutForm: FormGroup;
  products: InventoryItemProps[] = []; 
  outputTypes: string[] = ['Venta', 'Consumo interno', 'Daño/Pérdida', 'Muestra']; 
  
  maxQuantity: number = 0; // Stock actual del producto seleccionado

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    public dialogRef: MatDialogRef<RegisterOutComponent>
  ) {
    this.registerOutForm = this.fb.group({
      productId: ['', Validators.required],
      outputType: ['', Validators.required],
      quantity: [null, [Validators.required, Validators.min(1)]], 
    });
  }

  ngOnInit(): void {
    // Cargar la lista de productos
    this.inventoryService.getInventoryList().subscribe(data => {
      this.products = data;
    });

    // Suscribirse a cambios en el producto seleccionado
    this.registerOutForm.get('productId')?.valueChanges.subscribe(productId => {
      const selectedProduct = this.products.find(p => p.id === productId);
      
      // Usar 'currentStock' de tu modelo
      this.maxQuantity = selectedProduct ? selectedProduct.currentStock : 0;
      
      // Resetear la cantidad y aplicar validadores
      this.registerOutForm.get('quantity')?.setValue(null);
      this.registerOutForm.get('quantity')?.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(this.maxQuantity), 
      ]);
      this.registerOutForm.get('quantity')?.updateValueAndValidity();
    });
  }
  
  onSubmit(): void {
    if (this.registerOutForm.valid) {
      // Llama al servicio para registrar la salida
      this.inventoryService.registerOutput(this.registerOutForm.value).subscribe({
        next: (response) => {
          console.log('Salida registrada con éxito', response);
          // Cerramos y pasamos 'true' para indicar éxito y recargar la lista de inventario
          this.dialogRef.close(true); 
        },
        error: (err) => {
          console.error('Error al registrar salida', err);
          // Mostrar mensaje de error (ej. MatSnackBar)
        }
      });
    } else {
      this.registerOutForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}