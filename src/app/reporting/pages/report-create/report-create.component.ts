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
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

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
    products: string;
    type: string;
    price: number;
    amount: number;
    date: string;
    lost: number;
  } = {
    id: 0,
    products: '',
    type: '',
    price: 0,
    amount: 1,
    date: new Date().toISOString().split('T')[0],
    lost: 0
  };

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    
  }

  cancelReport(): void {
    this.router.navigate(['/reports']);
  }

  createReport(): void {
    const dateValue = new Date(this.report.date);
    if (!isNaN(dateValue.getTime())) {
      this.report.date = dateValue.toISOString().split('T')[0];
    }
    
    if (!this.report.products || !this.report.type || this.report.amount <= 0) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    if (this.report.lost <= 0) {
      this.report.lost = this.report.price * this.report.amount;
    }

    const reportData = {
      ...this.report,
      date: this.report.date
    };

    this.http.post(`${environment.apiUrl}/reporting`, reportData).subscribe({
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
