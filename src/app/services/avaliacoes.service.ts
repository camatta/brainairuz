import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AvaliacoesService {

  constructor(private http: HttpClient) { }

  getHistoricoAvaliacoesPorUsuario(nomeUsuario: string): Observable<any[]> {
    const params = new HttpParams().set('nomeUsuario', nomeUsuario);
    return this.http.get<any[]>(environment.URL_API + '/api/avaliacoes', { params });
  }
}
