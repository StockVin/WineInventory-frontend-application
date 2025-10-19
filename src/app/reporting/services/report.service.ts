import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { Report } from '../models/report.entity';
import { environment } from '../../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportService extends BaseService<Report> {
  protected override serverBaseUrl = environment.baseServerUrl;
  protected override resourceEndpoint = environment.reportsEndpointPath;

  public override create(resource: Report): Observable<Report> {
    const url = `${environment.baseServerUrl}${environment.reportsEndpointPath}`;
    console.log('ReportService.create URL:', url);

    return this.http.post<Report>(url, resource, this.httpOptions)
      .pipe(
        retry(2),
        catchError((error: HttpErrorResponse) => {
          console.error('Error creating report:', error);
          const serverMessage = (error?.error?.message)
            || (typeof error?.error === 'string' ? error.error : '')
            || 'Something bad happened; please try again later.';
          return throwError(() => new Error(serverMessage));
        })
      );
  }

  public override delete(id: any): Observable<any> {
    const url = `${environment.baseServerUrl}${environment.reportsEndpointPath}/${id}`;
    console.log('ReportService.delete URL:', url);
    return this.http.delete(url, this.httpOptions)
      .pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          console.error('Error deleting report:', error);
          const serverMessage = (error?.error?.message)
            || (typeof error?.error === 'string' ? error.error : '')
            || 'Something bad happened; please try again later.';
          return throwError(() => new Error(serverMessage));
        })
      );
  }
}