import { ErrorHandler, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor() { }
    handleError(error: Error | HttpErrorResponse) {
        if (error instanceof Error) {
            console.log(error.stack);
        } else if (error instanceof HttpErrorResponse) {
            console.log(error);
        }
        // throw error;
    }
}
