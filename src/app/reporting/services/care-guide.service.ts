import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { CareGuide } from '../models/care-guide.entity';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CareGuideService extends BaseService<CareGuide> {
  protected override resourceEndpoint = environment.careguidesEndpointPath;

  public getCareGuideById(id: number): Observable<CareGuide> {
    const url = `${environment.baseServerUrl}${environment.careguidesEndpointPath}/${id}`;
    return this.http.get<CareGuide>(url, this.httpOptions);
  }

  public addCareGuide(careGuideId: number, payload: FormData): Observable<CareGuide> {
    const url = `${environment.baseServerUrl}${environment.careguidesEndpointPath}/${careGuideId}/careguide`;
    return this.http.post<CareGuide>(url, payload);
  }

  public updateCareGuide(careGuideId: number, payload: Partial<CareGuide>): Observable<CareGuide> {
    const url = `${environment.baseServerUrl}${environment.careguidesEndpointPath}/${careGuideId}`;
    return this.http.put<CareGuide>(url, payload, this.httpOptions);
  }

  public deleteCareGuide(careGuideId: number): Observable<void> {
    const url = `${environment.baseServerUrl}${environment.careguidesEndpointPath}/${careGuideId}`;
    return this.http.delete<void>(url, this.httpOptions);
  }

  public deallocateCareGuide(careGuideId: number): Observable<{ message: string }> {
    const url = `${environment.baseServerUrl}${environment.careguidesEndpointPath}/${careGuideId}/deallocations`;
    return this.http.put<{ message: string }>(url, {}, this.httpOptions);
  }

  public allocateCareGuide(careGuideId: number, productId: number): Observable<{ message: string }> {
    const url = `${environment.baseServerUrl}${environment.careguidesEndpointPath}/${careGuideId}/allocations/${productId}`;
    return this.http.put<{ message: string }>(url, {}, this.httpOptions);
  }
}