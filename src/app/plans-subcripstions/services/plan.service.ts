import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Plan } from '../models/plan.entity';
import { SubscriptionService, CreateSubscriptionRequest } from './subscription.service';

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private subscriptionService: SubscriptionService
  ) {}

  getAllPlans(): Observable<Plan[]> {
    const url = `${this.apiUrl}/plans`;
    console.log('URL llamada API getAllPlans:', url);
    return this.http.get<Plan[]>(url).pipe(
      catchError(err => {
        console.error('Error fetching plans:', err);
        return throwError(() => err);
      })
    );
  }

  subscribeToPlan(accountId: string, planId: string): Observable<any> {
    const request: CreateSubscriptionRequest = {
      selectedPlanId: planId
    };
    
    return this.subscriptionService.createSubscription(accountId, request).pipe(
      catchError(err => {
        console.error('Error in plan subscription:', err);
        return throwError(() => err);
      })
    );
  }

  subscribeToPlanWithPayment(accountId: string, planId: string): void {
    this.getAccountSubscription(accountId).subscribe({
      next: (existingSubscription) => {
        if (existingSubscription && existingSubscription.status !== 'CANCELLED') {
          console.error('Account already has an active subscription:', existingSubscription);
          alert('Esta cuenta ya tiene una suscripción activa. Por favor, cancele la suscripción actual antes de crear una nueva.');
          return;
        }
        
        this.subscribeToPlan(accountId, planId).subscribe({
          next: (subscription) => {
            console.log('Suscripción creada:', subscription);
            this.subscriptionService.processSubscriptionWithPayPal(subscription);
          },
          error: (err) => {
            console.error('Error al suscribirse al plan:', err);
            
            if (err.name === 'SubscriptionConflictError') {
              alert(err.message);
            } else {
              alert('Error al crear la suscripción. Por favor, intente nuevamente.');
            }
          }
        });
      },
      error: (err) => {
        if (err.status === 404) {
          console.log('No existing subscription found, proceeding with new subscription');
          this.subscribeToPlan(accountId, planId).subscribe({
            next: (subscription) => {
              console.log('Suscripción creada:', subscription);
              this.subscriptionService.processSubscriptionWithPayPal(subscription);
            },
            error: (subscriptionErr) => {
              console.error('Error al suscribirse al plan:', subscriptionErr);
              
              if (subscriptionErr.name === 'SubscriptionConflictError') {
                alert(subscriptionErr.message);
              } else {
                alert('Error al crear la suscripción. Por favor, intente nuevamente.');
              }
            }
          });
        } else {
          console.error('Error checking existing subscription:', err);
          alert('Error al verificar la suscripción existente. Por favor, intente nuevamente.');
        }
      }
    });
  }

  getAccountSubscription(accountId: string): Observable<any> {
    return this.subscriptionService.getSubscriptionByAccountId(accountId);
  }
}