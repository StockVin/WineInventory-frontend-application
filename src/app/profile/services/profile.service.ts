
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin, throwError, catchError, map } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { AccountStatus, Profile, ProfileUpdateInput, SubscriptionPlan } from '../models/profile.entity';

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: string;
  businessName?: string;
  businessAddress?: string;
  phone?: string;
  profileId?: number;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly http = inject(HttpClient);

  private readonly profileEndpoint = `${environment.apiUrl}/users`;
  private readonly plansEndpoint = `${environment.apiUrl}/subscriptionPlans`;
  private readonly benefitsEndpoint = `${environment.apiUrl}/premiumBenefits`;
  private readonly profileId = 'us-001';

  private readonly profileSubject = new BehaviorSubject<Profile | null>(null);
  private readonly plansSubject = new BehaviorSubject<SubscriptionPlan[]>([]);
  private readonly benefitsSubject = new BehaviorSubject<string[]>([]);

  setProfileId(profileId: string): void {
    (this as any).profileId = profileId;
  }

  getProfile(): Observable<Profile | null> {
    return this.profileSubject.asObservable();
  }

  getPlans(): Observable<SubscriptionPlan[]> {
    return this.plansSubject.asObservable();
  }

  getPremiumBenefits(): Observable<string[]> {
    return this.benefitsSubject.asObservable();
  }

  refreshProfile(): Observable<Profile> {
    const currentProfileId = (this as any).profileId || 'us-001';
    return this.http.get<any>(`${this.profileEndpoint}/${currentProfileId}`).pipe(
      tap({
        next: (userData: any) => {
          const profile: Profile = {
            id: userData.id?.toString() || currentProfileId,
            fullName: userData.username || '',
            email: userData.email || '',
            username: userData.username || '',
            phone: '',
            location: '',
            role: userData.role || '',
            avatarUrl: '',
            accountStatus: {
              planName: 'Free',
              renewalDate: new Date().toISOString(),
              supportContact: 'soporte@wineinventory.com',
              statusLabel: 'Activo'
            },
            selectedPlanId: 'Free',
            lastUpdated: new Date().toISOString()
          };

          this.profileSubject.next(profile);
        },
        error: (error: any) => console.error('No se pudo cargar el perfil.', error)
      }),
      catchError((error: any) => {
        console.error('Error en refreshProfile:', error);
        return throwError(() => error);
      })
    );
  }

  refreshPlans(): Observable<SubscriptionPlan[]> {
    return this.http.get<SubscriptionPlan[]>(this.plansEndpoint).pipe(
      tap({
        next: plans => this.plansSubject.next(plans),
        error: error => console.error('No se pudieron cargar los planes.', error)
      })
    );
  }

  refreshBenefits(): Observable<string[]> {
    return this.http.get<string[]>(this.benefitsEndpoint).pipe(
      tap({
        next: benefits => this.benefitsSubject.next(benefits),
        error: error => console.error('No se pudieron cargar los beneficios del plan.', error)
      })
    );
  }

  refreshAll(): Observable<{ profile: Profile; plans: SubscriptionPlan[]; benefits: string[] }> {
    return forkJoin({
      profile: this.refreshProfile(),
      plans: this.refreshPlans(),
      benefits: this.refreshBenefits()
    });
  }

  updateProfile(changes: ProfileUpdateInput): Observable<Profile> {
    if (!changes || typeof changes !== 'object') {
      return throwError(() => new Error('Los cambios proporcionados no son válidos.'));
    }

    const currentProfileId = (this as any).profileId || 'us-001';
    return this.http.patch<any>(`${this.profileEndpoint}/${currentProfileId}`, changes).pipe(
      tap({
        next: (profile: any) => {
          const currentProfile = this.profileSubject.getValue();
          const normalizedProfile: Profile = {
            id: profile.id || currentProfileId,
            fullName: profile.fullName || (currentProfile?.fullName || ''),
            email: profile.email || (currentProfile?.email || ''),
            username: profile.username || (currentProfile?.username || ''),
            phone: profile.phone || (currentProfile?.phone || ''),
            location: profile.location || (currentProfile?.location || ''),
            role: profile.role || (currentProfile?.role || ''),
            avatarUrl: profile.avatarUrl || (currentProfile?.avatarUrl || ''),
            accountStatus: profile.accountStatus || (currentProfile?.accountStatus || {
              planName: 'Free',
              renewalDate: new Date().toISOString(),
              supportContact: 'soporte@wineinventory.com',
              statusLabel: 'Activo'
            }),
            selectedPlanId: profile.selectedPlanId || (currentProfile?.selectedPlanId || 'Free'),
            lastUpdated: new Date().toISOString()
          };

          this.profileSubject.next(normalizedProfile);
        },
        error: (error: any) => console.error('No se pudo actualizar el perfil.', error)
      }),
      catchError((error: any) => {
        console.error('Error en updateProfile:', error);
        return throwError(() => error);
      })
    );
  }

  getProfileSnapshot(): Profile | null {
    return this.profileSubject.getValue();
  }

  getPlansSnapshot(): SubscriptionPlan[] {
    return this.plansSubject.getValue();
  }

  getBenefitsSnapshot(): string[] {
    return this.benefitsSubject.getValue();
  }

  buildAccountStatusForPlan(planId: string): AccountStatus | null {
    const profile = this.profileSubject.getValue();
    const plans = this.plansSubject.getValue();
    if (!profile || plans.length === 0) {
      return null;
    }

    const selectedPlan = plans.find(plan => plan.id === planId);
    if (!selectedPlan) {
      return profile.accountStatus;
    }

    return {
      ...profile.accountStatus,
      planName: selectedPlan.name,
      statusLabel: profile.accountStatus.statusLabel || 'Activo'
    };
  }

  getProfileById(profileId: number): Observable<UserProfile> {
    const url = `${environment.apiUrl}/users/${profileId}`;
    console.log('URL llamada API getProfileById:', url);
    return this.http.get<UserProfile>(url).pipe(
      catchError((err: any) => {
        console.error('Error fetching profile:', err);
        return throwError(() => err);
      })
    );
  }

  editProfile(profile: Profile): Observable<Profile> {
    return this.http.put<Profile>(`${environment.apiUrl}/users/${profile.id}`, profile);
  }
}
