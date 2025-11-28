import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SubscriptionPlan } from '../../models/profile.entity';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { PlanService } from '../../../plans-subcripstions/services/plan.service';
import { ProfileService } from '../../services/profile.service';

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
  private planService = inject(PlanService);
  private profileService = inject(ProfileService);
  private accountId: string | null = null;

  constructor() {
    this.profileService.getProfile().subscribe(() => {
      this.accountId = this.resolveAccountId();
      console.log('PlanDetails: Resolved accountId:', this.accountId);
    });
  }

  private resolveAccountId(): string | null {
    try {
      const raw = localStorage.getItem('currentUser');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.accountId !== undefined && parsed?.accountId !== null) {
          return String(parsed.accountId);
        }
      }
    } catch {}
    let fallback: string | null = null;
    this.profileService.getProfile().subscribe(p => fallback = p?.id ? String(p.id) : null).unsubscribe();
    return fallback;
  }

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

    const selectedPlan = this.plans.find(plan => plan.planId === planId);
    if (!selectedPlan) {
      console.error('PlanDetails: Plan no encontrado:', planId);
      console.error('Planes disponibles:', this.plans.map(p => ({ id: p.planId, type: p.planType })));
      return;
    }

    console.log('PlanDetails: Plan encontrado:', selectedPlan);
    this.accountId = this.resolveAccountId();
    console.log('PlanDetails: AccountId para procesar:', this.accountId);

    if (!this.accountId || this.accountId.trim() === '') {
      console.error('PlanDetails: No se proporcionó accountId válido para procesar el pago');
      return;
    }

    if (selectedPlan.price === 0) {
      console.log('PlanDetails: Plan gratuito seleccionado, procesando sin pago');
      this.planSelected.emit(planId);
      return;
    }

    console.log('PlanDetails: Plan de pago seleccionado, procesando con PayPal');
    console.log('PlanDetails: Enviando solicitud con:', {
      accountId: this.accountId,
      planId: planId,
      planType: selectedPlan.planType,
      price: selectedPlan.price
    });

    this.planService.subscribeToPlanWithPayment(this.accountId, planId);
  }
}
