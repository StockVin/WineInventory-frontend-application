import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CareGuide } from '../../models/care-guide.entity';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { CareguideItemComponent } from '../careguide-item/careguide-item.component';

@Component({
  selector: 'app-careguide-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
  templateUrl: './careguide-list.component.html',
  styleUrl: './careguide-list.component.css',
})
export class CareguideListComponent {
  @Input() careguides: CareGuide[] = [];
  @Input() loading = false;
  @Output() selectCareGuide = new EventEmitter<CareGuide>();

  /**
   * Handles the selection of a care guide
   * @param careguide The selected care guide
   */
  onSelectCareGuide(careguide: CareGuide): void {
    this.selectCareGuide.emit(careguide);
  }

  /**
   * Handles the error when loading an image
   * @param event The error event
   * @param careguide The related care guide
   */
  onImageError(event: Event, careguide: CareGuide): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.style.display = 'none';
  }
}
