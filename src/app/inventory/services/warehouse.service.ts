import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Warehouse } from '../model/warehouse.entity';
import { WarehouseResource } from './warehouse.response';
import { WarehouseAssembler } from './warehouse.assembler';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WarehouseService {
  private apiUrl = environment.baseServerUrl;
  private warehousesEndpoint = environment.accountWarehousesEndpointPath;

  constructor(private http: HttpClient) {}

  getWarehouses(): Observable<Warehouse[]> {
    const accountId = localStorage.getItem('accountId');
    const endpoint = this.warehousesEndpoint.replace('{accountId}', accountId ?? '');
    const url = `${this.apiUrl}${endpoint}`;

    return this.http.get<WarehouseResource[]>(url).pipe(
      map(resources => WarehouseAssembler.toEntitiesFromResources(resources)),
      catchError(error => {
        console.error('Error fetching warehouses:', error);
        return of([]);
      })
    );
  }
  getWarehouseById(warehouseId: number): Observable<Warehouse> {
    return this.getWarehouses().pipe(
      map(warehouses => warehouses.find(w => w.warehouseId === +warehouseId)),
      map(warehouse => {
        if (!warehouse) {
          throw new Error('Warehouse not found');
        }
        return warehouse;
      })
    );
  }

  createWarehouse(formData: FormData): Observable<Warehouse> {
    const accountId = localStorage.getItem('accountId');
    if (!accountId) {
      throw new Error('Account ID not found in local storage');
    }

    const endpoint = environment.accountWarehousesEndpointPath.replace('{accountId}', accountId);
    const url = `${this.apiUrl}${endpoint}`;

    console.log('endpoint backend:', url);

    return this.http.post<Warehouse>(url, formData).pipe(
      map(resource => WarehouseAssembler.toEntityFromResource(resource))
    );
  }

  updateWarehouse(warehouseId: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/warehouses/${warehouseId}`, formData);
  }
}
