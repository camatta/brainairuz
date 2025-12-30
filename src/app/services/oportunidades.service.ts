import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, finalize, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Oportunidade } from '../types/oportunidade';

@Injectable({ providedIn: 'root' })
export class OportunidadesService {
  
  private _oportunidades = signal<Oportunidade[]>([]);
  private _loading = signal(false);
  private _error = signal<unknown>(null);
  private _filters = signal<Partial<Oportunidade>>({});

  // Expor como read-only (boa prática)
  oportunidades = this._oportunidades.asReadonly();
  loading = this._loading.asReadonly();
  error = this._error.asReadonly();
  filters = this._filters.asReadonly();

  // Exemplo de derivado (computed)
  total = computed(() => this._oportunidades().length);

  constructor(private http: HttpClient) { }

  setFilters(filters: Partial<Oportunidade>) {
    this._filters.set(filters);
  }

  load(filters?: Partial<Oportunidade>) {
    if(filters) this._filters.set(filters);

    const url = environment.URL_API + "/api/oportunidades";
    let params = new HttpParams();

    for(const [key, value] of Object.entries(this._filters())) {
      if(value !== "" && value !== null && value !== undefined) {
        params = params.set(key, String(value));
      }
    }

    this._loading.set(true);
    this._error.set(null);

    this.http.get<Oportunidade[]>(url, { params }).pipe(
      catchError(err => {
        this._error.set(err);
        return of([] as Oportunidade[]);
      }),
      finalize(() => this._loading.set(false))
    ).subscribe(data => this._oportunidades.set(data));
  }

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
