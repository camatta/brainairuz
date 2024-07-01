import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "src/environments/environment";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('interceptor')
    if(req.url.includes('brainairuz.com.br/api/') || req.url.includes(environment.URL_API) && !req.url.includes('/api/auth/')) {
      const authToken = localStorage.getItem('token');
  
      const authReq = req.clone({
        setHeaders: {
          Authorization: authToken
        }
      });
  
      return next.handle(authReq);
    }

    return next.handle(req);
  }
}