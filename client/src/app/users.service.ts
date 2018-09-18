import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user';
import { defaultIfEmpty, filter, flatMap } from 'rxjs/operators';
import { ApiData } from './api-data';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient) {
  }

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>('./assets/users.json');
  }

  public getApiUsers(event: LazyLoadEvent): Observable<ApiData<User>> {
    const s = this.serializeParams(event);
    console.log(s);
    return this.http.get<ApiData<User>>('https://localhost:5001/api/users', {
      params: new HttpParams({
        fromString: s
      })
    });
  }

  public serializeParams(obj: Object) {
    let s = this._serializeParams(obj);
    if (s !== '') {
      s = s.substring(1, s.length);
    }
    return s;
  }

  private _serializeParams(obj: Object, prefix?: string) {
    prefix = prefix || '';
    let s = '';
    if (typeof obj !== 'object') {
      return `&${encodeURIComponent(prefix)}=${encodeURIComponent(obj)}`;
    }
    for (const prop in obj) {
      if (obj[prop] === null || obj[prop] === undefined) {
        continue;
      }
      if (Array.isArray(obj[prop])) {
        for (let index = 0; index < obj[prop].length; index++) {
          s += this._serializeParams(obj[prop][index], prefix + (prefix ? '.' : '') + prop + '[' + index + ']');
        }
      } else if (typeof obj[prop] === 'object') {
        s += this._serializeParams(obj[prop], prefix + (prefix ? '.' : '') + prop);
      } else {
        s += `&${encodeURIComponent((prefix ? prefix + '.' : '') + prop)}=${encodeURIComponent(obj[prop])}`;
      }
    }
    return s;
  }
}
