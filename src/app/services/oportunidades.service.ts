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

  getOportunidades(filters: Partial<Oportunidade>): Observable<any[]> {
    let url = environment.URL_API + '/api/oportunidades';

    // Se houver filtros, construir a query string dinamicamente
    if (filters && Object.keys(filters).length > 0) {
      const queryParams = Object.entries(filters)
        .filter(([_, value]) => value !== '' && value !== null && value !== undefined) // Ignora valores vazios ou nulos
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join('&');

      url += `?${queryParams}`;
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
