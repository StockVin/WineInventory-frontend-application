import { Component, Input } from '@angular/core';
import { Report } from '../../models/report.entity';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ReportItemComponent } from '../report-item/report-item.component';

@Component({
  selector: 'app-report-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    TranslateModule,
    ReportItemComponent
  ],
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.css']
})
export class ReportListComponent {
  @Input() reports: Report[] = [];
  
  displayedColumns: string[] = ['id', 'date', 'product', 'type', 'price', 'amount', 'lost', 'actions'];
  
  getTypeClass(type: string): string {
    switch (type.toLowerCase()) {
      case 'loss':
        return 'type-loss';
      case 'destilado':
        return 'type-destilado';
      default:
        return 'type-default';
    }
  }
}
