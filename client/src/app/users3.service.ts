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
export class Users3Service {
  constructor(private http: HttpClient, private paramsSerializer: ParamsSerializerService) {
  }

  public delete(id: number): Observable<User | HttpErrorResponse> {
    return this.http.delete<User>(`https://localhost:5001/api/users/${id}`);
  }
}
