import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Report } from '../../models/report.entity';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-report-item',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule, 
    MatButtonModule,
    MatTooltipModule,
    TranslateModule
  ],
  templateUrl: './report-item.component.html',
  styleUrl: './report-item.component.css'
})
export class ReportItemComponent {
  @Input() report!: Report;
  @Output() delete = new EventEmitter<number>();

  onDelete(): void {
    if (confirm('¿Estás seguro de que deseas eliminar este registro?')) {
      this.delete.emit(this.report.id);
    }
  }
}