import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { includeAuthHeaderKey } from '../constants/auth';
import { environmentConfig } from '../services/config-asset-loader.service';
import { AuthService } from './authservice';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private _authService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const newHeaders = {
            'Ocp-Apim-Subscription-Key': environmentConfig && environmentConfig['Ocp-Apim-Subscription-Key']
                ? environmentConfig['Ocp-Apim-Subscription-Key']
                : ''
        };

        if (request.headers.has(includeAuthHeaderKey)) {
            newHeaders[`Authorization`] = this._authService.authorizationHeader;
        }

        request = request.clone({
            setHeaders: newHeaders
        });

        return next.handle(request);
    }
}
