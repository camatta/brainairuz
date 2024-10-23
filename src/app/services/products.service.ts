import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Produtos } from '../dashboard/tabela-valores/interfaceProdutos';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private http: HttpClient) {}

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(environment.URL_API + '/api/products');
  }

  getGroupProducts(): Observable<any[]> {
    return this.http.get<any[]>(environment.URL_API + '/api/group-products');
  }

  setProduct(newProduct: Produtos) {
    return this.http.post<Produtos>(
      environment.URL_API + '/api/products',
      newProduct
    );
  }

  deleteProduct(idProduct: string): Observable<any> {
    return this.http.delete<any>(
      environment.URL_API + `/api/products/${idProduct}`
    );
  }

  updateProduct(idProduct: string, produto: Produtos) {
    return this.http.put(
      environment.URL_API + `/api/products/${idProduct}`,
      produto
    );
  }

  getMarkup(grupo_markup: number): { maxMarkup: number; minMarkup: number } {
    let maxMarkup = 0;
    let minMarkup = 0;

    switch (grupo_markup) {
      case 1:
        maxMarkup = 2;
        minMarkup = 1.6;

        return {
          maxMarkup,
          minMarkup,
        };

      case 2:
        maxMarkup = 2;
        minMarkup = 1.7;

        return {
          maxMarkup,
          minMarkup,
        };

      case 3:
        maxMarkup = 2;
        minMarkup = 1.8;

        return {
          maxMarkup,
          minMarkup,
        };

      case 4:
        maxMarkup = 2.5;
        minMarkup = 1.7;

        return {
          maxMarkup,
          minMarkup,
        };

      case 5:
        maxMarkup = 3;
        minMarkup = 1.7;

        return {
          maxMarkup,
          minMarkup,
        };

      case 6:
        maxMarkup = 3.5;
        minMarkup = 1.7;

        return {
          maxMarkup,
          minMarkup,
        };

      case 7:
        maxMarkup = 2;
        minMarkup = 2;

        return {
          maxMarkup,
          minMarkup,
        };

      case 8:
        maxMarkup = 3;
        minMarkup = 2;

        return {
          maxMarkup,
          minMarkup,
        };

      case 9:
        maxMarkup = 3.5;
        minMarkup = 2;

        return {
          maxMarkup,
          minMarkup,
        };

      case 10:
        maxMarkup = 6.15;
        minMarkup = 3.5;

        return {
          maxMarkup,
          minMarkup,
        };

      case 11:
        maxMarkup = 1.9;
        minMarkup = 1.9;

        return {
          maxMarkup,
          minMarkup,
        };

      default:
        return {
          maxMarkup,
          minMarkup,
        };
    }
  }
}
