import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ProductService} from '../../services/product.service';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatSelect} from '@angular/material/select';
import {CommonModule} from '@angular/common';
import {MatOption} from '@angular/material/core';
import {NotificationComponent} from '../../../public/components/notificacion/notification.component';
import {SideNavbarComponent} from '../../../public/components/side-navbar/side-navbar.component';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatButton,
    MatLabel,
    MatSelect,
    MatOption,
    NotificationComponent,
    NotificationComponent,
    SideNavbarComponent,
  ],
  templateUrl: './product-create-and-edit.component.html',
  styleUrl: './product-create-and-edit.component.css',
})
export class ProductCreateAndEditComponent {
  productForm: FormGroup;
  selectedFile: File | null = null;
  private defaultImageUrl: string = 'https://st1.uvnimg.com/dims4/default/5aa502a/2147483647/thumbnail/400x225/quality/75/?url=https%3A%2F%2Fuvn-brightspot.s3.amazonaws.com%2Fassets%2Fvixes%2Fimj%2Felgrancatador%2FQ%2FQue-es-un-vino-gran-reserva.jpg';
  private defaultImageFile: File | null = null;

  // Properties for the notification component
  showNotification: boolean = false;
  notificationTitle: string = '';
  notificationContent: string = '';
  notificationType: 'success' | 'alert' = 'success';

  brands = ['Tabernero', 'SantiagoQueirolo', 'Porton', 'Cristal', 'JhonnieWalker', 'JackDaniels', 'Budweiser', 'Heineken', 'Corona', 'PilsenCallao', 'Cusquena', 'Cartavio'];
  liquorTypes = ['Rum', 'Whisky', 'Gin', 'Vodka', 'Tequila', 'Brandy', 'Wine', 'Beer', 'Creamy', 'Herbal', 'Fruity', 'Special'];

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      brandName: ['', Validators.required],
      liquorType: ['', Validators.required],
      unitPriceAmount: ['', Validators.required],
      minimumStock: ['', Validators.required]
    });
    this.loadDefaultImageAsFile();
  }

  private loadDefaultImageAsFile(): void {
    fetch(this.defaultImageUrl)
      .then(res => res.blob())
      .then(blob => {
        this.defaultImageFile = new File([blob], 'default-wine-image.jpg', {type: blob.type});
      })
      .catch(error => {
        console.error('Error loading default image from URL:', error);
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    } else {
      this.selectedFile = null;
    }
  }

  onSubmit(): void {
    this.showNotification = false;

    if (this.productForm.invalid) {
      this.showNotification = true;
      this.notificationTitle = 'Validation Error';
      this.notificationContent = 'Please fill in all required fields.';
      this.notificationType = 'alert';
      return;
    }

    let fileToUpload: File | null = this.selectedFile;

    if (!this.selectedFile && this.defaultImageFile) {
      fileToUpload = this.defaultImageFile;
    } else if (!this.selectedFile && !this.defaultImageFile) {
      this.showNotification = true;
      this.notificationTitle = 'Image Missing';
      this.notificationContent = 'Please select an image or ensure the default image is available.';
      this.notificationType = 'alert';
      return;
    }

    const productData = this.productForm.value;

    if (fileToUpload) {
      this.productService.createProduct(productData, fileToUpload).subscribe({
        next: (response) => {
          console.log('Product created successfully:', response);
          this.showNotification = true;
          this.notificationTitle = 'Success!';
          this.notificationContent = 'Product created successfully.';
          this.notificationType = 'success';
          this.productForm.reset();
          this.selectedFile = null;
        },
        error: (error) => {
          console.error('Error creating product:', error);
          this.showNotification = true;
          this.notificationTitle = 'Error';
          this.notificationContent = 'An error occurred while creating the product. Please try again.';
          this.notificationType = 'alert';
        }
      });
    } else {
      console.error('No file to upload, neither selected nor default.');
      this.showNotification = true;
      this.notificationTitle = 'Error';
      this.notificationContent = 'An unexpected error occurred: no image file was prepared for upload.';
      this.notificationType = 'alert';
    }
  }
}
