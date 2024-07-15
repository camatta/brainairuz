import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Oportunidade } from '../types/oportunidade';

@Injectable({
  providedIn: 'root'
})

export class OportunidadesService {

  constructor(private http: HttpClient) { }

  getOportunidades(): Observable<any[]> {
    return this.http.get<Oportunidade[]>(environment.URL_API + '/api/oportunidades');
  }

  setOportunidade(oportunidade: Oportunidade) {
    return this.http.post<Oportunidade>(environment.URL_API + '/api/oportunidades', oportunidade);
  }

  updateOportunidade(id: string, oportunidade: Oportunidade) {
    return this.http.put<Oportunidade>(environment.URL_API + `/api/oportunidades/${id}`, oportunidade);
  }
}
