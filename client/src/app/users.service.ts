import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user';
import { defaultIfEmpty, filter, flatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient) {
  }

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>('./assets/users.json');
  }

  public getUser(index: number): Observable<User> {
    return this.getUsers().pipe(
      flatMap(data => data),
      filter(user => user.index === index),
      defaultIfEmpty(null));
  }
}
