import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(environment.URL_API + '/api/users');
  }

  getUserInfo(): Observable<any> {
    const token = localStorage.getItem('token') as any;
    const headers = new HttpHeaders().set('Authorization', token);
    return this.http.get<any>(environment.URL_API + '/api/users/me', { headers });
  }
}
