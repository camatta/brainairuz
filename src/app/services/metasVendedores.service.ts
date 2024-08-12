import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class MetasVendedoresService {

  constructor(private http: HttpClient) { }

  getMetas(currentUser: string, filterMonth: string, filterYear: string, vendedor?: string): Observable<any[]> {
    let url = environment.URL_API + '/api/metas-vendedores';

    if (currentUser === 'adm') {
      if(filterYear !== ''){
        url += `?year=${filterYear}`
      }
      if (filterMonth !== '') {
        url += (filterYear !== '') ? `&month=${filterMonth}` : `?month=${filterMonth}`;
      }
      if(vendedor !== undefined) {
        if(vendedor !== '') {
          url += (filterMonth !== '') || (filterYear !== '') ? `&vendedor=${vendedor}` : `?vendedor=${vendedor}`;
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

  setMeta(novaMeta: any) {
    return this.http.post(`${environment.URL_API}/api/metas-vendedores`, novaMeta);
  }

  updateMeta(idMeta: string, metaEditada: any) {
    return this.http.put(`${environment.URL_API}/api/metas-vendedores/${idMeta}`, metaEditada);
  }

  deleteMeta(idMeta: string) {
    return this.http.delete(`${environment.URL_API}/api/metas-vendedores/${idMeta}`);
  }
}
