import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SideNavbarComponent } from '../../../shared/presentation/components/side-navbar/side-navbar.component';
import { LanguageSwitcher } from '../../../shared/presentation/components/language-switcher/language-switcher.component';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CareGuideService } from '../../services/care-guide.service';
import { InventoryService, ProductResource } from '../../../inventory/services/inventory.service';

@Component({
  selector: 'app-careguide-create',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatSidenavModule,
    MatListModule,
    MatProgressSpinnerModule,
    TranslateModule,
    SideNavbarComponent,
    LanguageSwitcher,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    HttpClientModule
  ],
  templateUrl: './careguide-create.component.html',
  styleUrls: ['./careguide-create.component.css']
})
export class CareguideCreateComponent implements OnInit {
  careguide = {
    name: '',
    type: '',
    description: '',
  };

  careguideTypes = [
    'Red',
    'White',
    'Rosé',
    'Sparkling',
    'Dessert',
    'Fortified'
  ];

  selectedImage: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  selectedProductId: number | null = null;
  products: ProductResource[] = [];

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private router: Router,
    private careGuideService: CareGuideService,
    private inventoryService: InventoryService
  ) {}

  ngOnInit(): void {
    const accountIdRaw = localStorage.getItem('accountId');
    if (accountIdRaw) {
      const accountId = Number(accountIdRaw);
      this.inventoryService.getProductsByAccount(accountId).subscribe({
        next: (products) => {
          this.products = products;
          if (!this.selectedProductId && this.products.length > 0) {
            this.selectedProductId = this.products[0].id;
          }
        },
        error: (err) => console.error('Error loading products for care guide', err)
      });
    }
  }

  onImagePicked(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      return;
    }

    this.selectedImage = file;
    
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.selectedImage = null;
    this.imagePreview = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  onSave(): void {
    const formData = new FormData();
    formData.append('guideName', this.careguide.name);
    formData.append('type', this.careguide.type);
    formData.append('description', this.careguide.description);
    if (this.selectedImage) {
      formData.append('imageFile', this.selectedImage);
    }

    const accountId = localStorage.getItem('accountId');
    if (accountId) {
      formData.append('accountId', accountId);
    }

    if (this.selectedProductId) {
      formData.append('productId', String(this.selectedProductId));
    }

    const careGuideId = Date.now();

    this.careGuideService.addCareGuide(careGuideId, formData).subscribe({
      next: (response) => {
        console.log('Care guide saved successfully:', response);
        this.router.navigate(['/reports/careguides']);
      },
      error: (error) => {
        console.error('Error saving care guide:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      this.onSave();
    }
  }

  onCancel(): void {
    this.router.navigate(['/reports/careguides']);
  }

  isFormValid(): boolean {
    return !!this.careguide.name && 
           !!this.careguide.type && 
           !!this.careguide.description &&
           !!this.selectedProductId;
  }
}