import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Comissao } from '../dashboard/calculo-comissao/interfaceComissao';

@Injectable({
  providedIn: 'root'
})

export class ComissoesService {

  constructor(private http: HttpClient) { }

  getComissoes(filter: string): Observable<any[]> {
    if(filter == "nulo"){
      return this.http.get<any[]>(environment.URL_API + '/api/comissoes');
    } else {
      return this.http.get<any[]>(environment.URL_API + `/api/comissoes/${filter}`);
    }
  }

  setComissao(newComissao: Comissao) {
    return this.http.post<Comissao>(environment.URL_API + '/api/comissao', newComissao);
  }

  deleteComissao(idComissao: string) {
    return this.http.delete<any>(environment.URL_API + `/api/comissoes/${idComissao}`);
  }

  updateComissao(idComissao: string, comissao: Comissao) {
    return this.http.put(environment.URL_API + `/api/comissoes/${idComissao}`, comissao);
  }
}
