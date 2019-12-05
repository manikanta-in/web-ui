import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { includeAuthHeaderKey } from '../constants/auth';

@Injectable({
    providedIn: 'root'
})
export class HttpManagerService {
    constructor(private _http: HttpClient) { }

    get<T>(url: string, options?: HttpOptions): Promise<T> {
        return this._http.get<T>(`${url}`, options)
            .pipe(
                catchError(this.handleError)
            )
            .toPromise();
    }

    getWithAuth<T>(url: string, options?: HttpOptions): Promise<T> {
        options = this.setAuthHeader(options);

        return this._http.get<T>(`${url}`, options)
            .pipe(
                catchError(this.handleError)
            )
            .toPromise();
    }

    post<T>(url: string, body: any, options?: HttpOptions): Promise<T> {
        return this._http.post<T>(`${url}`, body, options)
            .pipe(
                catchError(this.handleError)
            )
            .toPromise();
    }

    postWithAuth<T>(url: string, body: any, options?: HttpOptions): Promise<T> {
        options = this.setAuthHeader(options);

        return this._http.post<T>(`${url}`, body, options)
            .pipe(
                catchError(this.handleError)
            )
            .toPromise();
    }

    patch<T>(url: string, body: any, options?: HttpOptions): Promise<T> {
        return this._http.patch<T>(`${url}`, body, options)
            .pipe(
                catchError(this.handleError)
            )
            .toPromise();
    }

    put<T>(url: string, body: any, options?: HttpOptions): Promise<T> {
      return this._http.put<T>(`${url}`, body, options)
          .pipe(
              catchError(this.handleError)
          )
          .toPromise();
    }

    patchWithAuth<T>(url: string, body: any, options?: HttpOptions): Promise<T> {
        options = this.setAuthHeader(options);

        return this._http.patch<T>(`${url}`, body, options)
            .pipe(
                catchError(this.handleError)
            )
            .toPromise();
    }

    delete(url: string, options?: HttpOptions): Promise<any> {
        return this._http.delete(`${url}`, options)
            .pipe(
                catchError(this.handleError)
            )
            .toPromise();
    }

    deleteWithAuth(url: string, options?: HttpOptions): Promise<any> {
        options = this.setAuthHeader(options);

        return this._http.delete(`${url}`, options)
            .pipe(
                catchError(this.handleError)
            )
            .toPromise();
    }

    private handleError(err: HttpErrorResponse): Observable<any> {
        let errorMessage = '';
        if (err.error instanceof ErrorEvent) {
            errorMessage = `An error occurred: ${err.error.message}`;
        } else {
            errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
        }
        console.error(errorMessage);
        return throwError(errorMessage);
    }

    private setAuthHeader(options: HttpOptions): HttpOptions {
        const authHeader = new HttpHeaders().set(includeAuthHeaderKey, '');
        if (!options) {
            options = { headers: authHeader };
        } else if (!options.headers) {
            options.headers = authHeader;
        } else {
            (options.headers as HttpHeaders).set(includeAuthHeaderKey, '');
        }

        return options;
    }
}

export interface HttpOptions {
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    observe?: 'body';
    params?: HttpParams | {
        [param: string]: string | string[];
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
}
