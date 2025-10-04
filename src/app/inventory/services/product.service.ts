import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {BaseService} from '../../shared/services/base.service';
import {Product} from '../model/product.entity';
import {catchError, map, Observable, of, switchMap, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ProductResource} from './product.response';
import {ProductAssembler} from './product.assembler';


@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = environment.baseServerUrl;
  private productsEndpoint = environment.accountProductsEndpointPath;

  constructor(private http: HttpClient) {}


  getProductsByAccountId(): Observable<Product[]> {
    const accountId = localStorage.getItem('accountId');
    const url = `${this.apiUrl}/accounts/${accountId}/products`;

    return this.http.get<ProductResource[]>(url).pipe(
      map(resources => ProductAssembler.toEntitiesFromResources(resources)),
      catchError(error => {
        if (error.status === 404) {
          console.warn('No products found for this account.');
          return of([]);
        }
        console.error('Error fetching products:', error);
        throw error;
      })
    );
  }

  createProduct(productData: any, imageFile: File): Observable<any> {
    const accountId = localStorage.getItem('accountId');
    const endpoint = `${this.apiUrl}/accounts/${accountId}/products`;

    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('liquorType', productData.liquorType);
    formData.append('brandName', productData.brandName);
    formData.append('unitPriceAmount', productData.unitPriceAmount.toString());
    formData.append('minimumStock', productData.minimumStock.toString());
    formData.append('image', imageFile);

    return this.http.post(endpoint, formData);
  }

}
