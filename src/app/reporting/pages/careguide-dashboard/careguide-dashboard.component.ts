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
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';

import { SideNavbarComponent } from '../../../shared/presentation/components/side-navbar/side-navbar.component';
import { LanguageSwitcher } from '../../../shared/presentation/components/language-switcher/language-switcher.component';
import { MatListModule } from '@angular/material/list';
import { CareGuideService } from '../../services/care-guide.service';
import { CareGuide } from '../../models/care-guide.entity';
import { CareguideListComponent } from '../../components/careguide-list/careguide-list.component';

@Component({
  selector: 'app-careguide-dashboard',
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
    CareguideListComponent
  ],
  templateUrl: './careguide-dashboard.component.html',
  styleUrls: ['./careguide-dashboard.component.css']
})
export class CareguideDashboardComponent implements OnInit {
  careGuides: CareGuide[] = [];
  filteredCareGuides: CareGuide[] = [];
  loading = true;
  error: string | null = null;
  private searchTerms = new Subject<string>();

  constructor(
    private router: Router, 
    private careGuideService: CareGuideService
  ) {}

  ngOnInit(): void {
    this.loadCareGuides();
    
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => this.filterCareGuides(term));
  }

  loadCareGuides(): void {
    this.loading = true;
    this.error = null;
    
    this.careGuideService.getAll().subscribe({
      next: (data) => {
        this.careGuides = data;
        this.filteredCareGuides = [...this.careGuides];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading care guides:', error);
        this.error = 'Error al cargar las guías de cuidado. Por favor, inténtalo de nuevo.';
        this.loading = false;
      }
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerms.next(input.value);
  }

  filterCareGuides(term: string): void {
    if (!term.trim()) {
      this.filteredCareGuides = [...this.careGuides];
      return;
    }

    const searchTerm = term.toLowerCase();
    this.filteredCareGuides = this.careGuides.filter(guide => 
      guide.name.toLowerCase().includes(searchTerm) ||
      guide.type.toLowerCase().includes(searchTerm) ||
      (guide.description && guide.description.toLowerCase().includes(searchTerm))
    );
  }

  navigateToReturnReport(): void {
    this.router.navigate(['reports']);
  }

  navigateToCareGuidesCreate(): void {
    this.router.navigate(['reports/careguides/create']);
  }
}
