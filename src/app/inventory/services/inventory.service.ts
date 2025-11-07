import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, forkJoin, of } from 'rxjs';
import { InventoryItem, InventoryItemProps, LiquorType } from '../models/inventory.entity';
import { environment } from '../../../environments/environment';

export const LIQUOR_TYPE_OPTIONS: { label: LiquorType; value: string }[] = [
    { label: 'Vino', value: 'Wine' },
    { label: 'Destilado', value: 'Whisky' },
    { label: 'Cerveza', value: 'Beer' },
    { label: 'Licores', value: 'Special' },
    { label: 'Licor Anisado', value: 'Herbal' },
];

const DEFAULT_LIQUOR_TYPE_LABEL: LiquorType = LIQUOR_TYPE_OPTIONS[0].label;
const BACKEND_TO_LABEL: Record<string, LiquorType> = {};
const LABEL_TO_BACKEND: Record<LiquorType, string> = {
    'Vino': 'Wine',
    'Destilado': 'Whisky',
    'Cerveza': 'Beer',
    'Licores': 'Special',
    'Licor Anisado': 'Herbal',
};

LIQUOR_TYPE_OPTIONS.forEach(option => {
    BACKEND_TO_LABEL[option.value] = option.label;
});

export const toDisplayLiquorType = (backendType?: string | null): LiquorType => {
    if (!backendType) return DEFAULT_LIQUOR_TYPE_LABEL;
    return BACKEND_TO_LABEL[backendType] ?? DEFAULT_LIQUOR_TYPE_LABEL;
};

export const toBackendLiquorType = (label: LiquorType): string => {
    return LABEL_TO_BACKEND[label] ?? LIQUOR_TYPE_OPTIONS[0].value;
};

export interface OutputRegisterData {
    productId: string;
    quantity: number;
    bestBeforeDate: string;
    reason?: string;
}

export interface Warehouse {
    warehouseId: number;
    name: string;
    street: string;
    city: string;
    district: string;
    postalCode: string;
    country: string;
    maxTemperature: number;
    minTemperature: number;
    capacity: number;
    imageUrl: string;
}

export interface WarehouseProductSummary {
    productId: number;
    name: string;
    brand: string;
    unitPriceAmount: number;
    minimumStock: number;
    currentStock: number;
    status: string;
    bestBeforeDate: string;
}

export interface ProductListItem {
    productId: number;
    liquorType?: string;
    imageUrl?: string;
}

export interface ProductResource {
    id: number;
    imageUrl: string;
    name: string;
    brandName: string;
    liquorType: string;
    unitPriceAmount: number;
    minimumStock: number;
    accountId: number;
}

export interface InventoryRecord {
    inventory_id: number;
    productId: number;
    warehouseId: number;
    bestBeforeDate: string;
    stock: number;
    productState: string;
}

export interface CreateInventoryRequest {
    bestBeforeDate: string;
    quantity: number;
}

export interface AddStockRequest {
    stockBestBeforeDate: string;
    addedQuantity: number;
}

export interface SubtractStockRequest {
    expirationDate: string;
    removedQuantity: number;
}

export interface MoveStockRequest {
    newWarehouseId: number;
    movedStockExpirationDate: string;
    movedQuantity: number;
}

export interface CreateProductPayload {
    name: string;
    liquorType: string;
    brandName: string;
    unitPriceAmount: number;
    minimumStock: number;
    image?: File | null;
}

@Injectable({ providedIn: 'root' })
export class InventoryService {
    private readonly baseUrl = environment.baseServerUrl;
    private readonly warehousesPath = environment.warehousesEndpointPath;
    private readonly accountProductsPath = environment.accountProductsEndpointPath;
    private readonly inventoryPath = '/inventories';
    private readonly outputLogPath = '/output-log';

    constructor(private http: HttpClient) { }
    
    public getInventoryList(): Observable<InventoryItemProps[]> {
      return this.getAllProps();
    }
    
