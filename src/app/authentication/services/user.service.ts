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
  private readonly httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private currentUser: any = null;

  constructor(private http: HttpClient) {
    this.loadCurrentUser();
  }

  login(email: string, password: string): Observable<boolean> {
    const payload = {
      username: email,
      password
    };

    return this.http.post<any>(`${this.backendApi}/sign-in`, payload, this.httpOptions).pipe(
      tap(response => {
        const userData = response?.data ?? response ?? {};
        const token = userData?.token ?? response?.token;

        this.currentUser = userData;

        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        if (token) {
          localStorage.setItem('token', token);
        }
      }),
      map(() => true)
    );
  }
  register(data: { name: string; email: string; password: string; confirmPassword: string; role: string }): Observable<any> {
    const userPayload = {
      username: data.name,
      email: data.email,
      password: data.password,
      validationPassword: data.confirmPassword,
      role: data.role
    };

    return this.http.post<any>(`${this.backendApi}/sign-up`, userPayload);
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
      confirmPassword: 'test123',
      role: 'PRODUCER'
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