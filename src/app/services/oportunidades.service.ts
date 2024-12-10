import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Oportunidade } from '../types/oportunidade';

@Injectable({
  providedIn: 'root'
})

export class OportunidadesService {

  constructor(private http: HttpClient) { }

  getOportunidades(filterStatus: string, filterMonth: string, filterYear: string): Observable<any[]> {
    let url = environment.URL_API + '/api/oportunidades';

    if(filterStatus){
      url += `?status=${filterStatus}`
    }
    if (filterMonth) {
      url += filterStatus ? `&month=${filterMonth}` : `?month=${filterMonth}`;
    }
    if(filterYear) {
      url += filterStatus || filterMonth ? `&year=${filterYear}` : `?year=${filterYear}`;
    }

    return this.http.get<Oportunidade[]>(url);
  }

  setOportunidade(oportunidade: Oportunidade) {
    return this.http.post<Oportunidade>(environment.URL_API + '/api/oportunidades', oportunidade);
  }

  updateOportunidade(id: string, oportunidade: Oportunidade) {
    return this.http.put<Oportunidade>(environment.URL_API + `/api/oportunidades/${id}`, oportunidade);
  }
}
