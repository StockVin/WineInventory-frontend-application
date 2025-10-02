import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';

import { SideNavbarComponent } from '../../../shared/presentation/components/side-navbar/side-navbar.component';
import { LanguageSwitcher } from '../../../shared/presentation/components/language-switcher/language-switcher.component';
import { MatListModule } from '@angular/material/list';
import { ReportService } from '../../services/report.service';
import { Report } from '../../models/report.entity';
import { ReportListComponent } from '../../components/report-list/report-list.component';

@Component({
  selector: 'app-report-dashboard',
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
    ReportListComponent,
  ],
  templateUrl: './report-dashboard.component.html',
  styleUrl: './report-dashboard.component.css'
})
export class ReportDashboardComponent implements OnInit {

  reports: Report[] = [];
  filteredReports: Report[] = [];
  loading = true;
  error: string | null = null;
  private searchTerms = new Subject<string>();

  constructor(private reportService: ReportService, private router: Router) {}

  ngOnInit(): void {
    this.loadReports();
    
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => this.filterReports(term));
  }

  loadReports(): void {
    this.loading = true;
    this.error = null;
    
    this.reportService.getAll().subscribe({
      next: (data) => {
        this.reports = data;
        this.filteredReports = [...this.reports];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading reports:', error);
        this.error = 'Error al cargar los reportes. Por favor, inténtalo de nuevo.';
        this.loading = false;
      }
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerms.next(input.value);
  }

  private filterReports(term: string): void {
    if (!term.trim()) {
      this.filteredReports = [...this.reports];
      return;
    }

    const searchTerm = term.toLowerCase();
    this.filteredReports = this.reports.filter(report => 
      report.products.toLowerCase().includes(searchTerm) ||
      report.type.toLowerCase().includes(searchTerm) ||
      report.id.toString().includes(searchTerm)
    );
  }
  getTypeClass(type: string): string {
    switch (type.toLowerCase()) {
      case 'sale':
        return 'type-sale';
      case 'purchase':
        return 'type-purchase';
      case 'inventory':
        return 'type-inventory';
      case 'loss':
        return 'type-loss';
      default:
        return 'type-default';
    }
  }
  navigateToReportCreate(): void {
    this.router.navigate(['reports/report-create']);
  }

  navigateToCareGuides(): void {
    this.router.navigate(['reports/careguides']);
  }
  
  onDeleteReport(reportId: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este reporte?')) {
      this.reportService.delete(reportId).subscribe({
        next: () => {
          this.reports = this.reports.filter(report => report.id !== reportId);
          this.filteredReports = this.filteredReports.filter(report => report.id !== reportId);
        },
        error: (error) => {
          console.error('Error deleting report:', error);
        }
      });
    }
  }
}
