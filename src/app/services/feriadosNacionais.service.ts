import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

type DataFeriados = {
  date: string;
  name: string;
  type: string;
};

@Injectable({
  providedIn: 'root'
})

export class FeriadosNacionais {

  constructor(private http: HttpClient) { }

  getFeriadosNacionais(year: number): Observable<any[]> {
    const url = `https://brasilapi.com.br/api/feriados/v1/${year}`;
    return this.http.get<DataFeriados[]>(url);
  }
}
