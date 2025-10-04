import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { InventoryItem, InventoryItemProps } from '../models/inventory.entity'; 

// Opcional: Interfaz para los datos de salida
export interface OutputRegisterData {
    productId: string;
    outputType: string;
    quantity: number;
    // Agrega cualquier otro campo del formulario de salida
}

@Injectable({ providedIn: 'root' })
export class InventoryService {
    private readonly apiUrl = 'http://localhost:3000/inventory'; 
    // 💡 Puedes usar un endpoint diferente para el registro de movimientos de salida
    private readonly outputLogUrl = 'http://localhost:3000/output-log'; 

    constructor(private http: HttpClient) { }
    
    /**
     * 💡 MÉTODO REQUERIDO: Obtiene la lista completa de productos.
     * Es el antiguo 'getAllProps', renombrado o usado como alias para el componente RegisterOut.
     */
    public getInventoryList(): Observable<InventoryItemProps[]> {
      return this.getAllProps();
    }
    
    // Mantienes el nombre original si otros componentes lo necesitan
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

    /**
     * 💡 NUEVO MÉTODO: Registra la salida de un producto en el sistema (Fake API).
     * En un entorno real, esto haría una llamada a un endpoint de movimientos/transacciones
     * y posiblemente también haría un PATCH/PUT al inventario para actualizar el stock.
     */
    public registerOutput(outputData: OutputRegisterData): Observable<any> {
        console.log('Llamada a API simulada: Registrar salida:', outputData);
        
        // Simulación 1: POST al log de movimientos
        // Esto crea un nuevo registro en tu db.json bajo la colección 'output-log'.
        return this.http.post<any>(this.outputLogUrl, {
            ...outputData,
            timestamp: new Date().toISOString()
        });
        
        // Simulación 2 (Más completa, si quieres actualizar el stock):
        // En un sistema real, después del POST, harías un PATCH/PUT al producto.
        /*
        return this.http.get<InventoryItemProps>(`${this.apiUrl}/${outputData.productId}`).pipe(
            switchMap(product => {
                const newStock = product.currentStock - outputData.quantity;
                
                // Actualiza el stock en la Fake API
                return this.http.patch<any>(`${this.apiUrl}/${outputData.productId}`, { currentStock: newStock });
            })
        );
        */
    }
}