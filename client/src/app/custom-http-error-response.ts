import { HttpErrorResponse } from '@angular/common/http';

export class CustomHttpErrorResponse {
    error: HttpErrorResponse;
    status: number;
    statusText: string;
    message: string;
}
