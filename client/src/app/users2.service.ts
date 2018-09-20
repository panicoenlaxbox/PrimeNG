import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user';
import { tap } from 'rxjs/operators';
import { ApiData } from './api-data';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { ParamsSerializerService } from './params-serializer.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Users2Service {
  constructor(private http: HttpClient, private paramsSerializer: ParamsSerializerService) {
  }

  public get(event: LazyLoadEvent): Observable<ApiData<User> | HttpErrorResponse> {
    return this.http.get<ApiData<User>>('https://localhost:5001/api/users', {
      params: new HttpParams({
        fromString: this.paramsSerializer.serialize(event)
      })
    });
    // .pipe(catchError((error: HttpErrorResponse) => this.createCustomHttpErrorResponse(error)));
  }

  // private createCustomHttpErrorResponse(error: HttpErrorResponse): Observable<CustomHttpErrorResponse> {
  //   const customHttpErrorResponse = new CustomHttpErrorResponse();
  //   customHttpErrorResponse.status = error.status;
  //   customHttpErrorResponse.statusText = error.statusText;
  //   customHttpErrorResponse.message = 'An error has occurred. We are doing our best to fix it please try in a moment';
  //   customHttpErrorResponse.error = error;
  //   return throwError(customHttpErrorResponse);
  // }
}
