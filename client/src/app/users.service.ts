import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user';
import { defaultIfEmpty, filter, flatMap } from 'rxjs/operators';
import { ApiData } from './api-data';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { ParamsSerializerService } from './params-serializer.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient, private paramsSerializer: ParamsSerializerService) {
  }

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>('./assets/users.json');
  }

  public getApiUsers(event: LazyLoadEvent): Observable<ApiData<User>> {
    const s = this.paramsSerializer.serialize(event);
    console.log(s);
    return this.http.get<ApiData<User>>('https://localhost:5001/api/users', {
      params: new HttpParams({
        fromString: s
      })
    });
  }

  public delete(id: number): Observable<User> {
    return this.http.delete<User>(`https://localhost:5001/api/users/${id}`);
  }
}
