import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class MetasEmpresaService {

  constructor(private http: HttpClient) { }

  getMetas(filterYear: string, filterMonth?: string): Observable<any[]> {
    let url = `${environment.URL_API}/api/metas-empresa`;

    if(filterYear !== ""){
      url += `?year=${filterYear}`;
    }

    if (filterMonth !== '') {
      url += (filterYear !== '') ? `&month=${filterMonth}` : `?month=${filterMonth}`;
    }
    return this.http.get<any[]>(url);
  }

  setMeta(novaMeta: any) {
    return this.http.post(`${environment.URL_API}/api/metas-empresa`, novaMeta);
  }

  updateMeta(idMeta: string, metaEditada: any) {
    return this.http.put(`${environment.URL_API}/api/metas-empresa/${idMeta}`, metaEditada);
  }

  deleteMeta(idMeta: string) {
    return this.http.delete(`${environment.URL_API}/api/metas-empresa/${idMeta}`);
  }
}
