import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CareGuide } from '../../models/care-guide.entity';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-careguide-item',
  imports: [
    CommonModule, 
    MatIconModule, 
    MatButtonModule,
    MatTooltipModule,
    TranslateModule
  ],
  templateUrl: './careguide-item.component.html',
  styleUrl: './careguide-item.component.css'
})
export class CareguideItemComponent {
  @Input() careguide!: CareGuide;
}
