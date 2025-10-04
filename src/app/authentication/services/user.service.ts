import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import {Observable, of, delay, switchMap, map, throwError, catchError} from 'rxjs';

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

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<boolean> {
    const url = `${this.baseUrl}${this.usersEndpoint}?username=${username}&password=${password}`;

    return this.http.get<any[]>(url).pipe(
      switchMap(users => {
        if (users.length === 0) return of(false).pipe(delay(500));

        const user = users[0];
        const token = user.token;

        return this.http
          .get<Profile[]>(`${this.baseUrl}${this.profilesEndpoint}?id=${user.profileId}`)
          .pipe(
            switchMap(profiles => {
              if (profiles.length === 0) return throwError(() => new Error('Perfil no encontrado'));
              const profile = profiles[0];

              return this.http
                .get<Account[]>(`${this.baseUrl}${this.accountsEndpoint}?userOwnerId=${user.id}`)
                .pipe(
                  map(accounts => {
                    const account = accounts[0] ?? null;

                    this.currentUser = {
                      ...user,
                      profile,
                      account,
                      role: account?.role || profile.role
                    };

                    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                    localStorage.setItem('token', token); // Se guarda el token ya existente
                    return true;
                  })
                );
            })
          );
      })
    );
  }

  register(data: { name: string; email: string; password: string; role: string }): Observable<any> {
    const userPayload = { username: data.email, password: data.password };

    return this.http.post<any>(`${this.baseUrl}${this.usersEndpoint}`, userPayload).pipe(
      switchMap(newUser =>
        this.http.post<Profile>(`${this.baseUrl}${this.profilesEndpoint}`, {
          id: newUser.id,
          profileId: newUser.id,
          name: data.name,
          email: data.email,
          role: data.role
        }).pipe(
          switchMap(() =>
            this.http.patch<any>(`${this.baseUrl}${this.usersEndpoint}/${newUser.id}`, {
              profileId: newUser.id
            })
          ),
          switchMap(() =>
            this.http.post<Account>(`${this.baseUrl}${this.accountsEndpoint}`, {
              id: newUser.id,
              userOwnerId: newUser.id,
              role: data.role,
              businessName: data.name + ' Business',
              name: data.name,
              email: data.email
            })
          )
        )
      )
    );
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUser = null;
  }

  private initFromStorage(): void {
    if (!this.currentUser) {
      const saved = localStorage.getItem('currentUser');
      this.currentUser = saved ? JSON.parse(saved) : null;
    }
  }

  getCurrentUser() {
    this.initFromStorage();
    return this.currentUser;
  }

  getCurrentUserProfile(): Profile | null {
    return this.getCurrentUser()?.profile ?? null;
  }

  getCurrentUserAccount(): Account | null {
    return this.getCurrentUser()?.account ?? null;
  }

  getProfileByEmail(email: string): Observable<Profile | null> {
    const params = new HttpParams().set('email', email);
    return this.http
      .get<Profile[]>(`${this.baseUrl}${this.profilesEndpoint}`, { params })
      .pipe(map(p => p[0] ?? null));
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

  getAccountById(accountId: number): Observable<Account | null> {
    return this.http
      .get<Account>(`${this.baseUrl}${this.accountsEndpoint}/${accountId}`)
      .pipe(map(a => a ?? null));
  }
}