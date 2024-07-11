import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "src/environments/environment";
import { type Contract } from "../dashboard/contratos/contract.model";
import { type Author } from "../dashboard/contratos/author.model";

const API_URL = environment.URL_API;

@Injectable({
  providedIn: 'root'
})
export class ContractsService {
  constructor(private http: HttpClient) {}

  getContracts(): Observable<{ contracts: Contract[] }> {
    return this.http.get<{ contracts: Contract[] }>(`${API_URL}/api/contracts`);
  }

  getContractById(id: string): Observable<{ contract: Contract }> {
    return this.http.get<{ contract: Contract }>(`${API_URL}/api/contracts/${id}`);
  }

  createContract( newContract: Contract ): Observable<Contract> {
    return this.http.post<Contract>(`${API_URL}/api/contracts`, {contract: newContract});
  }

  deleteContract(contractId: string): Observable<{ deletedContract: Contract, message: string }> {
    return this.http.delete<{ deletedContract: Contract, message: string }>(`${API_URL}/api/contracts/${contractId}`);
  }

  editContract(_id: string, contractToEdit: Contract): Observable<{ updatedContract: Contract, message: string }> {
    return this.http.put<{ updatedContract: Contract, message: string }>(`${API_URL}/api/contracts/${_id}`, {contract: contractToEdit});
  }

  editContractStatus(_id: string, newStatus: string): Observable<{ updatedContract: Contract, message: string } | { message: string, error: any }> {
    return this.http.patch<{ updatedContract: Contract, message: string } | { message: string, error: any }>(`${API_URL}/api/contracts/${_id}/status`, {status: newStatus});
  }

  createAuthor(newAuthor: Author): Observable<Author> {
    return this.http.post<Author>(`${API_URL}/api/authors`, { author: newAuthor });
  }

  getAuthors(): Observable<{ authors: Author[] }> {
    return this.http.get<{ authors: Author[] }>(`${API_URL}/api/authors`);
  }

  getAuthorByEmail(email: string): Observable<{ author: Author }> {
    return this.http.get<{ author: Author }>(`${API_URL}/api/authors/${email}`);
  }
}