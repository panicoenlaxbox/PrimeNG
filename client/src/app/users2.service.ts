import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user';
import { tap } from 'rxjs/operators';
import { ApiData } from './api-data';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { ParamsSerializerService } from './params-serializer.service';
import { catchError } from 'rxjs/operators';
import { CustomError } from './custom-error';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Users2Service {
  constructor(private http: HttpClient, private paramsSerializer: ParamsSerializerService) {
  }

  public get(event: LazyLoadEvent): Observable<ApiData<User> | CustomError> {
    const s = this.paramsSerializer.serialize(event);
    return this.http.get<ApiData<User>>('https://localhost:5001/api/users', {
      params: new HttpParams({
        fromString: s
      })
    }).pipe(catchError((error: HttpErrorResponse) => this.createCustomError(error)));
  }

  public delete(id: number): Observable<User | CustomError> {
    // return this.http.delete<User>(`https://localhost:5001/api/users/${id}`)
    //   .pipe(
    //     catchError((error: HttpErrorResponse) => this.createCustomError(error)));
    return this.http.delete<User>(`https://localhost:5001/api/users/${id}`);
  }

  private createCustomError(error: HttpErrorResponse): Observable<CustomError> {
    const customError = new CustomError();
    customError.statusText = error.statusText;
    customError.error = error.error;
    customError.message = 'An error has occurred. We are doing our best to fix it please try in a moment';
    return throwError(customError);
  }
}
