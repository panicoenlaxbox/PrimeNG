import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { CustomHttpErrorResponse } from './custom-http-error-response';
import { catchError, tap } from 'rxjs/operators';
import { ApiErrorResponse } from './api-error-response';

@Injectable()
export class CustomHttpErrorResponseInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            tap((x: HttpEvent<any>) => {
                console.log('ServerErrorsInterceptor', x);
            }),
            catchError((error: HttpErrorResponse) => throwError(this.createCustomHttpErrorResponse(error))));
    }

    private createCustomHttpErrorResponse(error: HttpErrorResponse): CustomHttpErrorResponse {
        const customHttpErrorResponse = new CustomHttpErrorResponse();
        customHttpErrorResponse.status = error.status;
        customHttpErrorResponse.statusText = error.statusText;
        customHttpErrorResponse.message = (<ApiErrorResponse>error.error).FriendlyMessage;
        customHttpErrorResponse.error = error;
        return customHttpErrorResponse;
    }
}
