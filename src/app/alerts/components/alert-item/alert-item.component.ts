import { Component, Input } from '@angular/core';
import { AlertEntity } from '../../models/alert.entity';
import {MatDivider} from '@angular/material/divider';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-alert-item',
  templateUrl: './alert-item.component.html',
  imports: [
    MatDivider,
    NgIf
  ],
  styleUrls: ['./alert-item.component.css']
})
export class AlertItemComponent {
  @Input() alert!: AlertEntity;
  @Input() getMinimumStock: (productId: string) => number | null = () => null;
  @Input() getSeverityColor: (severity: string) => string = () => '#757575';
  @Input() getSeverityIcon: (severity: string) => string = () => 'ℹ️';
  expiration: any;
}