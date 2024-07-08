import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class MetasService {

  constructor(private http: HttpClient) { }

  getMetas(vendedor: string, filterYear: string): Observable<any[]> {
    if(filterYear !== undefined) {
      return this.http.get<any[]>(`${environment.URL_API}/api/metas?vendedor=${vendedor}&year=${filterYear}`);
    } else {
      return this.http.get<any[]>(`${environment.URL_API}/api/metas?vendedor=${vendedor}`);
    }
  }

  setMeta(novaMeta: any) {
    return this.http.post(`${environment.URL_API}/api/metas`, novaMeta);
  }

  updateMeta(idMeta: string, metaEditada: any) {
    return this.http.put(`${environment.URL_API}/api/metas/${idMeta}`, metaEditada);
  }

  deleteMeta(idMeta: string) {
    return this.http.delete(`${environment.URL_API}/api/metas/${idMeta}`);
  }
}
