
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin, throwError, catchError, map, of } from 'rxjs';
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

  private readonly profileEndpoint = `${environment.baseServerUrl}/profile`;
  private readonly plansEndpoint = `${environment.baseServerUrl}/plans`;
  private readonly benefitsEndpoint = `${environment.baseServerUrl}/premiumBenefits`;
  private readonly profileId = 'us-001';

  private readonly profileSubject = new BehaviorSubject<Profile | null>(null);
  private readonly plansSubject = new BehaviorSubject<SubscriptionPlan[]>([]);
  private readonly benefitsSubject = new BehaviorSubject<string[]>([]);

  setProfileId(profileId: string): void {
    (this as any).profileId = profileId;
  }

  private getStoredUser(): any | null {
    try {
      const raw = localStorage.getItem('currentUser');
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  private buildProfileFromUser(userData: any): Profile {
    const normalizedData = userData?.data ?? userData;
    const account = normalizedData?.account ?? {};
    const username = normalizedData?.username || account?.username || '';
    const fullName = normalizedData?.fullName || normalizedData?.name || account?.name || username;
    const email = normalizedData?.email || account?.email || '';
    const role = normalizedData?.role || account?.role || '';
    const resolvedId =
      account?.accountId ??
      normalizedData?.accountId ??
      account?.id ??
      normalizedData?.id ??
      (username || 'profile');
    return {
      id: resolvedId.toString(),
      fullName,
      email,
      username,
      phone: '',
      location: '',
      role,
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
    const token = localStorage.getItem('token');
    if (!token) {
      const fallbackUser = this.getStoredUser();
      if (fallbackUser) {
        const profile = this.buildProfileFromUser(fallbackUser);
        this.profileSubject.next(profile);
        return of(profile);
      }
    }

    const getOptions = token ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}`, Accept: 'application/json' }) } : {};
    return this.http.get<any>(this.profileEndpoint, getOptions).pipe(
      map((userData: any) => this.buildProfileFromUser(userData)),
      tap({
        next: (profile: Profile) => {
          this.profileSubject.next(profile);
        }
      }),
      catchError((error: any) => {
        if (error?.status === 404 || error?.status === 401 || error?.status === 403) {
          const fallbackUser = this.getStoredUser();
          if (fallbackUser) {
            const profile = this.buildProfileFromUser(fallbackUser);
            this.profileSubject.next(profile);
            return of(profile);
          }
        }
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
    return of([]);
  }

  refreshAll(): Observable<{ profile: Profile; plans: SubscriptionPlan[]; benefits: string[] }> {
    return forkJoin({
      profile: this.refreshProfile(),
      plans: this.refreshPlans(),
      benefits: this.refreshBenefits()
    });
  }

  updateProfile(changes: ProfileUpdateInput & { currentPassword?: string; newPassword?: string; confirmPassword?: string }): Observable<Profile> {
    if (!changes || typeof changes !== 'object') {
      return throwError(() => new Error('Los cambios proporcionados no son válidos.'));
    }

    const currentProfile = this.profileSubject.getValue();

    const username = (changes.username ?? currentProfile?.username ?? '').trim();
    const email = (changes.email ?? currentProfile?.email ?? '').trim();
    const role = (changes.role ?? currentProfile?.role ?? 'PRODUCER').trim();
    const newPassword = changes.newPassword?.trim();
    const confirmPassword = changes.confirmPassword?.trim();
    const currentPassword = changes.currentPassword?.trim();

    const payloadEntries = [
      ['username', username],
      ['email', email],
      ['role', role]
    ].filter(([_, value]) => value !== undefined && value !== null && value !== '');

    if (newPassword || confirmPassword || currentPassword) {
      payloadEntries.push(['password', newPassword || currentPassword || '']);
      payloadEntries.push(['validationPassword', confirmPassword || newPassword || currentPassword || '']);
    }

    const payload = Object.fromEntries(payloadEntries);
    console.log('PUT /profile payload:', payload, 'URL:', this.profileEndpoint);

    const token = localStorage.getItem('token');
    const options = token
      ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }) }
      : { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return this.http.put<any>(this.profileEndpoint, payload, options).pipe(
      tap({
        next: (response: any) => {
          const updatedFromApi = this.buildProfileFromUser(response);
          const merged: Profile = {
            ...(currentProfile ?? updatedFromApi),
            ...updatedFromApi,
            username: (username || updatedFromApi.username || currentProfile?.username || '').trim(),
            email: (email || updatedFromApi.email || currentProfile?.email || '').trim(),
            role: (role || updatedFromApi.role || currentProfile?.role || 'PRODUCER').trim(),
            fullName: ((changes.fullName ?? updatedFromApi.fullName ?? currentProfile?.fullName) ?? '').toString(),
            phone: ((changes.phone ?? updatedFromApi.phone ?? currentProfile?.phone) ?? '').toString(),
            location: ((changes.location ?? updatedFromApi.location ?? currentProfile?.location) ?? '').toString(),
            lastUpdated: new Date().toISOString()
          };

          this.profileSubject.next(merged);

          try {
            const raw = localStorage.getItem('currentUser');
            const stored = raw ? JSON.parse(raw) : {};
            const updatedStored = {
              ...stored,
              id: merged.id,
              username: merged.username,
              email: merged.email,
              role: merged.role
            };
            localStorage.setItem('currentUser', JSON.stringify(updatedStored));
          } catch {}
        },
        error: (error: any) => console.error('No se pudo actualizar el perfil.', error)
      }),
      catchError((error: any) => {
        console.error('Error en updateProfile (PUT /profile):', error);
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

    const selectedPlan = plans.find(plan => plan.planId === planId);
    if (!selectedPlan) {
      return profile.accountStatus;
    }

    return {
      ...profile.accountStatus,
      planName: selectedPlan.planType,
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
