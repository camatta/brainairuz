import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Comissao } from '../types/comissao'; 

@Injectable({
  providedIn: 'root'
})

export class ComissoesService {

  constructor(private http: HttpClient) { }

  getComissoes(currentUser: string, filterMonth: string, filterYear: string, vendedor?: string): Observable<any[]> {
    let url = environment.URL_API + '/api/comissoes';

    if (currentUser === 'adm') {
      if(filterYear !== 'sem filtro'){
        url += `?year=${filterYear}`
      }
      if (filterMonth !== 'sem filtro') {
        url += (filterYear !== 'sem filtro') ? `&month=${filterMonth}` : `?month=${filterMonth}`;
      }
      if(vendedor !== 'sem filtro') {
        if(vendedor !== undefined) {
          url += (filterMonth !== 'sem filtro') || (filterYear !== 'sem filtro') ? `&vendedor=${vendedor}` : `?vendedor=${vendedor}`;
        }
      }
    } else {
      url += `?user=${currentUser}`;
      if (filterYear !== 'sem filtro') {
        url += `&year=${filterYear}`;
      }
      if (filterMonth !== 'sem filtro') {
        url += (filterYear !== 'sem filtro') ? `&month=${filterMonth}` : `&month=${filterMonth}`;
      }
    }
    return this.http.get<any[]>(url);
  }

  setComissao(newComissao: FormData) {
    return this.http.post<FormData>(environment.URL_API + '/api/comissao', newComissao);
  }

  deleteComissao(idComissao: string) {
    return this.http.delete<any>(environment.URL_API + `/api/comissoes/${idComissao}`);
  }

  updateComissao(idComissao: string, comissao: FormData) {
    return this.http.put(environment.URL_API + `/api/comissoes/${idComissao}`, comissao);
  }
}
