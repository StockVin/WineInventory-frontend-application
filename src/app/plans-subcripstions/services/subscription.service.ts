import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Subscription {
  subscriptionId: string;
  planId: string;
  status: string;
  expirationDate: string;
  planType: string;
  paymentFrequency: string;
  maxProducts: number;
  preferenceId: string | null;
  initPoint: string | null;
  message: string;
}

export interface CreateSubscriptionRequest {
  selectedPlanId: string;
}

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getSubscriptionByAccountId(accountId: string): Observable<Subscription> {
    const url = `${this.apiUrl}/accounts/${accountId}/subscriptions`;
    console.log('URL llamada API getSubscriptionByAccountId:', url);
    return this.http.get<Subscription>(url).pipe(
      catchError(err => {
        console.error('Error fetching subscription:', err);
        return throwError(() => err);
      })
    );
  }

  createSubscription(accountId: string, request: CreateSubscriptionRequest): Observable<Subscription> {
    const url = `${this.apiUrl}/accounts/${accountId}/subscriptions`;
    console.log('URL llamada API createSubscription:', url);
    console.log('Request body:', request);
    console.log('AccountId:', accountId);
    console.log('SelectedPlanId:', request.selectedPlanId);
    
    return this.http.post<Subscription>(url, request).pipe(
      catchError(err => {
        console.error('Error creating subscription:', err);
        console.error('Error status:', err.status);
        console.error('Error message:', err.message);
        
        if (err.status === 400) {
          console.error('Bad Request - Possible issues:');
          console.error('- AccountId format or validity:', accountId);
          console.error('- PlanId existence:', request.selectedPlanId);
          console.error('- Request body format:', request);
          
          if (err.error && typeof err.error === 'object') {
            console.error('Error details:', err.error);
          }
        }
        
        if (err.status === 409) {
          console.error('Conflict - Account already has an active subscription');
          console.error('Account ID:', accountId);
          console.error('Attempted Plan ID:', request.selectedPlanId);
          
          const conflictError = new Error('Esta cuenta ya tiene una suscripción activa. Por favor, cancele la suscripción actual antes de crear una nueva.');
          conflictError.name = 'SubscriptionConflictError';
          return throwError(() => conflictError);
        }
        
        return throwError(() => err);
      })
    );
  }

  processSubscriptionWithPayPal(subscription: Subscription): void {
    if (subscription.initPoint) {
      console.log('Redirigiendo a PayPal checkout:', subscription.initPoint);
      window.open(subscription.initPoint, '_blank');
    } else if (subscription.preferenceId) {
      console.log('Procesando pago con preferenceId:', subscription.preferenceId);
      this.openPaymentModal(subscription.preferenceId);
    } else {
      console.log('Suscripción creada sin redirección de pago:', subscription.message);
    }
  }

  private openPaymentModal(preferenceId: string): void {
    console.log('Abriendo modal de pago para preferenceId:', preferenceId);
  }
}
