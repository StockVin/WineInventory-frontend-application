import { Component, OnInit } from '@angular/core';
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
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-report-create',
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
    FormsModule
  ],
  templateUrl: './report-create.component.html',
  styleUrl: './report-create.component.css'
})
export class ReportCreateComponent implements OnInit {
  report: {
    id: number;
    productName: string;
    productNameText: string;
    type: string;
    price: number;
    amount: number;
    reportDate: string;
    lostAmount: number;
  } = {
    id: 0,
    productName: '',
    productNameText: '',
    type: '',
    price: 0,
    amount: 1,
    reportDate: new Date().toISOString().split('T')[0],
    lostAmount: 0
  };

  constructor(
    private router: Router,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    
  }

  cancelReport(): void {
    this.router.navigate(['/reports']);
  }

  createReport(): void {
    const accountId = localStorage.getItem('accountId');
    if (!accountId) {
      alert('Sesión no válida. Inicie sesión nuevamente.');
      this.router.navigate(['/sign-in']);
      return;
    }

    if (!this.report.productName || !this.report.type || this.report.amount <= 0) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    if (this.report.lostAmount <= 0) {
      this.report.lostAmount = this.report.price * this.report.amount;
    }

    const dateValue = new Date(this.report.reportDate);
    if (isNaN(dateValue.getTime())) {
      alert('Por favor ingrese una fecha válida');
      return;
    }

    const reportData = {
      productName: String(this.report.productName ?? ''),
      productNameText: String(this.report.productNameText || this.report.productName || ''),
      type: String(this.report.type ?? ''),
      price: Number(this.report.price),
      amount: Number(this.report.amount),
      reportDate: dateValue.toISOString(),
      lostAmount: Number(this.report.lostAmount)
    };

    this.reportService.create(reportData as any).subscribe({
      next: () => {
        this.router.navigate(['/reports']);
      },
      error: (error) => {
        console.error('Error saving report:', error);
        alert('Error al guardar el reporte. Por favor intente nuevamente.');
      }
    });
  }
}
