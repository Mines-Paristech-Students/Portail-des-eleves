import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpResponse, HttpInterceptor, HttpHandler } from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { RequestCacheService } from './request-cache.service';

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
    constructor(private cache: RequestCacheService) {}
    
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        if (req.method != 'GET') { 
            return next.handle(req); 
        }
        const cachedResponse = this.cache.get(req);
        return cachedResponse ? of(cachedResponse) : this.sendRequest(req, next, this.cache);
    }
    
    sendRequest(req: HttpRequest<any>, next: HttpHandler, cache: RequestCacheService): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            tap(event => {
                if (event instanceof HttpResponse) {
                    cache.put(req, event);
                }
            })
        );
    }
}