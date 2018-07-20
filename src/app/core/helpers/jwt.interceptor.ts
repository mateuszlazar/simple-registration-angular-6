import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interceptors are really nice, as you said during interview :)

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authenticatedUser = JSON.parse(localStorage.getItem('authenticatedUser'));

        if (authenticatedUser && authenticatedUser.token) {
            request = request.clone({
                setHeaders: { 
                    Authorization: `Bearer ${authenticatedUser.token}`
                }
            });
        }

        return next.handle(request);
    }
}