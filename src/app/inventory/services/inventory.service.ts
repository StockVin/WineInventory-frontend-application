import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { InventoryItem, InventoryItemProps } from '../models/inventory.entity'; 

export interface OutputRegisterData {
    productId: string;
    outputType: string;
    quantity: number;
}

@Injectable({ providedIn: 'root' })
export class InventoryService {
    private readonly apiUrl = 'http://localhost:3000/inventory'; 
    private readonly outputLogUrl = 'http://localhost:3000/output-log'; 

    constructor(private http: HttpClient) { }
    
    public getInventoryList(): Observable<InventoryItemProps[]> {
      return this.getAllProps();
    }
    
    public getAllProps(): Observable<InventoryItemProps[]> {
      return this.http.get<InventoryItemProps[]>(this.apiUrl);
    }
    
    public getById(id: string): Observable<InventoryItemProps> {
      return this.http.get<InventoryItemProps>(`${this.apiUrl}/${id}`);
    }

    public save(item: InventoryItem): Observable<InventoryItem> {
      const props = item.toPrimitives;

      if (props.id && props.id !== '') {
        return this.http.put<InventoryItemProps>(`${this.apiUrl}/${props.id}`, props).pipe(
          map(updatedProps => new InventoryItem(updatedProps))
        );
      } else {
        return this.http.post<InventoryItemProps>(this.apiUrl, props).pipe(
          map(newProps => new InventoryItem(newProps))
        );
      }
    }

    public delete(id: string): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    public registerOutput(outputData: OutputRegisterData): Observable<any> {
        console.log('Registrar salida:', outputData);
        
        return this.http.post<any>(this.outputLogUrl, {
            ...outputData,
            timestamp: new Date().toISOString()
        });
    }
}