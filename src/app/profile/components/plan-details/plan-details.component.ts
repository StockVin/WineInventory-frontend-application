import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SubscriptionPlan } from '../../models/profile.entity';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-plan-details',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatIconModule],
  templateUrl: './plan-details.component.html',
  styleUrl: './plan-details.component.css',
  host: {
    class: 'card plans-card'
  }
})
export class PlanDetailsComponent implements OnChanges {
  @Input() plans: SubscriptionPlan[] = [];
  @Input() selectedPlanId: string | null = null;
  @Input() disabled = false;
  @Output() planSelected = new EventEmitter<string>();

  private translate = inject(TranslateService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['plans'] || changes['selectedPlanId']) {
      console.log('PlanDetails: Datos recibidos - Planes:', this.plans, 'Plan seleccionado:', this.selectedPlanId);
    }
  }

  onSelectPlan(planId: string): void {
    console.log('PlanDetails: Plan seleccionado:', planId, 'Plan actual:', this.selectedPlanId, 'Deshabilitado:', this.disabled);

    if (this.disabled || this.selectedPlanId === planId) {
      console.log('PlanDetails: Selección ignorada - deshabilitado o mismo plan');
      return;
    }

    console.log('PlanDetails: Emitiendo selección de plan:', planId);
    this.planSelected.emit(planId);
  }

  getPlanDescription(index: number): string {
    const descriptions = [
      'profile.planDetails.subtitle1',
      'profile.planDetails.subtitle2',
      'profile.planDetails.subtitle3'
    ];

    return this.translate.instant(descriptions[index] || descriptions[0]);
  }

  getBenefitTranslation(planIndex: number, benefitIndex: number): string {
    const benefits = [
      'profile.planDetails.details.feature1',
      'profile.planDetails.details.feature2',
      'profile.planDetails.details.feature3',
      'profile.planDetails.details.feature4',
      'profile.planDetails.details.feature5',
      'profile.planDetails.details.feature6',
      'profile.planDetails.details.feature7'
    ];

    const planFeatureMapping = [
      [0, 2, 4],
      [1, 3, 5],
      [6, 0, 1]
    ];

    const featureIndex = planFeatureMapping[planIndex]?.[benefitIndex] ?? 0;
    return this.translate.instant(benefits[featureIndex] || benefits[0]);
  }
}
