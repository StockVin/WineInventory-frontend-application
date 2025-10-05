import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatOptionModule } from '@angular/material/core';         

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InventoryService } from '../../services/inventory.service';
import { InventoryItem, InventoryItemProps, LiquorType } from '../../models/inventory.entity';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatButtonModule, 
    MatInputModule, 
    MatSelectModule, 
    MatIconModule,
    MatFormFieldModule, 
    MatOptionModule,     
    TranslateModule
  ],
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent {
    public dialogRef: MatDialogRef<NewProductComponent>; 
    
    public productForm: FormGroup;
    public liquorTypes: LiquorType[] = ['Vino', 'Destilado', 'Cerveza', 'Licores', 'Licor Anisado'];
    
    constructor(
        private fb: FormBuilder,
        private inventoryService: InventoryService,
        dialogRef: MatDialogRef<NewProductComponent>, 
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.dialogRef = dialogRef; 

        this.productForm = this.fb.group({
            name: ['Ejemplo de Licor', Validators.required],
            type: ['Licor Anisado', Validators.required],
            price: [30.00, [Validators.required, Validators.min(0.01)]],
            expirationDate: [new Date().toISOString().split('T')[0]], 
            currentStock: [20, [Validators.required, Validators.min(0)]], 
            minStockLevel: [8, [Validators.required, Validators.min(0)]],
        });
    }

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
