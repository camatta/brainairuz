import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Comissao } from '../types/comissao';

@Injectable({
  providedIn: 'root'
})

export class MetasCsService {

  constructor(private http: HttpClient) { }

  getMetasCs(currentUser: string, filterMonth: string, filterYear: string, vendedor?: string): Observable<any[]> {
    let url = environment.URL_API + '/api/metas-cs';

    if (currentUser === 'adm') {
      if(filterYear !== ''){
        url += `?year=${filterYear}`
      }
      if (filterMonth !== '') {
        url += (filterYear !== '') ? `&month=${filterMonth}` : `?month=${filterMonth}`;
      }
      if(vendedor !== undefined) {
        if(vendedor !== '') {
          url += (filterMonth !== '') || (filterYear !== '') ? `&cs=${vendedor}` : `?cs=${vendedor}`;
        }
      }
    } else {
      url += `?user=${currentUser}`;
      if (filterYear !== '') {
        url += `&year=${filterYear}`;
      }
      if (filterMonth !== '') {
        url += (filterYear !== '') ? `&month=${filterMonth}` : `&month=${filterMonth}`;
    }
    }
    return this.http.get<any[]>(url);
  }

  setMetaCs(novaMeta: any) {
    return this.http.post(`${environment.URL_API}/api/metas-cs`, novaMeta);
  }

  updateMetaCs(idMeta: string, metaEditada: any) {
    return this.http.put(`${environment.URL_API}/api/metas-cs/${idMeta}`, metaEditada);
  }

  deleteMetaCs(idMeta: string) {
    return this.http.delete(`${environment.URL_API}/api/metas-cs/${idMeta}`);
  }
}