    public getAllProps(): Observable<InventoryItemProps[]> {
      // The backend exposes inventory listing under /warehouses/{warehouseId}/inventories
      // Derive a selected warehouseId from localStorage or fallback to 1
      const storedId = localStorage.getItem('warehouseId');
      const warehouseId = storedId ? Number(storedId) : 1;
      const invUrl = `${this.baseUrl}${this.warehousesPath}/${warehouseId}/inventories`;

      // Also fetch products by account to enrich with liquorType and image
      const accountId = localStorage.getItem('accountId');
      const products$ = accountId
        ? this.getProductsByAccount(Number(accountId))
        : of([] as ProductResource[]);

      return forkJoin({
        inventories: this.http.get<WarehouseProductSummary[]>(invUrl),
        products: products$
      }).pipe(
        map(({ inventories, products }) => {
          const productMap = new Map<number, ProductResource>();
          if (Array.isArray(products)) {
            for (const p of products) {
              if (p?.id != null) {
                productMap.set(p.id, p);
              }
            }
          }

          const toItem = (w: WarehouseProductSummary): InventoryItemProps => {
            const extras = productMap.get(w.productId);
            const backendLiquorType = extras?.liquorType;
            return {
              id: String(w.productId),
              name: w.name,
              type: toDisplayLiquorType(backendLiquorType),
              price: w.unitPriceAmount,
              expirationDate: w.bestBeforeDate ? new Date(w.bestBeforeDate) : undefined,
              currentStock: w.currentStock,
              minStockLevel: w.minimumStock,
              location: 'Almacén general',
              imageUrl: extras?.imageUrl ?? ''
            };
          };

          return inventories.map(toItem);
        })
      );
    }
    
    public getById(id: string): Observable<InventoryItemProps> {
      // Backend does not expose /inventories/{id}; reuse the enriched list and pick by productId
      return this.getAllProps().pipe(
        map(items => {
          const item = items.find(i => i.id === id);
          if (!item) throw new Error('Inventory item not found');
          return item;
        })
      );
    }

    public save(item: InventoryItem): Observable<InventoryItem> {
      const props = item.toPrimitives;

      if (props.id && props.id !== '') {
        return this.http.put<InventoryItemProps>(`${this.baseUrl}${this.inventoryPath}/${props.id}`, props).pipe(
          map(updatedProps => new InventoryItem(updatedProps))
        );
      } else {
        return this.http.post<InventoryItemProps>(`${this.baseUrl}${this.inventoryPath}`, props).pipe(
          map(newProps => new InventoryItem(newProps))
        );
      }
    }

    public delete(id: string): Observable<void> {
      return this.http.delete<void>(`${this.baseUrl}${this.inventoryPath}/${id}`);
    }

    public registerOutput(outputData: OutputRegisterData): Observable<InventoryRecord> {
        const storedWarehouseId = localStorage.getItem('warehouseId');
        const warehouseId = storedWarehouseId ? Number(storedWarehouseId) : 1;
        const productId = Number(outputData.productId);

        const payload: SubtractStockRequest = {
            expirationDate: outputData.bestBeforeDate,
            removedQuantity: outputData.quantity,
        };

        return this.subtractStock(warehouseId, productId, payload);
    }

    public getWarehouses(): Observable<Warehouse[]> {
        const url = `${this.baseUrl}${this.warehousesPath}`;
        return this.http.get<Warehouse[]>(url);
    }

    public getWarehouseById(warehouseId: number): Observable<Warehouse> {
        const url = `${this.baseUrl}${this.warehousesPath}/${warehouseId}`;
        return this.http.get<Warehouse>(url);
    }

