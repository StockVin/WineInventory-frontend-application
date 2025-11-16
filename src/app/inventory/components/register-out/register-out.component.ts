import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; 
import { InventoryService } from '../../services/inventory.service';
import { InventoryItemProps } from '../../models/inventory.entity'; 
import { TranslateModule } from '@ngx-translate/core';

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
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './register-out.component.html',
  styleUrls: ['./register-out.component.css'],
})
export class RegisterOutComponent implements OnInit {
  
  registerOutForm: FormGroup;
  products: InventoryItemProps[] = []; 
  outputTypes: string[] = ['Venta', 'Consumo interno', 'Daño/Pérdida', 'Muestra']; 
  
  maxQuantity: number = 0; 

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    public dialogRef: MatDialogRef<RegisterOutComponent>,
    @Inject(MAT_DIALOG_DATA) private data?: { productId?: string }
  ) {
    this.registerOutForm = this.fb.group({
      productId: ['', Validators.required],
      bestBeforeDate: ['', Validators.required],
      outputType: ['', Validators.required],
      quantity: [null, [Validators.required, Validators.min(1)]], 
    });
  }

  ngOnInit(): void {
    this.inventoryService.getInventoryList().subscribe(data => {
      this.products = data;

      if (this.data?.productId) {
        const exists = this.products.find(p => p.id === this.data?.productId);
        if (exists) {
          this.registerOutForm.patchValue({ productId: exists.id });
          this.handleProductSelection(exists.id);
        }
      }
    });
    this.registerOutForm.get('productId')?.valueChanges.subscribe(productId => {
      this.handleProductSelection(productId);
    });
  }

  private handleProductSelection(productId: string | null): void {
    const selectedProduct = this.products.find(p => p.id === productId);

    this.maxQuantity = selectedProduct ? selectedProduct.currentStock : 0;

    const bestBefore = selectedProduct?.expirationDate
      ? new Date(selectedProduct.expirationDate).toISOString().split('T')[0]
      : '';

    this.registerOutForm.patchValue({
      bestBeforeDate: bestBefore
    }, { emitEvent: false });

    const quantityControl = this.registerOutForm.get('quantity');
    quantityControl?.setValue(null);
    quantityControl?.setValidators([
      Validators.required,
      Validators.min(1),
      Validators.max(this.maxQuantity || 1),
    ]);
    quantityControl?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.registerOutForm.valid) {
      const formValue = this.registerOutForm.value;
      this.inventoryService.registerOutput({
        productId: formValue.productId,
        quantity: formValue.quantity,
        bestBeforeDate: formValue.bestBeforeDate,
        reason: formValue.outputType,
      }).subscribe({
        next: (response) => {
          console.log('Salida registrada con éxito', response);
          this.dialogRef.close(true); 
        },
        error: (err) => {
          console.error('Error al registrar salida', err);
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