import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WarehouseService } from '../../services/warehouse.service';
import { SideNavbarComponent } from '../../../public/components/side-navbar/side-navbar.component';
import { ToolBarComponent } from '../../../public/components/tool-bar/tool-bar.component';
import { TranslatePipe } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-warehouse-create-and-edit',
  imports: [
    MatFormFieldModule,
    MatInput,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    SideNavbarComponent,
    ToolBarComponent,
    TranslatePipe,
  ],
  templateUrl: './warehouse-create-and-edit.component.html',
  styleUrl: './warehouse-create-and-edit.component.css'
})
export class WarehouseCreateAndEditComponent {

  isEditMode: boolean = false;
  warehouseId: number | null = 0;
  pageTitle: string = '';
  selectedImageFile: File | null = null;

  nameFormControl = new FormControl('', Validators.required);
  streetFormControl = new FormControl('', Validators.required);
  cityFormControl = new FormControl('', Validators.required);
  districtFormControl = new FormControl('', Validators.required);
  countryFormControl = new FormControl('', Validators.required);
  postalCodeFormControl = new FormControl('', [Validators.required, Validators.pattern(/^\d{5}$/)]);
  maxTemperatureFormControl = new FormControl<number | null>(null, [Validators.required, Validators.min(-50), Validators.max(50)]);
  minTemperatureFormControl = new FormControl<number | null>(null, [Validators.required, Validators.min(-50), Validators.max(50)]);
  capacityFormControl = new FormControl('', [Validators.required, Validators.min(1)]);

  warehouseForm = new FormGroup({
    name: this.nameFormControl,
    street: this.streetFormControl,
    city: this.cityFormControl,
    district: this.districtFormControl,
    country: this.countryFormControl,
    postalCode: this.postalCodeFormControl,
    maxTemperature: this.maxTemperatureFormControl,
    minTemperature: this.minTemperatureFormControl,
    capacity: this.capacityFormControl
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private warehouseService: WarehouseService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('warehouseId');
    this.warehouseId = Number(idParam);
    this.isEditMode = !!this.warehouseId;
    this.pageTitle = this.isEditMode ? 'warehouse.edit' : 'warehouse.create';

    if (this.isEditMode) {
      this.loadWarehouseData();
    } else {
      this.warehouseId = null;
    }
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImageFile = input.files[0];
    }
  }

  private prepareFormData(): FormData {
    const formData = new FormData();
    const formValue = this.warehouseForm.value;

    formData.append('name', formValue.name || '');
    formData.append('street', formValue.street || '');
    formData.append('city', formValue.city || '');
    formData.append('district', formValue.district || '');
    formData.append('postalCode', formValue.postalCode || '');
    formData.append('country', formValue.country || '');
    formData.append('maxTemperature', formValue.maxTemperature?.toString() ?? '');
    formData.append('minTemperature', formValue.minTemperature?.toString() ?? '');
    formData.append('capacity', formValue.capacity?.toString() ?? '');

    if (this.selectedImageFile) {
      formData.append('image', this.selectedImageFile);
    }

    return formData;
  }

  onSubmit(): void {
    if (this.warehouseForm.invalid) {
      this.snackBar.open('Please fill all required fields correctly', 'Close', {
        duration: 3000
      });
      return;
    }

    const formData = this.prepareFormData();

    if (this.isEditMode && this.warehouseId) {
      this.updateWarehouse(formData);
    } else {
      this.createWarehouse(formData);
    }
  }

  private createWarehouse(formData: FormData): void {
    this.warehouseService.createWarehouse(formData,).subscribe({
      next: () => {
        this.snackBar.open('Warehouse created successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/warehouses']);
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Error creating warehouse', 'Close', { duration: 3000 });
      }
    });
  }

  private updateWarehouse(formData: FormData): void {
    this.warehouseService.updateWarehouse(this.warehouseId!, formData).subscribe({
      next: () => {
        this.snackBar.open('Warehouse updated successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/warehouses']);
      },
      error: (err) => {
        this.snackBar.open('Error updating warehouse', 'Close', { duration: 3000 });
      }
    });
  }

  private loadWarehouseData(): void {
    if (this.warehouseId) {
      this.warehouseService.getWarehouseById(this.warehouseId).subscribe({
        next: (warehouse) => {
          this.warehouseForm.patchValue({
            name: warehouse.name,
            street: warehouse.street,
            city: warehouse.city,
            district: warehouse.district,
            postalCode: warehouse.postalCode,
            country: warehouse.country,
            maxTemperature: warehouse.maxTemperature,
            minTemperature: warehouse.minTemperature,
            capacity: warehouse.capacity.toString()
          });
        },
        error: (err) => {
          console.error('Error loading warehouse', err);
        }
      });
    }
  }

  onCancel(): void {
    void this.router.navigate(['/warehouses']);
  }
}
