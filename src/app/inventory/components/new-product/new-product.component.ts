import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatOptionModule } from '@angular/material/core';         

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InventoryService, Warehouse, ProductResource, LIQUOR_TYPE_OPTIONS, toBackendLiquorType, toDisplayLiquorType } from '../../services/inventory.service';
import { LiquorType } from '../../models/inventory.entity';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, of, map, switchMap } from 'rxjs';

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
export class NewProductComponent implements OnInit {
    public dialogRef: MatDialogRef<NewProductComponent>; 
    
    public productForm: FormGroup;
    public liquorTypeOptions = LIQUOR_TYPE_OPTIONS;
    public warehouses: Warehouse[] = [];
    public products: ProductResource[] = [];
    public imageFile: File | null = null;

    constructor(
        private fb: FormBuilder,
        private inventoryService: InventoryService,
        dialogRef: MatDialogRef<NewProductComponent>, 
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.dialogRef = dialogRef; 

        this.productForm = this.fb.group({
            warehouseId: [Number(localStorage.getItem('warehouseId') ?? 1), [Validators.required, Validators.min(1)]],
            productId: [null],
            name: ['', Validators.required],
            brandName: ['', Validators.required],
            type: [this.liquorTypeOptions[0].label, Validators.required],
            price: [0, [Validators.required, Validators.min(0.01)]],
            minimumStock: [0, [Validators.required, Validators.min(0)]],
            expirationDate: [this.getDefaultExpirationDate(), Validators.required], 
            currentStock: [1, [Validators.required, Validators.min(1)]], 
        });
    }

    public ngOnInit(): void {
        const accountIdRaw = localStorage.getItem('accountId');
        if (accountIdRaw) {
            const accountId = Number(accountIdRaw);
            this.inventoryService.getProductsByAccount(accountId).subscribe({
                next: (products) => this.products = products,
                error: (err) => console.error('Error loading products', err)
            });
        }

        this.inventoryService.getWarehouses().subscribe({
            next: (warehouses) => this.warehouses = warehouses,
            error: (err) => console.error('Error loading warehouses', err)
        });

        this.productForm.get('warehouseId')?.valueChanges.subscribe(value => {
            if (value) {
                localStorage.setItem('warehouseId', String(value));
            }
        });

        this.productForm.get('productId')?.valueChanges.subscribe(productId => {
            if (!productId) {
                return;
            }
            const product = this.products.find(p => p.id === productId);
            if (product) {
                this.productForm.patchValue({
                    name: product.name,
                    brandName: product.brandName,
                    type: toDisplayLiquorType(product.liquorType),
                    price: product.unitPriceAmount,
                    minimumStock: product.minimumStock,
                });
                this.imageFile = null;
            }
        });
    }

    public onImageSelected(fileList: FileList | null): void {
        this.imageFile = fileList && fileList.length > 0 ? fileList[0] : null;
    }

    public onSave(): void {
        if (this.productForm.invalid) {
            this.productForm.markAllAsTouched();
            return;
        }

        const formValue = this.productForm.value;
        const warehouseId = Number(formValue.warehouseId);
        const bestBeforeDateStr = formValue.expirationDate ?? '';
        const bestBeforeDate = bestBeforeDateStr ? new Date(bestBeforeDateStr) : null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!bestBeforeDate || bestBeforeDate <= today) {
            this.productForm.get('expirationDate')?.setErrors({ future: true });
            this.productForm.markAllAsTouched();
            return;
        }

        const quantity = Number(formValue.currentStock ?? 0);
        const accountIdRaw = localStorage.getItem('accountId');
        const accountId = accountIdRaw ? Number(accountIdRaw) : null;

        if (!accountId) {
            console.error('No accountId stored in localStorage. Cannot create product.');
            return;
        }

        const bestBeforeDateIso = bestBeforeDate.toISOString().split('T')[0];

        const ensureProduct$: Observable<number> = formValue.productId
            ? of(Number(formValue.productId))
            : this.inventoryService.createProduct(accountId, {
                name: formValue.name,
                brandName: formValue.brandName,
                liquorType: toBackendLiquorType(formValue.type as LiquorType),
                unitPriceAmount: Number(formValue.price),
                minimumStock: Number(formValue.minimumStock),
                image: this.imageFile
            }).pipe(
                map(product => {
                    this.products.push(product);
                    this.productForm.patchValue({ productId: product.id });
                    return product.id;
                })
            );

        ensureProduct$
            .pipe(
                switchMap(productId =>
                    this.inventoryService.getWarehouseProducts(warehouseId).pipe(
                        map(productsInWarehouse => ({
                            productId,
                            exists: productsInWarehouse.some(item => item.productId === productId)
                        }))
                    )
                ),
                switchMap(({ productId, exists }) => exists
                    ? this.inventoryService.addStock(warehouseId, productId, {
                        stockBestBeforeDate: bestBeforeDateIso,
                        addedQuantity: quantity,
                    })
                    : this.inventoryService.createInventory(warehouseId, productId, {
                        bestBeforeDate: bestBeforeDateIso,
                        quantity,
                    })
                )
            )
            .subscribe({
            next: () => this.dialogRef.close(true),
            error: (err) => console.error('Error al crear inventario:', err)
        });
    }

    private getDefaultExpirationDate(): string {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    }
}
