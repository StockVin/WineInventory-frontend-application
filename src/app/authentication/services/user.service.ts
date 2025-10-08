import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable, of, delay, switchMap, map, throwError, catchError, tap } from 'rxjs';

import { Profile } from '../../profile/models/profile.entity';
import { Account } from '../../plans-subcripstions/models/account.entity';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly baseUrl = environment.apiUrl;
  private readonly backendApi = environment.baseServerUrl;
  private readonly usersEndpoint = environment.userEndpointPath;
  private readonly profilesEndpoint = environment.profileEndpointPath;
  private readonly accountsEndpoint = environment.accountsEndpointPath;

  private currentUser: any = null;

  constructor(private http: HttpClient) {
    this.loadCurrentUser();
  }

  login(email: string, password: string): Observable<boolean> {
    const url = `${this.baseUrl}${this.usersEndpoint}?email=${email}&password=${password}`;

    return this.http.get<any[]>(url).pipe(
      map(users => {
        if (users.length === 0) return false;

        const user = users[0];
        const token = user.token || 'mock-token-' + Date.now();

        this.currentUser = {
          ...user,
          account: null,
          profileId: null,
          role: user.role
        };

        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        localStorage.setItem('token', token);
        return true;
      })
    );
  }
  register(data: { name: string; email: string; password: string; role: string }): Observable<any> {
    const currentDate = new Date().toISOString();
    const userPayload = {
      username: data.name,
      password: data.password,
      email: data.email,
      role: data.role,
      createdAt: currentDate,
      updatedAt: currentDate,
      isActive: true
    };

    const checkUrl = `${this.baseUrl}${this.usersEndpoint}?email=${encodeURIComponent(data.email)}`;
    return this.http.get<any[]>(checkUrl).pipe(
      switchMap(existing => {
        if (existing && existing.length > 0) {
          return throwError(() => ({ status: 409, message: 'Email already exists' }));
        }
        return this.http.post<any>(`${this.baseUrl}${this.usersEndpoint}`, userPayload);
      })
    );
  }

  loadCurrentUser() {
    const currentUserData = localStorage.getItem('currentUser');
    const token = localStorage.getItem('token');

    if (token && currentUserData) {
      try {
        const user = JSON.parse(currentUserData);
        this.currentUser = user;
        console.log('Usuario cargado desde localStorage:', user);
      } catch (error) {
        console.error('Error parsing currentUser from localStorage:', error);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        this.currentUser = null;
      }
    } else {
      this.currentUser = null;
    }
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getCurrentUserProfile(): Profile | null {
    const user = this.getCurrentUser();
    if (!user || !user.account) return null;

    const account = user.account;
    return {
      id: account.id,
      fullName: account.name || user.username,
      role: user.role,
      email: account.email,
      phone: '',
      location: '',
      username: user.username,
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

  getCurrentUserAccount(): Account | null {
    return this.getCurrentUser()?.account ?? null;
  }

  getProfileByEmail(email: string): Observable<Account | null> {
    const params = new HttpParams().set('email', email);
    return this.http
      .get<Account[]>(`${this.baseUrl}${this.accountsEndpoint}`, { params })
      .pipe(map(a => a[0] ?? null));
  }

  getAccountByEmail(email: string): Observable<Account | null> {
    const params = new HttpParams().set('email', email);

    return this.http
      .get<Account>(`${this.backendApi}${this.accountsEndpoint}`, { params })
      .pipe(
        catchError((err: { status: number; }) => {
          if (err.status === 404) return of(null);
          throw err;
        })
      );
  }

  /**
   *  Test method to verify user registration
   */
  testRegistration(): Observable<any> {
    const testData = {
      name: 'Usuario de Prueba',
      email: 'test@example.com',
      password: 'test123',
      role: 'USER'
    };

    return this.register(testData).pipe(
      tap(result => console.log('Usuario registrado exitosamente:', result)),
      catchError(error => {
        console.error('Error en el registro:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Test method to verify user registration
   */
  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}${this.usersEndpoint}/${id}`);
  }

  /**
   * Test method to verify user registration
   */
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}${this.usersEndpoint}`);
  }
}