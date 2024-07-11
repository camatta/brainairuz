import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class MixProdutosService {

  constructor(private http: HttpClient) { }

  getMixProdutos(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.URL_API}/api/mix-produtos`);
  }

  setMixProduto(novoMixProduto: any) {
    return this.http.post(`${environment.URL_API}/api/mix-produtos`, novoMixProduto);
  }

  updateMixProduto(mixProduto: any, mixProdutoId: string) {
    return this.http.put(`${environment.URL_API}/api/mix-produtos/${mixProdutoId}`, mixProduto);
  }

  deleteMixProduto(idMixProduto: string) {
    return this.http.delete<string>(`${environment.URL_API}/api/mix-produtos/${idMixProduto}`);
  }
}
