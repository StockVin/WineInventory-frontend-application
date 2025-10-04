import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field'; // ¡Faltaba para mat-form-field, mat-label, mat-error!
import { MatOptionModule } from '@angular/material/core';          // ¡Faltaba para mat-option!

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InventoryService } from '../../services/inventory.service';
import { InventoryItem, InventoryItemProps, LiquorType } from '../../models/inventory.entity';

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    // Módulos de Material
    MatButtonModule, 
    MatInputModule, 
    MatSelectModule, 
    MatIconModule,
    MatFormFieldModule, // <== AGREGADO
    MatOptionModule     // <== AGREGADO
  ],
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent {
    // 💡 La propiedad 'dialogRef' DEBE ser pública para que el template HTML pueda acceder a ella.
    public dialogRef: MatDialogRef<NewProductComponent>; 
    
    // 💡 La propiedad 'productForm' DEBE ser pública para que el template HTML pueda acceder a ella.
    public productForm: FormGroup;
    public liquorTypes: LiquorType[] = ['Vino', 'Destilado', 'Cerveza', 'Licores', 'Licor Anisado'];
    
    constructor(
        private fb: FormBuilder,
        private inventoryService: InventoryService,
        // Asignación de MatDialogRef
        dialogRef: MatDialogRef<NewProductComponent>, // <== QUITADO el 'public' temporalmente
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.dialogRef = dialogRef; // <== ASIGNADO A LA PROPIEDAD PÚBLICA

        this.productForm = this.fb.group({
            name: ['Ejemplo de Licor', Validators.required],
            type: ['Licor Anisado', Validators.required],
            price: [30.00, [Validators.required, Validators.min(0.01)]],
            expirationDate: [new Date().toISOString().split('T')[0]], 
            currentStock: [20, [Validators.required, Validators.min(0)]], 
            minStockLevel: [8, [Validators.required, Validators.min(0)]],
        });
    }

    // 💡 El método 'onSave' DEBE ser público para que el template HTML (ngSubmit) pueda acceder a él.
    public onSave(): void {
        if (this.productForm.invalid) {
            this.productForm.markAllAsTouched();
            return;
        }

        const newProductProps: InventoryItemProps = {
            id: '',
            name: this.productForm.value.name,
            type: this.productForm.value.type,
            price: this.productForm.value.price,
            expirationDate: new Date(this.productForm.value.expirationDate), 
            currentStock: this.productForm.value.currentStock, 
            minStockLevel: this.productForm.value.minStockLevel,
            location: 'Almacén general', 
            imageUrl: 'assets/images/placeholder.png' 
        };

        const newItem = new InventoryItem(newProductProps);
        
        this.inventoryService.save(newItem).subscribe({
            next: () => {
                this.dialogRef.close(true); 
            },
            error: (err) => {
                console.error('Error al guardar en Fake API:', err);
            }
        });
    }
}
