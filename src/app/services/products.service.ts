import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Produtos } from '../dashboard/tabela-valores/interfaceProdutos';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(environment.URL_API + '/api/products');
  }

  getGroupProducts(): Observable<any[]> {
    return this.http.get<any[]>(environment.URL_API + '/api/group-products');
  }

  setProduct(newProduct: Produtos) {
    return this.http.post<Produtos>(environment.URL_API + '/api/products', newProduct);
  }

  deleteProduct(idProduct: string): Observable<any> {
    return this.http.delete<any>(environment.URL_API + `/api/products/${idProduct}`);
  }

  updateProduct(idProduct: string, produto: Produtos) {
    return this.http.put(environment.URL_API + `/api/products/${idProduct}`, produto);
  }

}
