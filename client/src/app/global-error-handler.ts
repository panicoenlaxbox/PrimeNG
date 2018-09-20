import { ErrorHandler, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomHttpErrorResponse } from './custom-http-error-response';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor() { }
    handleError(error: Error | CustomHttpErrorResponse) {
        if (error instanceof Error) {
            console.log(error.stack);
        } else if (error instanceof CustomHttpErrorResponse) {
            console.log(error);
        }
        // throw error;
    }
}
