
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();

    // No token => proceed
    if (!token) return next.handle(req);

    // Don't attach token to auth endpoints
    const url = req.url || '';
    const isAuthEndpoint = url.includes('/api/auth/login/') || url.includes('/api/auth/register/')
      || url.includes('/api/auth/password-reset/');

    if (isAuthEndpoint) return next.handle(req);

    // DRF Token auth uses "Token <key>"
    const authReq = req.clone({
      setHeaders: { Authorization: `Token ${token}` }
    });
    return next.handle(authReq);
  }
}
