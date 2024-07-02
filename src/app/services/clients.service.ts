import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

type Client = {
  _id?: string;
  empresaCnpj: string;
  empresaNome: string;
  empresaIE?: number | "";
  empresaCep: number;
  empresaEndereco: string;
  empresaBairro: string;
  empresaCidade: string;
  empresaEstado: string;
  criado_em: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  constructor(private http: HttpClient) {}

  getClients(): Observable<{clients: Client[], message: string}> {
    return this.http.get<{clients: Client[], message: string}>(`${environment.URL_API}/api/clients`);
  }

  getClientByCnpj(cnpj: string): Observable<{client: Client, message: string}> | Observable<{message: string}> {
    return this.http.get<{client: Client, message: string} | {message: string}>(`${environment.URL_API}/api/clients/${cnpj}`)
  }

  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(`${environment.URL_API}/api/clients`, client);
  }
}