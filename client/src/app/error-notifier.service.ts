import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorResponse } from './api-error-response';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ErrorNotifierService {

  constructor() { }

  public show(error: HttpErrorResponse) {
    console.log(error);
    const apiErrorResponse = (<ApiErrorResponse>error.error);
    console.log(apiErrorResponse.FriendlyMessage);
    console.log(apiErrorResponse.ExtraData);
    if (!environment.production) {
      console.log(apiErrorResponse.Debug);
    }
  }
}
