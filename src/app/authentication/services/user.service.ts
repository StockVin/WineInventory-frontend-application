import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import {Observable, of, delay, switchMap, map, throwError, catchError} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly baseUrl = environment.apiUrl;
  private readonly backendApi = environment.baseServerUrl;
  private readonly userEndpointPath = environment.userEndpointPath;
  private currentUser: any = null;

  constructor(private http: HttpClient) {
    this.loadCurrentUser();
  }

  private loadCurrentUser() {
    const token = localStorage.getItem('token');
    if (token) {
      this.http.get(`${this.backendApi}/${this.userEndpointPath}/current-user`, {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      })
        .subscribe((user: any) => { 
          this.currentUser = user;
        });
    }
    else {
      this.currentUser = null;
    }
  }

  getCurrentUser(): any {
    return this.currentUser;
  }
}