import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpResponse, HttpInterceptor, HttpHandler } from '@angular/common/http';
import { Router } from '@angular/router'
import { Observable, empty } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private router: Router) {}
    
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = request.clone({
            setHeaders: {
                'X-REQUESTED-WITH': 'XMLHttpRequest'
            },
            withCredentials: true
        });
        
        return next.handle(request).pipe(catchError(
            err => {
                if (err.status === 401 ){
                    this.router.navigate(['/login'])
                }
                return empty()
            }
        ))
    }
}