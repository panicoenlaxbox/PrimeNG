import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiErrorResponse } from './api-error-response';

@Injectable()
export class HttpErrorResponseInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            tap((x: HttpEvent<any>) => {
                // console.log('CustomHttpErrorResponseInterceptor', x);
            }),
            catchError((error: HttpErrorResponse) => {
                // logging
                return throwError(error);
            }));
    }

    // private createCustomHttpErrorResponse(error: HttpErrorResponse): CustomHttpErrorResponse {
    //     const customHttpErrorResponse = new CustomHttpErrorResponse();
    //     customHttpErrorResponse.status = error.status;
    //     customHttpErrorResponse.statusText = error.statusText;
    //     customHttpErrorResponse.message = (<ApiErrorResponse>error.error).FriendlyMessage;
    //     customHttpErrorResponse.wrapperError = error;
    //     return customHttpErrorResponse;
    // }
}
