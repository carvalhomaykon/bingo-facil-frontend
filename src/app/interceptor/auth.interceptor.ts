import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private authService = inject(AuthService);
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    const token = this.authService.getToken();

    if (!token) {
      return next.handle(req);
    }

    const cloneReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      },
    });
    
    return next.handle(cloneReq);
  }

}