    public updateWarehouse(warehouseId: number, data: Partial<Warehouse> & { image?: File | null }): Observable<Warehouse> {
        const url = `${this.baseUrl}${this.warehousesPath}/${warehouseId}`;
        const form = new FormData();
        if (data.name != null) form.append('name', String(data.name));
        if (data.street != null) form.append('street', String(data.street));
        if (data.city != null) form.append('city', String(data.city));
        if (data.district != null) form.append('district', String(data.district));
        if (data.postalCode != null) form.append('postalCode', String(data.postalCode));
        if (data.country != null) form.append('country', String(data.country));
        if (data.maxTemperature != null) form.append('maxTemperature', String(data.maxTemperature));
        if (data.minTemperature != null) form.append('minTemperature', String(data.minTemperature));
        if (data.capacity != null) form.append('capacity', String(data.capacity));
        if (data.image instanceof File) form.append('image', data.image);
        return this.http.put<Warehouse>(url, form);
    }

    public deleteWarehouse(warehouseId: number): Observable<any> {
        const url = `${this.baseUrl}${this.warehousesPath}/${warehouseId}`;
        return this.http.delete<any>(url);
    }

    public getWarehouseProducts(warehouseId: number): Observable<WarehouseProductSummary[]> {
        const url = `${this.baseUrl}${this.warehousesPath}/${warehouseId}/inventories`;
        return this.http.get<WarehouseProductSummary[]>(url);
    }

    public getInventoryByProductAndDate(warehouseId: number, productId: number, expirationDate: string): Observable<InventoryRecord> {
        const url = `${this.baseUrl}${this.warehousesPath}/${warehouseId}/inventories/products/${productId}/expiration-date/${expirationDate}`;
        return this.http.get<InventoryRecord>(url);
    }

    public createInventory(warehouseId: number, productId: number, payload: CreateInventoryRequest): Observable<InventoryRecord> {
        const url = `${this.baseUrl}${this.warehousesPath}/${warehouseId}/inventories/products/${productId}`;
        const token = localStorage.getItem('token');
        const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
        return this.http.post<InventoryRecord>(url, payload, headers ? { headers } : {});
    }

    public getProductsByAccount(accountId: number): Observable<ProductResource[]> {
        const url = `${this.baseUrl}${this.accountProductsPath.replace('{accountId}', String(accountId))}`;
        return this.http.get<ProductResource[]>(url);
    }

    public createProduct(accountId: number, payload: CreateProductPayload): Observable<ProductResource> {
        const url = `${this.baseUrl}${this.accountProductsPath.replace('{accountId}', String(accountId))}`;
        const formData = new FormData();
        formData.append('name', payload.name);
        formData.append('liquorType', payload.liquorType);
        formData.append('brandName', payload.brandName);
        formData.append('unitPriceAmount', String(payload.unitPriceAmount));
        formData.append('minimumStock', String(payload.minimumStock));
        if (payload.image instanceof File) {
            formData.append('image', payload.image);
        }
        return this.http.post<ProductResource>(url, formData);
    }

    public deleteProductFromWarehouse(warehouseId: number, productId: number, bestBeforeDateISO: string): Observable<any> {
        const url = `${this.baseUrl}${this.warehousesPath}/${warehouseId}/inventories/products/${productId}`;
        return this.http.delete<any>(url, { body: bestBeforeDateISO });
    }

    public addStock(warehouseId: number, productId: number, payload: AddStockRequest): Observable<InventoryRecord> {
        const url = `${this.baseUrl}${this.warehousesPath}/${warehouseId}/inventories/products/${productId}/additions`;
        return this.http.put<InventoryRecord>(url, payload);
    }

    public subtractStock(warehouseId: number, productId: number, payload: SubtractStockRequest): Observable<InventoryRecord> {
        const url = `${this.baseUrl}${this.warehousesPath}/${warehouseId}/inventories/products/${productId}/substractions`;
        return this.http.put<InventoryRecord>(url, payload);
    }

    public moveStock(warehouseId: number, productId: number, payload: MoveStockRequest): Observable<InventoryRecord> {
        const url = `${this.baseUrl}${this.warehousesPath}/${warehouseId}/inventories/products/${productId}/moves`;
        return this.http.put<InventoryRecord>(url, payload);
    }
}