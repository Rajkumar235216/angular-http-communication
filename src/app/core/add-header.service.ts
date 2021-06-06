import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";

@Injectable()
export class AddHeaderInterceptor implements HttpInterceptor{
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log(`HttpHeaders -- ${req.url}`);
        let jsonreq: HttpRequest<any> = req.clone({
            setHeaders: {'Content-type' : 'application/json'}
        });
        return next.handle(jsonreq);
    }

}
