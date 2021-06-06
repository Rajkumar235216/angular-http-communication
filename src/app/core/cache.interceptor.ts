import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpEventType, HttpResponse } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import { HttpCacheService } from "app/core/http-cache.service";

@Injectable()
export class CacheInterceptor implements HttpInterceptor{
    constructor(private cacheResponse : HttpCacheService){}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        // pass non-cacheable request -- other than 'get' method and invalidate cache
        if(req.method != "GET"){
            console.log(`Invalidating Cache - ${req.method} - ${req.url}`);
            this.cacheResponse.invalidateCache();
            return next.handle(req);
        }
        
        // attempt to retrieve a cache response if 'get' method
        const cachedResponse:HttpResponse<any> = this.cacheResponse.get(req.url);

        // return cache response 
        if(cachedResponse){
            console.log(`Returning Cached Response : ${cachedResponse.url}`);
            console.log(cachedResponse);
            return of(cachedResponse);
        }

        // send response to server and add response to cache
        return next.handle(req)
        .pipe(
            tap(event =>{
                if(event instanceof HttpResponse){
                    console.log(`Adding item to cache : ${req.url}`);
                    this.cacheResponse.put(req.url, event);
                }
            })
        )

    }

}