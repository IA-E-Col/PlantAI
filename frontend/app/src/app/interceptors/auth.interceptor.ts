import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    
    console.log('AuthInterceptor - Request URL:', request.url);
    console.log('AuthInterceptor - Token found:', !!token);
    console.log('AuthInterceptor - Token value:', token ? token.substring(0, 20) + '...' : 'null');
    
    // If token exists, add it to the Authorization header
    if (token) {
      const authRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('AuthInterceptor - Adding Authorization header');
      return next.handle(authRequest);
    }
    
    // If no token, proceed with the original request
    console.log('AuthInterceptor - No token, proceeding without Authorization header');
    return next.handle(request);
  }
}
