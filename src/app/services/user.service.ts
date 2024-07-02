import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export type User = {
  _id: string,
  email: string,
  name: string,
  password?: string,
  accessLevel: string,
  team: string,
  setor: string,
  setorTratado: string,
  funcao: string,
  status: string
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers(): Observable<{users: User[]}> {
    return this.http.get<{users: User[]}>(environment.URL_API + '/api/users');
  }

  getUserInfo(): Observable<User> {
    return this.http.get<User>(environment.URL_API + '/api/users/me');
  }

  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(environment.URL_API + `/api/users/${userId}`);
  }

  updateUser(user: User) {
    return this.http.put<User>(environment.URL_API + '/api/editar-usuario', user);
  }
  
}
